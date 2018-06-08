import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import firebase from 'firebase/app'
import 'firebase/storage'
import Dropzone from 'react-dropzone'
import Flex from '../shared/flex'
import Message from '../shared/message'
import * as globalActions from '../../actions/global-actions'
import * as firebaseActions from '../../actions/firebase-actions'

class Create extends React.Component {
    onDrop = async (acceptedFiles, rejectedFiles) => {
        const acceptedFileTypes = ['video/mp4', 'image/gif']
        if (acceptedFiles && acceptedFiles.length === 1) {
            const file = acceptedFiles[0]
            if (acceptedFileTypes.includes(file.type)) {
                await this.props.firebaseActions.uploadFile({
                    file: file,
                    directory: 'cinemagraphs',
                    name: file.name
                })
            } else {
                throw new Error('Invalid file type')
            }
        } else {
            throw new Error('Invalid file')
        }
    }
    render() {
        const { error } = this.props.firebase
        debugger
        return (
            <Flex>
                <Dropzone onDrop={this.onDrop} multiple={false} />
                {error && <Message>{error}</Message>}
            </Flex>
        )
    }
}

function mapStateToProps(state) {
    return {
        global: state.global,
        firebase: state.firebase
    }
}

function mapDispatchToProps(dispatch) {
    return {
        firebaseActions: bindActionCreators(firebaseActions, dispatch),
        globalActions: bindActionCreators(globalActions, dispatch)
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Create)
