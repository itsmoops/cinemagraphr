import { withRouter } from 'react-router'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Text, Box } from 'rebass'
import Dropzone from 'react-dropzone'
import autosize from 'autosize'
import styled from 'styled-components'
import { Icon } from 'react-icons-kit'
import captureVideoFrame from 'capture-video-frame'
import { basic_video as basicVideo } from 'react-icons-kit/linea/basic_video'
import Flex from '../shared/flex'
import Message from '../shared/message'
import * as userActions from '../../actions/firebase-actions'
import * as firebaseActions from '../../actions/firebase-actions'
import * as globalActions from '../../actions/global-actions'
import Cinemagraph from '../cinemagraph/cinemagraph'
import Controls from '../cinemagraph/controls'
import {
    VALID_TYPES_AUDIO,
    VALID_TYPES_VIDEO,
    SIZE_LIMIT_AUDIO,
    SIZE_LIMIT_VIDEO
} from '../../constants/constants'
import { cleanCinemagraphData, googleCloudAPIKey } from '../../utilities/utilities'

const StyledIcon = styled(Icon)`
    cursor: pointer;
    margin: 0 15 15 15;
    &:hover > svg {
        position: relative;
    }
`

const StyledDropzone = styled(Dropzone)`
    z-index: 999;
    height: 100%;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 20 0 20;
    text-align: center;
`

const InputContainer = styled.div`
    display: flex;
    justify-content: center;
`

