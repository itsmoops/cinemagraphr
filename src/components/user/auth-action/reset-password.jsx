import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import { bindActionCreators } from 'redux'
import { Container, Heading, Text } from 'rebass'
import styled from 'styled-components'
import * as userActions from '../../../actions/user-actions'
import Input from '../../shared/input'
import Button from '../../shared/button'
import Message from '../../shared/message'
import Link from '../../shared/link'

class ResetPassword extends React.Component {
    constructor() {
        super()
        document.title = 'Reset Password'
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.params !== this.props.params && nextProps.params.oobCode) {
            this.props.actions.verifyPasswordResetCode(nextProps.params.oobCode)
        }
    }
    componentWillUnmount() {
        this.props.actions.sanitizeUserState()
        this.props.actions.sanitizeUserErrorState()
    }
    handleInputChange = e => {
        const name = e.target.name
        const value = e.target.value
        this.setState({ [name]: value })
    }
    onHandleSubmit = async e => {
        e.preventDefault()
        if (this.props.user.codeVerified) {
            await this.props.actions.confirmPasswordReset(
                this.props.params.oobCode,
                this.state.newPassword
            )
        }
    }
    render() {
        const { errorMessage, passwordUpdated } = this.props.user
        const thankYou = (
            <Container>
                <Heading mb={20} f={40}>
                    Password Changed
                </Heading>
                <Text align="center">
                    You can now <Link to={'login'}>log in</Link> with your new password.
                </Text>
            </Container>
        )
        const resetForm = (
            <Container>
                <form onSubmit={this.onHandleSubmit}>
                    <h1>Reset Your Password</h1>
                    <Input
                        placeholder="New Password"
                        type="password"
                        name="newPassword"
                        onChange={this.handleInputChange}
                        required
                        toggleHiddenText
                        disabled={!this.props.user.codeVerified}
                    />
                    <Button disabled={!this.props.user.codeVerified}>Reset</Button>
                    {errorMessage && <Message>{errorMessage}</Message>}
                </form>
            </Container>
        )
        return passwordUpdated ? thankYou : resetForm
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

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(withRouter(ResetPassword))
