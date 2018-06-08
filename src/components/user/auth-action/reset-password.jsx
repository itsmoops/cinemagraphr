import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as userActions from '../../../actions/user-actions'
import Input from '../../shared/input'
import Button from '../../shared/button'
import Message from '../../shared/message'

class ResetPassword extends React.Component {
	componentWillMount() {
		document.title = 'Reset Password'
		this.props.actions.verifyPasswordResetCode(this.props.params.oobCode)
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
		const { message, passwordUpdated } = this.props.user
		const thankYou = (
			<Container>
				<Heading mb={20}>Password Changed</Heading>
				<Text>Thanks! You can now sign in with your new password.</Text>
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
					{message && <Message>{message}</Message>}
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

export default connect(mapStateToProps, mapDispatchToProps)(ResetPassword)