const StyledTextArea = styled.textarea`
    background: transparent;
    color: ${colors.font1};
    width: 100%;
    min-height: 35px;
    font-size: 2.5em;
    font-weight: 300;
    padding: 5 0 5 15;
    margin: 10 0 10 0;
    border: none;
    border-bottom: none;
    outline: none;
    overflow: auto;
    box-shadow: none;
    border-radius: 0px;
    text-transform: lowercase;
    resize: none;
    &:focus {
        border-bottom: none;
    }
    text-align: center;
    ::placeholder {
        color: ${colors.font1};
    }
`
class Create extends React.Component {
    constructor() {
        super()
        document.title = 'create'
        this.state = {
            errorMessage: '',
            cinemagraph: {},
            audio: [],
            title: ''
        }
    }
    componentDidUpdate(prevProps) {
        if (prevProps !== this.props && this.props.firebase.fileURL) {
            this.setState(prevState => ({
                user: {
                    uid: this.props.user.uid,
                    username: this.props.user.displayName
                },
                url: this.props.firebase.fileURL,
                type: this.props.firebase.contentType,
                theater: prevState.theater || false,
                audio: [],
                upvotes: 0,
                downvotes: 0
            }))
        }
    }
    checkImageContent = async file => {
        return new Promise((resolve, reject) => {
            try {
                const fetchImgData = async base64Img => {
                    const resp = await fetch(
                        `https://vision.googleapis.com/v1/images:annotate?key=${googleCloudAPIKey}`,
                        {
                            method: 'POST',
                            body: JSON.stringify({
                                requests: [
                                    {
                                        image: {
                                            content: base64Img
                                        },
                                        features: [
                                            {
                                                type: 'SAFE_SEARCH_DETECTION'
                                            }
                                        ]
                                    }
                                ]
                            })
                        }
                    )
                    if (resp.ok) {
                        const data = resp.ok && (await resp.json())
                        const annotation = data.responses[0].safeSearchAnnotation
                        const safeSearchData = {
                            adult: annotation.adult,
                            violence: annotation.violence
                        }
                        const adult = Object.values(safeSearchData).some(
                            value => value === 'LIKELY' || value === 'VERY_LIKELY'
                        )

                        resolve(adult)
                    }
                    resolve(false)
                }

                if (file.type === 'video/mp4') {
                    const video = document.createElement('video')
                    video.src = file.preview
                    video.onloadeddata = () => {
                        const frame = captureVideoFrame(video, 'png', 1)
                        const base64Img = frame.dataUri.replace('data:image/png;base64,', '')
                        fetchImgData(base64Img)
                    }
                } else if (file.type === 'image/gif') {
                    const reader = new FileReader()
                    reader.readAsDataURL(file)
                    reader.onloadend = async () => {
                        const base64Img = reader.result.replace('data:image/gif;base64,', '')
                        fetchImgData(base64Img)
                    }
                }
            } catch (err) {
                reject(err)
            }
        })
    }
    validateFile = async (file, validTypes, maxSize) => {
        this.props.globalActions.loadingStateChange(true)
        if (!validTypes.includes(file.type)) {
            this.props.globalActions.loadingStateChange(false)
            this.setState({
                errorMessage: 'Invalid file type'
            })
            return
        }
        if (file.size > maxSize) {
            this.props.globalActions.loadingStateChange(false)
            this.setState({
                errorMessage: `File too large, must be less than ${maxSize / 1000000}MB`
            })
            return
        }
        if (this.state.audio.find(track => track.name === file.name)) {
            this.props.globalActions.loadingStateChange(false)
            this.setState({
                errorMessage: `Audio files must have unique names`
            })
            return
        }
        if (VALID_TYPES_VIDEO.includes(file.type)) {
            const adult = await this.checkImageContent(file)

            if (adult) {
                this.props.globalActions.loadingStateChange(false)
                this.setState({
                    errorMessage: `Cinemagraph contains graphic content`
                })
                return
            }
        }

        this.props.globalActions.loadingStateChange(false)
        this.setState({ errorMessage: '' })
        return file
    }
    handleUploadCinemagraph = async acceptedFiles => {
        if (acceptedFiles && acceptedFiles.length) {
            const file = await this.validateFile(
                acceptedFiles[0],
                VALID_TYPES_VIDEO,
                SIZE_LIMIT_VIDEO
            )
            if (file) {
                this.setState(
                    {
                        cinemagraph: file
                    },
                    () => {
                        autosize(this.textarea)
                    }
                )
            }
        } else {
            throw new Error('Invalid file')
        }
    }
    handleUploadAudio = async acceptedFiles => {
        if (acceptedFiles && acceptedFiles.length) {
            const file = await this.validateFile(
                acceptedFiles[0],
                VALID_TYPES_AUDIO,
                SIZE_LIMIT_AUDIO
            )
            if (file && this.state.audio.length < 3) {
                file.volume = 1
                file.loop = false
                file.mute = false
                const mergedAudio = [...this.state.audio, file]
                this.setState({
                    audio: mergedAudio
                })
            }
        } else {
            throw new Error('Invalid file')
        }
    }
    handleRemoveAudio = e => {
        const trackName = e.currentTarget.dataset.trackName
        const filteredAudio = this.state.audio.filter(track => track.name !== trackName)
        this.setState({
            audio: filteredAudio
        })
    }
    handleUpdateAudio = (name, type, value) => {
        const track = this.state.audio.filter(track => track.name === name)[0]
        track[type] = value
    }
    handleSave = async e => {
        e.preventDefault()
        if (!this.form.checkValidity()) {
            this.submitButton.click()
            return
        }
        if (Object.keys(this.state.cinemagraph).length > 0) {
            // first upload files
            const { cinemagraph, audio } = this.state

            // upload cinemegraph
            const cinemagraphData = await this.props.firebaseActions.uploadFile({
                file: cinemagraph,
                directory: 'cinemagraphs',
                name: cinemagraph.name,
                type: cinemagraph.type
            })

            const audioData = []
            // upload audio
            if (audio.length > 0) {
                for (const track of audio) {
                    audioData.push({
                        ...(await this.props.firebaseActions.uploadFile({
                            file: track,
                            directory: 'audio',
                            name: track.name,
                            type: track.type
                        })),
                        volume: track.volume,
                        loop: track.loop,
                        mute: track.mute
                    })
                }
            }

            Object.keys(cinemagraphData).forEach(key => {
                if (cinemagraphData[key] === undefined) {
                    delete cinemagraphData[key]
                }
            })

            audioData.forEach(track => {
                Object.keys(track).forEach(key => {
                    if (track[key] === undefined) {
                        delete track[key]
                    }
                })
            })

            const data = {
                user: {
                    uid: this.props.user.uid,
                    username: this.props.user.displayName
                },
                bucket: cinemagraphData.bucket,
                type: cinemagraphData.contentType,
                fileURL: cinemagraphData.fileURL,
                fullPath: cinemagraphData.fullPath,
                name: cinemagraphData.name,
                title: this.state.title.toLowerCase(),
                size: cinemagraphData.size,
                timeCreated: cinemagraphData.timeCreated,
                created: new Date().getTime(),
                theater: this.state.theater,
                userFavorites: {},
                upvotes: 1,
                userUpvotes: {
                    [this.props.user.uid]: true
                },
                downvotes: 0,
                userDownvotes: {},
                ratio: 1,
                audio: audioData.map(track => ({
                    bucket: track.bucket,
                    type: track.contentType,
                    fileURL: track.fileURL,
                    fullPath: track.fullPath,
                    name: track.name,
                    size: track.size,
                    loop: track.loop,
                    volume: track.volume,
                    mute: track.mute,
                    timeCreated: track.timeCreated
                }))
            }
            const postId = await this.props.firebaseActions.pushData('cinemagraphs', data)
            this.props.history.push(`/?id=${postId}`)
        } else {
            this.setState({
                errorMessage: 'No cinemagraph uploaded'
            })
        }
    }
    handleInputChange = e => {
        const name = e.target.name
        const value = e.target.value
        this.setState({ [name]: value })
    }
    preventNewline = e => {
        if (e.keyCode === 13) {
            e.preventDefault()
            this.handleSave(e)
        }
    }
    render() {
        const { cinemagraph, audio, errorMessage, theater } = this.state
        return (
            <div>
                <Cinemagraph cinemagraph={cinemagraph} theater={theater} />
                <Controls
                    creatorMode
                    cinemagraph={!!Object.keys(cinemagraph).length}
                    audio={audio}
                    handleUploadAudio={this.handleUploadAudio}
                    handleRemoveAudio={this.handleRemoveAudio}
                    handleUpdateAudio={this.handleUpdateAudio}
                    handleSave={this.handleSave}
                    toggleTheaterMode={() =>
                        this.setState(prevState => ({
                            theater: !prevState.theater
                        }))
                    }
                />
                <Flex>
                    {Object.keys(cinemagraph).length > 0 ? (
                        <Box w={[1, 1 / 2, 1 / 3, 1 / 4]} m="auto" ml={20} mr={20}>
                            <form ref={f => (this.form = f)} onSubmit={this.handleSave}>
                                <InputContainer>
                                    <StyledTextArea
                                        innerRef={ta => (this.textarea = ta)}
                                        maxLength={100}
                                        name="title"
                                        placeholder="Title"
                                        onChange={this.handleInputChange}
                                        onKeyDown={this.preventNewline}
                                        autoComplete="off"
                                        required
                                    />
                                </InputContainer>
                                <button
                                    style={{ display: 'none' }}
                                    type="submit"
                                    ref={b => (this.submitButton = b)}
                                />
                            </form>
                            {errorMessage && <Message>{errorMessage}</Message>}
                        </Box>
                    ) : (
                        <Box w={1} m="auto">
                            <StyledDropzone onDrop={this.handleUploadCinemagraph}>
                                <div>
                                    <StyledIcon size={64} icon={basicVideo} />
                                    <Text>
                                        Click or drag a file to upload a cinemagraph (.gif or .mp4)
                                    </Text>
                                    {errorMessage && <Message>{errorMessage}</Message>}
                                </div>
                            </StyledDropzone>
                        </Box>
                    )}
                </Flex>
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        user: state.user,
        firebase: state.firebase
    }
}

function mapDispatchToProps(dispatch) {
    return {
        userActions: bindActionCreators(userActions, dispatch),
        firebaseActions: bindActionCreators(firebaseActions, dispatch),
        globalActions: bindActionCreators(globalActions, dispatch)
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(withRouter(Create))
