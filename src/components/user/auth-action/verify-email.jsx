import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Heading, Container, Text } from 'rebass'
import * as userActions from '../../../actions/user-actions'
import Message from '../../shared/message'

class VerifyEmail extends React.Component {
    componentWillMount() {
        document.title = 'Verify Email'
        this.props.actions.verifyEmailCode(this.props.params.oobCode)
    }
    componentWillUnmount() {
        this.props.actions.sanitizeUserState()
        this.props.actions.sanitizeUserErrorState()
    }
    render() {
        const success = <Text>Success! Your email has been verified.</Text>
        const { codeVerified, message } = this.props.user
        return (
            <Container>
                <Heading mb={20}>Verify Email</Heading>
                {codeVerified && success}
                {message && <Message>{message}</Message>}
            </Container>
        )
    }
}

function mapStateToProps(state) {
    return { user: state.user }
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(userActions, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(VerifyEmail)
