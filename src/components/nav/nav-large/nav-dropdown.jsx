import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import onClickOutside from 'react-onclickoutside'
import styled from 'styled-components'
import * as globalActions from '../../../actions/global-actions'
import ProfilePicture from '../../shared/profile-picture'
import { thinDown } from 'react-icons-kit/entypo/thinDown'
import { thinUp } from 'react-icons-kit/entypo/thinUp'

const StyledDropdownButton = styled.button`
	outline: none;
	background: none;
	border: none;
	cursor: pointer;
`

const StyledDropdownContent = styled.div`
	width: 212px;
	border: 1px solid ${colors.background.darken(0.2)};
	display: none;
	position: absolute;
	background-color: ${colors.background};
	z-index: 1;
	top: 59px;
	right: 0;
	display: ${props => (props.open ? 'block' : 'none')};
`
const StyledIcon = styled(Icon)`
	padding-left: 5px;
`

const StyledProfilePictureContainer = styled.div`
	color: ${colors.background.darken(0.2)};
`

const DropdownHeader = horizontalCenter(props => (
	<StyledDropdownButton onClick={props.onClick}>{props.children}</StyledDropdownButton>
))

class Dropdown extends React.PureComponent {
	handleClickOutside = () => {
		this.props.actions.toggleMenuDropdown(false)
	}

	toggleDropDown = () => {
		this.props.actions.toggleMenuDropdown(!this.props.global.menuOpen)
	}

	render() {
		const { menuOpen } = this.props.global
		return (
			<div>
				<DropdownHeader onClick={this.toggleDropDown}>
					<StyledProfilePictureContainer>
						<ProfilePicture tiny />
					</StyledProfilePictureContainer>
					<StyledIcon icon={menuOpen ? thinUp : thinDown} />
				</DropdownHeader>
				<StyledDropdownContent open={this.props.global.menuOpen}>
					{this.props.children}
				</StyledDropdownContent>
			</div>
		)
	}
}

Dropdown.defaultProps = {
	value: ''
}

Dropdown.propTypes = {
	value: PropTypes.string
}

function mapStateToProps(state, ownProps) {
	return {
		global: state.global,
		user: state.user
	}
}

function mapDispatchToProps(dispatch) {
	return {
		actions: bindActionCreators(globalActions, dispatch)
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(onClickOutside(Dropdown))
