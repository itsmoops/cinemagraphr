import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Text } from 'rebass'
import firebase from 'firebase/app'
import 'firebase/storage'
import Dropzone from 'react-dropzone'
import styled from 'styled-components'
import { Icon } from 'react-icons-kit'
import { basic_upload } from 'react-icons-kit/linea/basic_upload'
import Flex from '../shared/flex'
import Message from '../shared/message'
import Logo from '../shared/logo'
import * as userActions from '../../actions/firebase-actions'
import * as firebaseActions from '../../actions/firebase-actions'
import Cinemagraph from '../cinemagraph/cinemagraph'

const StyledIcon = styled(Icon)`
    cursor: pointer;
    margin: 0 15 0 15;
    &:hover > svg {
        position: relative;
    }
`

const StyledDropzone = styled(Dropzone)`
    position: absolute;
    z-index: 999;
    width: 700px;
    height: 200px;
    border-width: 1px;
    border-color: rgb(102, 102, 102);
    border-style: dashed;
    cursor: pointer;
`
class Upload extends React.Component {
    constructor() {
        super()
        document.title = 'Upload'
        this.state = {}
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
    onDrop = async (acceptedFiles, rejectedFiles) => {
        if (acceptedFiles && acceptedFiles.length === 1) {
            const file = acceptedFiles[0]
            await this.props.firebaseActions.uploadFile({
                file: file,
                directory: 'cinemagraphs',
                name: file.name,
                type: file.type,
                validFileTypes: ['video/mp4', 'image/gif']
            })
            // await this.props.firebaseActions.pushData({

            // })
        } else {
            throw new Error('Invalid file')
        }
    }
    handleAudio = () => {
        debugger
    }
    handleSave = () => {
        debugger
    }
    render() {
        const { message, fileURL } = this.props.firebase
        return (
            <div>
                <Cinemagraph
                    source={this.state.url}
                    theater={this.state.theater}
                    handleAudio={this.handleAudio}
                    toggleTheaterMode={() =>
                        this.setState(prevState => ({
                            theater: !prevState.theater
                        }))
                    }
                    handleSave={this.handleSave}
                />
                <Flex>
                    <StyledDropzone onDrop={this.onDrop} />
                    {!fileURL && <Logo size={50} animate />}
                    <Text>
                        {!fileURL
                            ? 'Click or drag to upload a cinemagraph (.gif or .mp4)'
                            : 'Start over'}
                    </Text>
                    {message && <Message>{message}</Message>}
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
