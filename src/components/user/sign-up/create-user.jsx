import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Box, Heading, Container, Text } from 'rebass'
import * as userActions from '../../../actions/user-actions'
import Flex from '../../shared/flex'
import Input from '../../shared/input'
import Button from '../../shared/button'
import Message from '../../shared/message'

class CreateUser extends React.Component {
	state = {
		email: '',
		password: ''
	}
	handleInputChange = e => {
		const name = e.target.name
		const value = e.target.value
		this.setState({ [name]: value })
	}
	onHandleSubmit = async e => {
		e.preventDefault()
		await this.props.actions.userSignUp(this.state.email, this.state.password)
		if (!this.props.user.message) {
			this.props.handleStateChange('completeProfile')
		}
	}
	render() {
		const { message } = this.props.user
		return (
			<Container>
				<form onSubmit={this.onHandleSubmit}>
					<Heading mb={20}>Let's get started</Heading>
					<Input
						placeholder="Email"
						type="email"
						name="email"
						onChange={this.handleInputChange}
						required
						autocomplete="email"
					/>
					<Input
						placeholder="Password"
						type="password"
						name="password"
						onChange={this.handleInputChange}
						required
						toggleHiddenText
						autocomplete="password"
					/>
					<Button>Sign Up</Button>
					{message && <Message>{message}</Message>}
				</form>
			</Container>
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

export default connect(mapStateToProps, mapDispatchToProps)(CreateUser)
