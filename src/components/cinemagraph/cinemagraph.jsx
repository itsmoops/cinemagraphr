import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { withRouter } from 'react-router'
import styled from 'styled-components'
import * as globalActions from '../../actions/global-actions'
import * as userActions from '../../actions/user-actions'
import * as firebaseActions from '../../actions/firebase-actions'

const Theater = styled.div`
    background: black;
    display: flex;
    width: 100%;
    height: 100%;
    align-items: center;
    justify-content: center;
`

const Video = styled.video`
    width: 100%;
    height: 100%;
    object-fit: ${props => (props.theater ? '' : 'cover')};
`

class Cinemagraph extends React.Component {
    constructor() {
        super()
        this.state = {
            defaultSource:
                'https://firebasestorage.googleapis.com/v0/b/cinemagraphr-dev.appspot.com/o/cinemagraphs%2FRBQRk35.mp4?alt=media&token=887ca4b4-a454-4020-a92d-e48e4af6a4f9'
        }
    }
    render() {
        return (
            <Theater>
                <Video
                    src={this.props.source || this.state.defaultSource}
                    autoPlay
                    loop
                    theater={false} />
            </Theater>
        )
    }
}

function mapStateToProps(state) {
    return {
        global: state.global,
        user: state.user,
        firebase: state.firebase
    }
}

function mapDispatchToProps(dispatch) {
    return {
        globalActions: bindActionCreators(globalActions, dispatch),
        userActions: bindActionCreators(userActions, dispatch),
        firebaseActions: bindActionCreators(firebaseActions, dispatch)
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(withRouter(Cinemagraph))
