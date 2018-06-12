import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Text, Box } from 'rebass'
import Dropzone from 'react-dropzone'
import styled from 'styled-components'
import { Icon } from 'react-icons-kit'
import { basic_video as basicVideo } from 'react-icons-kit/linea/basic_video'
import Flex from '../shared/flex'
import Message from '../shared/message'
import Logo from '../shared/logo'
import * as userActions from '../../actions/firebase-actions'
import * as firebaseActions from '../../actions/firebase-actions'
import Cinemagraph from '../cinemagraph/cinemagraph'
import Controls from '../cinemagraph/controls'

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

const Container = styled.div``
class Upload extends React.Component {
    constructor() {
        super()
        document.title = 'Upload'
        this.state = {
            message: '',
            cinemagraph: {},
            audio: []
        }
    }
    componentDidUpdate(prevProps) {
        if (prevProps !== this.props && this.props.firebase.fileURL) {
            this.setState({
                user: {
                    uid: this.props.user.uid,
                    username: this.props.user.displayName
                },
                url: this.props.firebase.fileURL,
                type: this.props.firebase.contentType,
                theater: false,
                audio: {},
                upvotes: 0,
                downvotes: 0
            })
        }
    }
    validateFile = (file, validTypes, maxSize) => {
        if (!validTypes.includes(file.type)) {
            this.setState({
                message: 'Invalid file type'
            })
            return
        }
        if (file.size > maxSize) {
            this.setState({
                message: `File too large, must be less than ${maxSize / 1000000}MB`
            })
            return
        }
        if (this.state.audio.find(track => track.name === file.name)) {
            this.setState({
                message: `Audio files must have unique names`
            })
            return
        }
        this.setState({ message: '' })
        return file
    }
    handleUploadCinemagraph = async (acceptedFiles, rejectedFiles) => {
        if (acceptedFiles && acceptedFiles.length === 1) {
            const file = this.validateFile(acceptedFiles[0], ['video/mp4', 'image/gif'], 5000000)
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
                const mergedAudio = [...this.state.audio, file]
                this.setState({
                    audio: mergedAudio
                })
            }
        }
    }
    handleRemoveAudio = e => {
        const trackName = e.currentTarget.id
        const filteredAudio = this.state.audio.filter(track => track.name !== trackName)
        this.setState({
            audio: filteredAudio
        })
    }
    handleSave = async () => {
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
                    audioData.push(
                        await this.props.firebaseActions.uploadFile({
                            file: track,
                            directory: 'audio',
                            name: track.name,
                            type: track.type
                        })
                    )
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
                size: cinemagraphData.size,
                timeCreated: cinemagraphData.timeCreated,
                theater: false,
                upvotes: 0,
                downvotes: 0,
                audio: audioData.map(track => ({
                    bucket: track.bucket,
                    type: track.contentType,
                    fileURL: track.fileURL,
                    fullPath: track.fullPath,
                    name: track.name,
                    size: track.size,
                    timeCreated: track.timeCreated,
                    loop: true,
                    volume: 1
                }))
            }
            const postKey = await this.props.firebaseActions.pushData('cinemagraphs', data)
            await this.props.firebaseActions.updateData(
                `users/${this.props.user.uid}/cinemagraphs`,
                {
                    [postKey]: {
                        fileURL: cinemagraphData.fileURL
                    }
                }
            )
        } else {
            this.setState({
                message: 'No cinemagraph uplaoded'
            })
        }
    }
    render() {
        const { cinemagraph, audio, message } = this.state
        return (
            <div>
                <Cinemagraph cinemagraph={cinemagraph} theater={this.state.theater} />
                <Controls
                    audio={audio}
                    creatorMode
                    handleUploadAudio={this.handleUploadAudio}
                    handleRemoveAudio={this.handleRemoveAudio}
                    handleSave={this.handleSave}
                    toggleTheaterMode={() =>
                        this.setState(prevState => ({
                            theater: !prevState.theater
                        }))
                    }
                />
                <Flex>
                    <Box w={[1, 3 / 4, 2 / 3, 1 / 3]} m="auto" ml={20} mr={20}>
                        <StyledDropzone onDrop={this.handleUploadCinemagraph}>
                            <Container>
                                <StyledIcon size={64} icon={basicVideo} />
                                <Text>
                                    {!cinemagraph.preview
                                        ? 'Click or drag a file to upload a cinemagraph (.gif or .mp4)'
                                        : 'Upload a different file'}
                                </Text>
                            </Container>
                        </StyledDropzone>
                        {message && <Message>{message}</Message>}
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
)(Upload)
