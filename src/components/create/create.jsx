import { withRouter } from 'react-router'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Text, Box } from 'rebass'
import Dropzone from 'react-dropzone'
import styled from 'styled-components'
import { Icon } from 'react-icons-kit'
import { basic_video as basicVideo } from 'react-icons-kit/linea/basic_video'
import Flex from '../shared/flex'
import Message from '../shared/message'
import * as userActions from '../../actions/firebase-actions'
import * as firebaseActions from '../../actions/firebase-actions'
import Cinemagraph from '../cinemagraph/cinemagraph'
import Controls from '../cinemagraph/controls'
import { cleanCinemagraphData } from '../../utilities/utilities.js'
import { debug } from 'util'

const StyledIcon = styled(Icon)`
    cursor: pointer;
    margin: 0 15 15 15;
    &:hover > svg {
        position: relative;
    }
`

const StyledDropzone = styled(Dropzone)`
    z-index: 999;
    height: 200px;
    border-width: 1px;
    border-color: rgb(102, 102, 102);
    border-style: dashed;
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

const StyledInput = styled.input`
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
    validateFile = (file, validTypes, maxSize) => {
        if (!validTypes.includes(file.type)) {
            this.setState({
                errorMessage: 'Invalid file type'
            })
            return
        }
        if (file.size > maxSize) {
            this.setState({
                errorMessage: `File too large, must be less than ${maxSize / 1000000}MB`
            })
            return
        }
        if (this.state.audio.find(track => track.name === file.name)) {
            this.setState({
                errorMessage: `Audio files must have unique names`
            })
            return
        }
        this.setState({ errorMessage: '' })
        return file
    }
    handleUploadCinemagraph = async (acceptedFiles, rejectedFiles) => {
        if (acceptedFiles && acceptedFiles.length === 1) {
            const file = this.validateFile(
                acceptedFiles[0],
                ['image/gif', 'video/mp4', 'video/webm'],
                5000000
            )
            if (file) {
                this.setState({
                    cinemagraph: file
                })
            }
        } else {
            throw new Error('Invalid file')
        }
    }
    handleUploadAudio = async (acceptedFiles, rejectedFiles) => {
        if (acceptedFiles && acceptedFiles.length === 1) {
            const file = this.validateFile(acceptedFiles[0], ['audio/mp3', 'audio/x-m4a'], 10000000)
            if (file && this.state.audio.length < 3) {
                file.volume = 1
                file.loop = false
                file.mute = false
                const mergedAudio = [...this.state.audio, file]
                this.setState({
                    audio: mergedAudio
                })
            }
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
                title: this.state.title,
                size: cinemagraphData.size,
                timeCreated: cinemagraphData.timeCreated,
                created: new Date().getTime(),
                theater: this.state.theater,
                userFavorites: [],
                upvotes: 1,
                userUpvotes: [this.props.user.uid],
                downvotes: 0,
                userDownvotes: [],
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
            await this.props.firebaseActions.updateData(
                `users`,
                {
                    cinemagraphs: {
                        [postId]: cleanCinemagraphData(data)
                    }
                },
                this.props.user.uid,
                true
            )
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
    render() {
        const { cinemagraph, audio, errorMessage } = this.state
        return (
            <div>
                <Cinemagraph cinemagraph={cinemagraph} theater={this.state.theater} />
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
                    <Box w={[1, 3 / 4, 2 / 3, 1 / 3]} m="auto" ml={20} mr={20}>
                        {Object.keys(cinemagraph).length > 0 ? (
                            <form ref={f => (this.form = f)} onSubmit={this.handleSave}>
                                <InputContainer>
                                    <StyledInput
                                        name="title"
                                        placeholder="Title"
                                        onChange={this.handleInputChange}
                                        required
                                    />
                                </InputContainer>
                                <button
                                    style={{ display: 'none' }}
                                    type="submit"
                                    ref={b => (this.submitButton = b)}
                                />
                            </form>
                        ) : (
                            <StyledDropzone onDrop={this.handleUploadCinemagraph}>
                                <div>
                                    <StyledIcon size={64} icon={basicVideo} />
                                    <Text>
                                        {!cinemagraph.preview
                                            ? 'Click or drag a file to upload a cinemagraph (.gif, .mp4 or .webm)'
                                            : 'Choose a different file'}
                                    </Text>
                                </div>
                            </StyledDropzone>
                        )}
                        {errorMessage && <Message>{errorMessage}</Message>}
                    </Box>
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
        firebaseActions: bindActionCreators(firebaseActions, dispatch)
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(withRouter(Create))
