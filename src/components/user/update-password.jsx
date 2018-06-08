import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Box, Heading, Container, Text } from 'rebass'
import * as userActions from '../../actions/user-actions'
import Flex from '../shared/flex'
import Input from '../shared/input'
import Button from '../shared/button'
import Message from '../shared/message'

class UpdatePassword extends React.Component {
	state = {
		currentPassword: '',
		newPassword: ''
	}
	componentWillMount() {
		document.title = 'Update Password'
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
		this.props.actions.userUpdatePassword(this.state.currentPassword, this.state.newPassword)
	}
	render() {
		const { message, passwordUpdated } = this.props.user
		const success = (
			<Container>
				<Heading mb={20}>Update Password</Heading>
				<Text>Success! Your password has been changed.</Text>
			</Container>
		)
		const updateForm = (
			<Container>
				<form onSubmit={this.onHandleSubmit}>
					<h1>Update Password</h1>
					<Input
						placeholder="Current Password"
						type="password"
						name="currentPassword"
						onChange={this.handleInputChange}
						required
					/>
					<Input
						placeholder="New Password"
						type="password"
						name="newPassword"
						onChange={this.handleInputChange}
						required
						toggleHiddenText
					/>
					<Button>Reset</Button>
					{message && <Message>{message}</Message>}
				</form>
			</Container>
		)
		return (
			<Flex>
				<Box w={[1, 2 / 3, 1 / 2]} m="auto">
					{passwordUpdated ? success : updateForm}
				</Box>
			</Flex>
		)
	}
}

function mapStateToProps(state, ownProps) {
	return {
		user: state.user
	}
}

function mapDispatchToProps(dispatch) {
	return {
		actions: bindActionCreators(userActions, dispatch)
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(UpdatePassword)
