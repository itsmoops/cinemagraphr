import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { withRouter } from 'react-router'
import styled from 'styled-components'
import { Container } from 'rebass'
import { userCircle } from 'react-icons-kit/fa/userCircle'
import { gear } from 'react-icons-kit/fa/gear'
import { question } from 'react-icons-kit/fa/question'
import { signOut } from 'react-icons-kit/fa/signOut'
import * as userActions from '../../../actions/user-actions'
import NavItem from './nav-item-large'
import Dropdown from './nav-dropdown'
import DropdownItem from './nav-dropdown-item'

const StyledNavContainer = styled.div`
	background: ${colors.background};
	position: fixed;
	width: 100%;
	height: ${props => props.theme.navBarHeight};
	z-index: 1;
	box-shadow: inset 0 -2px 0 ${colors.background.darken(0.2)};
`

const StyledDropdownContainer = styled.div`
	height: 100%;
	display: flex;
	align-items: center;
	float: right;
`

class NavLarge extends React.Component {
	handleLogout = () => {
		this.props.actions.userLogout()
		this.props.history.push('/')
	}
	render() {
		const user = this.props.user
		const userName = user.displayName || user.email
		const guestMenu = (
			<div>
				<NavItem
					linkTo="/login"
					value="Login"
					active={this.props.active === 'login'}
					align="right"
				/>
				<NavItem
					linkTo="/sign-up"
					value="Sign Up"
					active={this.props.active === 'sign-up'}
					align="right"
				/>
				<NavItem
					linkTo="/help"
					value="Help"
					active={this.props.active === 'help'}
					align="right"
				/>
			</div>
		)
		const userMenu = (
			<StyledDropdownContainer>
				<Dropdown value={userName}>
					<DropdownItem
						value="Edit Profile"
						linkTo="/profile"
						active={this.props.active === 'profile'}
						align="left"
						icon={userCircle}
					/>
					<DropdownItem
						value="Settings"
						linkTo="/account"
						active={this.props.active === 'account'}
						align="left"
						icon={gear}
					/>
					<DropdownItem
						value="Help"
						linkTo="/help"
						active={this.props.active === 'help'}
						align="left"
						icon={question}
					/>
					<DropdownItem
						value="Logout"
						align="left"
						onClick={this.handleLogout}
						icon={signOut}
					/>
				</Dropdown>
			</StyledDropdownContainer>
		)

		return (
			<StyledNavContainer>
				<NavItem linkTo="/" value="Home" active={this.props.active === ''} />
				<NavItem linkTo="/about" value="About" active={this.props.active === 'about'} />
				{user.authenticated ? userMenu : guestMenu}
			</StyledNavContainer>
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

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(NavLarge))
