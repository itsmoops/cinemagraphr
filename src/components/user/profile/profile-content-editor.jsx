import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import styled from 'styled-components'
import { Container, Label, Flex, Box } from 'rebass'
import * as userActions from '../../../actions/user-actions'
import * as globalActions from '../../../actions/global-actions'
import Button from '../../shared/button'
import Input from '../../shared/input'
import Message from '../../shared/message'
import DatePicker from '../../shared/date-picker'
import StatePicker from '../../shared/state-picker'

class ProfileContentEditor extends React.Component {
	state = {
		firstName: this.props.user.firstName,
		lastName: this.props.user.lastName,
		email: this.props.user.email,
		address1: this.props.user.address1,
		address2: this.props.user.address2,
		city: this.props.user.city,
		state: this.props.user.state,
		zipcode: this.props.user.zipcode,
		dateOfBirth: this.props.user.dateOfBirth,
		phoneNumber: this.props.user.phoneNumber
	}
	componentWillReceiveProps(nextProps) {
		if (nextProps.user) {
			if (!nextProps.user.authenticated) {
				this.props.history.push('/')
			}

			this.setState({
				firstName: nextProps.user.firstName,
				lastName: nextProps.user.lastName,
				email: nextProps.user.email,
				address1: nextProps.user.address1,
				address2: nextProps.user.address2,
				city: nextProps.user.city,
				state: nextProps.user.state,
				zipcode: nextProps.user.zipcode,
				month: '1',
				day: '1',
				year: new Date().getFullYear().toString(),
				dateOfBirth: nextProps.user.dateOfBirth,
				phoneNumber: nextProps.user.phoneNumber
			})
		}
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
		userProfile.dateOfBirth = new Date(year, month - 1, day).toString()
		await this.props.userActions.userUpdateProfile(userProfile)
	}
	render() {
		const { user } = this.props
		return (
			<Container px={0}>
				<form onSubmit={this.onHandleSubmit}>
					<Flex wrap>
						<Box w={[1, 1, 1 / 5]}>
							<Label pt={20} mb={0}>
								First Name
							</Label>
						</Box>
						<Box w={[1, 1, 4 / 5]}>
							<Input
								type="text"
								name="firstName"
								value={this.state.firstName || ''}
								onChange={this.handleInputChange}
								autocomplete="fname"
								required
							/>
						</Box>
						<Box w={[1, 1, 1 / 5]}>
							<Label pt={20} mb={0}>
								Last Name
							</Label>
						</Box>
						<Box w={[1, 1, 4 / 5]}>
							<Input
								type="text"
								name="lastName"
								value={this.state.lastName || ''}
								onChange={this.handleInputChange}
								autocomplete="lname"
								required
							/>
						</Box>
						<Box w={[1, 1, 1 / 5]}>
							<Label pt={20} mb={0}>
								Email Address
							</Label>
						</Box>
						<Box w={[1, 1, 4 / 5]}>
							<Input
								type="email"
								name="email"
								value={this.state.email || ''}
								onChange={this.handleInputChange}
								autocomplete="email"
								disabled
								required
							/>
						</Box>
						<Box w={[1, 1, 1 / 5]}>
							<Label pt={20} mb={0}>
								Address
							</Label>
						</Box>
						<Box w={[1, 1, 4 / 5]}>
							<Input
								placeholder="Line 1"
								type="text"
								name="address1"
								value={this.state.address1 || ''}
								onChange={this.handleInputChange}
								autocomplete="address-line1"
							/>
							<Input
								placeholder="Line 2"
								type="text"
								name="address2"
								value={this.state.address2 || ''}
								onChange={this.handleInputChange}
								autocomplete="address-line2"
							/>
						</Box>
						<Box w={[1, 1, 1 / 5]}>
							<Label pt={20} mb={0}>
								City
							</Label>
						</Box>
						<Box w={[1, 1, 4 / 5]}>
							<Input
								type="text"
								name="city"
								value={this.state.city || ''}
								onChange={this.handleInputChange}
								autocomplete="city"
							/>
						</Box>
						<Box w={[1, 1, 1 / 5]}>
							<Label pt={20} mb={0}>
								State
							</Label>
						</Box>
						<Box w={[1, 1, 4 / 5]}>
							<StatePicker
								onChange={this.handleInputChange}
								value={this.state.state}
							/>
						</Box>
						<Box w={[1, 1, 1 / 5]}>
							<Label pt={20} mb={0}>
								Zipcode
							</Label>
						</Box>
						<Box w={[1, 1, 4 / 5]}>
							<Input
								type="text"
								name="zipcode"
								value={this.state.zipcode || ''}
								onChange={this.handleInputChange}
								autocomplete="zip"
							/>
						</Box>
						<Box w={[1, 1, 1 / 5]}>
							<Label pt={20} mb={0}>
								Birth Date
							</Label>
						</Box>
						<Box w={[1, 1, 4 / 5]}>
							<DatePicker
								onChange={this.handleInputChange}
								date={this.state.dateOfBirth}
							/>
						</Box>
						<Box w={[1, 1, 1 / 5]}>
							<Label pt={20} mb={0}>
								Phone Number
							</Label>
						</Box>
						<Box w={[1, 1, 4 / 5]}>
							<Input
								type="tel"
								name="phoneNumber"
								value={this.state.phoneNumber || ''}
								onChange={this.handleInputChange}
								autocomplete="phone"
							/>
						</Box>
					</Flex>
					<Button>Save</Button>
				</form>
			</Container>
		)
	}
}

function mapStateToProps(state) {
	return { user: state.user }
}

function mapDispatchToProps(dispatch) {
	return {
		userActions: bindActionCreators(userActions, dispatch),
		globalActions: bindActionCreators(globalActions, dispatch)
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(ProfileContentEditor)
