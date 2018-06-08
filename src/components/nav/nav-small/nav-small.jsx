import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import styled, { css, keyframes } from 'styled-components'
import { Container } from 'rebass'
import { thinDown } from 'react-icons-kit/entypo/thinDown'
import { userCircle } from 'react-icons-kit/fa/userCircle'
import { gear } from 'react-icons-kit/fa/gear'
import { signOut } from 'react-icons-kit/fa/signOut'
import * as globalActions from '../../../actions/global-actions'
import * as userActions from '../../../actions/user-actions'
import NavItem from './nav-item-small'
import Divider from '../../shared/divider'

const animationTime = '0.3s'
const menuMarginTop = '-250%'

const StyledNavContainer = styled.div`
	background: ${colors.background};
	position: fixed;
	width: 100%;
	height: ${props => props.theme.navBarHeight};
	z-index: 100;
`

const StyledChevron = styled.button`
	border: none;
	outline: none;
	cursor: pointer;
	background: ${colors.background};
	padding: 24 20 20 20;
	-webkit-tap-highlight-color: rgba(0, 0, 0, 0);
`

const iconRotateUp = keyframes`
	from {
		-webkit-transform: rotate(0deg);
		-moz-transform: rotate(0deg);
		-o-transform: rotate(0deg);
		-ms-transform: rotate(0deg);
		transform: rotate(0deg);
	}
	to {
		-webkit-transform: rotate(180deg);
		-moz-transform: rotate(180deg);
		-o-transform: rotate(180deg);
		-ms-transform: rotate(180deg);
		transform: rotate(180deg);
	}
`

const iconRotateDown = keyframes`
	from {
		-webkit-transform: rotate(180deg);
		-moz-transform: rotate(180deg);
		-o-transform: rotate(180deg);
		-ms-transform: rotate(180deg);
		transform: rotate(180deg);
	}
	to {
		-webkit-transform: rotate(0deg);
		-moz-transform: rotate(0deg);
		-o-transform: rotate(0deg);
		-ms-transform: rotate(0deg);
		transform: rotate(0deg);
	}
`

const StyledIcon = styled(Icon)`
	${props => {
		if (props.open) {
			return css`
				animation: ${iconRotateUp} ${animationTime} forwards;
			`
		} else if (props.open !== undefined) {
			return css`
				animation: ${iconRotateDown} ${animationTime} forwards;
			`
		}
	}};
`

const menuSlideUp = keyframes`
	from {
		margin-top: 0%;
	}
	to {
		margin-top: ${menuMarginTop};
	}
`

const menuSlideDown = keyframes`
	from {
		margin-top: ${menuMarginTop};
	}
	to {
		margin-top: 0%;
	}
`

const StyledMenu = styled.div`
	margin-top: ${menuMarginTop};
	padding-top: ${props => props.theme.navBarHeight};
	background-color: ${colors.background};
	position: absolute;
	height: calc(100% - ${props => props.theme.navBarHeight});
	width: 100%;
	z-index: 99;
	${props => {
		if (props.open) {
			return css`
				animation: ${menuSlideDown} ${animationTime} forwards;
			`
		} else if (props.open !== undefined) {
			return css`
				animation: ${menuSlideUp} ${animationTime} forwards;
			`
		}
	}};
`

class NavSmall extends React.Component {
	handleIconClick = () => {
		this.props.globalActions.toggleMenuDropdown(!this.props.global.menuOpen)
	}
	handleItemClick = () => {
		this.props.globalActions.toggleMenuDropdown(!this.props.global.menuOpen)
	}
	handleLogout = () => {
		this.props.userActions.userLogout()
		this.handleItemClick()
	}
	render() {
		const user = this.props.user
		const userName = user.displayName || user.email

		const guestMenu = (
			<Container px={0}>
				<NavItem
					linkTo="/sign-up"
					value="Sign Up"
					active={this.props.active === 'sign-up'}
					onClick={this.handleItemClick}
				/>
				<NavItem
					linkTo="/login"
					value="Login"
					active={this.props.active === 'login'}
					onClick={this.handleItemClick}
				/>
			</Container>
		)
		const userMenu = (
			<Container px={0}>
				<NavItem
					linkTo="/profile"
					value="Edit Profile"
					active={this.props.active === 'profile'}
					icon={userCircle}
					onClick={this.handleItemClick}
				/>
				<NavItem
					linkTo="/account"
					value="Account Settings"
					active={this.props.active === 'account'}
					icon={gear}
					onClick={this.handleItemClick}
				/>
				<NavItem value="Logout" icon={signOut} onClick={this.handleLogout} />
			</Container>
		)

		return (
			<Container px={0}>
				<StyledNavContainer>
					<StyledChevron onClick={this.handleIconClick}>
						<StyledIcon open={this.props.global.menuOpen} icon={thinDown} />
					</StyledChevron>
				</StyledNavContainer>
				<StyledMenu open={this.props.global.menuOpen}>
					<NavItem
						linkTo="/"
						value="Home"
						active={this.props.active === ''}
						onClick={this.handleItemClick}
					/>
					<NavItem
						linkTo="/about"
						value="About"
						active={this.props.active === 'about'}
						onClick={this.handleItemClick}
					/>
					<Divider />
					{user.authenticated ? userMenu : guestMenu}
					<Divider />
					<NavItem
						linkTo="/help"
						value="Help"
						active={this.props.active === 'help'}
						onClick={this.handleItemClick}
					/>
				</StyledMenu>
			</Container>
		)
	}
}

function mapStateToProps(state, ownProps) {
	return {
		global: state.global,
		user: state.user
	}
}

function mapDispatchToProps(dispatch) {
	return {
		globalActions: bindActionCreators(globalActions, dispatch),
		userActions: bindActionCreators(userActions, dispatch)
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(NavSmall)
