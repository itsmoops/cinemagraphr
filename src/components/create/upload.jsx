import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import firebase from 'firebase/app'
import 'firebase/storage'
import Dropzone from 'react-dropzone'
import Flex from '../shared/flex'
import Message from '../shared/message'
import * as firebaseActions from '../../actions/firebase-actions'

class Upload extends React.Component {
    constructor() {
        super()
        document.title = 'Upload'
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
        } else {
            throw new Error('Invalid file')
        }
    }
    render() {
        const { message } = this.props.firebase
        return (
            <Flex>
                <Dropzone onDrop={this.onDrop} multiple={false} />
                {message && <Message>{message}</Message>}
            </Flex>
        )
    }
}

function mapStateToProps(state) {
    return {
        firebase: state.firebase
    }
}

function mapDispatchToProps(dispatch) {
    return {
        firebaseActions: bindActionCreators(firebaseActions, dispatch)
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Upload)
