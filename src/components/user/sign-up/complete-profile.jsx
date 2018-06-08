import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Box, Heading, Container, Text } from 'rebass'
import * as userActions from '../../../actions/user-actions'
import Flex from '../../shared/flex'
import Input from '../../shared/input'
import Button from '../../shared/button'
import Message from '../../shared/message'
import DatePicker from '../../shared/date-picker'
import StatePicker from '../../shared/state-picker'

class CompleteProfile extends React.Component {
	state = {
		address1: '',
		address2: '',
		city: '',
		firstName: '',
		lastName: '',
		state: '',
		zipcode: '',
		phoneNumber: ''
	}
	handleInputChange = e => {
		const name = e.target.name
		const value = e.target.value
		this.setState({ [name]: value })
	}
	onHandleSubmit = async e => {
		e.preventDefault()
		const userProfile = { ...this.state }
		const { month, day, year } = userProfile
		delete userProfile.month
		delete userProfile.day
		delete userProfile.year
		this.state.dateOfBirth = new Date(year, month - 1, day).toString()
		await this.props.actions.userCompleteProfile(userProfile)
		await this.props.actions.sendEmailVerification()
		if (!this.props.user.message && this.props.user.profileSaved) {
			this.props.handleStateChange('thankYou')
		}
	}
	render() {
		const { message, dateOfBirth } = this.props.user
		return (
			<Container>
				<form onSubmit={this.onHandleSubmit}>
					<Heading mb={20}>Complete your profile</Heading>
					<Input
						placeholder="First Name"
						type="text"
						name="firstName"
						onChange={this.handleInputChange}
						required
						autocomplete="fname"
					/>
					<Input
						placeholder="Last Name"
						type="text"
						name="lastName"
						onChange={this.handleInputChange}
						autocomplete="lname"
					/>
					<Input
						placeholder="Address Line 1"
						type="text"
						name="address1"
						onChange={this.handleInputChange}
						required
						autocomplete="address-line1"
					/>
					<Input
						placeholder="Address Line 2"
						type="text"
						name="address2"
						onChange={this.handleInputChange}
						autocomplete="address-line2"
					/>
					<Input
						placeholder="City"
						type="text"
						name="city"
						onChange={this.handleInputChange}
						required
						autocomplete="city"
					/>
					<StatePicker onChange={this.handleInputChange} />
					<Input
						placeholder="Zipcode"
						type="text"
						name="zipcode"
						onChange={this.handleInputChange}
						required
						autocomplete="zip"
					/>
					<DatePicker onChange={this.handleInputChange} />
					<Input
						placeholder="Phone Number"
						type="text"
						name="phoneNumber"
						onChange={this.handleInputChange}
						required
						autocomplete="phone"
					/>
					<Button>Complete Profile</Button>
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

export default connect(mapStateToProps, mapDispatchToProps)(CompleteProfile)
