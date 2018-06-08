import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { BrowserRouter as Router } from 'react-router-dom'
import { Box, Heading, Container, Text } from 'rebass'
import * as userActions from '../../actions/user-actions'
import Flex from '../shared/flex'
import Input from '../shared/input'
import Button from '../shared/button'
import Message from '../shared/message'

class ForgotPassword extends React.Component {
	state = {
		email: ''
	}
	componentWillMount() {
		document.title = 'Forgot Password'
	}
	componentWillUnmount() {
		this.props.actions.sanitizeUserState()
		this.props.actions.sanitizeUserErrorState()
	}
	componentWillReceiveProps(nextProps) {
		if (nextProps.user.authenticated) {
			this.props.history.push('/')
		}
	}
	handleInputChange = e => {
		const type = e.target.type
		const value = e.target.value
		this.setState({ [type]: value })
	}
	onHandleSubmit = async e => {
		e.preventDefault()
		this.props.actions.sendPasswordResetEmail(this.state.email)
	}
	render() {
		const { message, emailSent } = this.props.user
		const thankYou = (
			<Container>
				<Heading mb={20}>Recover Password</Heading>
				<Text>Thanks! Please check your email for reset instructions.</Text>
			</Container>
		)
		const resetForm = (
			<Container>
				<form onSubmit={this.onHandleSubmit}>
					<Heading mb={20}>Recover Password</Heading>
					<Text>
						Enter your email address and a password reset email will be sent to you.
					</Text>
					<Input
						placeholder="Email"
						type="email"
						onChange={this.handleInputChange}
						required
					/>

					<Button>Submit</Button>
					{message && <Message>{message}</Message>}
				</form>
			</Container>
		)
		return (
			<Flex>
				<Box w={[1, 3 / 4, 2 / 3, 1 / 2]} m="auto">
					{emailSent ? thankYou : resetForm}
				</Box>
			</Flex>
		)
	}
}

function mapStateToProps(state, ownProps) {
	return { user: state.user }
}

function mapDispatchToProps(dispatch) {
	return {
		actions: bindActionCreators(userActions, dispatch)
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(ForgotPassword)
