import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import styled from 'styled-components'
import * as globalActions from '../../../actions/global-actions'
import { withRouter } from 'react-router'

const StyledDropdownLink = styled.a`
	position: relative;
	color: black;
	padding: 25px 16px;
	text-decoration: none;
	display: block;

	&:hover {
		cursor: pointer;
		color: ${colors.accent1};
	}

	&:focus {
		color: ${colors.accent1};
		outline: none;
	}

	&:after {
		width: 172;
		right: 20px;
		bottom: 0;
		position: absolute;
		border-bottom: 1px solid
			${props => (props.active ? colors.accent1 : colors.background.darken(0.2))};
		content: '';
	}

	&:hover:after {
		width: 172;
		right: 20px;
		bottom: 0;
		position: absolute;
		border-bottom: 1px solid ${colors.accent1};
		content: '';
	}
`

class DropdownItem extends React.PureComponent {
	toggleMenu = () => {
		this.props.actions.toggleMenuDropdown(!this.props.global.menuOpen)
	}
	render() {
		const icon = this.props.icon ? <Icon icon={this.props.icon} /> : undefined

		const Item = horizontalCenter(props => (
			<StyledDropdownLink
				active={this.props.active}
				onClick={() => {
					this.props.linkTo && this.props.history.push(this.props.linkTo)
					this.props.onClick && this.props.onClick()
					this.toggleMenu()
				}}
				role="button"
				tabIndex="0"
			>
				{props.children}
			</StyledDropdownLink>
		))
		return (
			<Item>
				{icon} {this.props.value}
			</Item>
		)
	}
}

DropdownItem.defaultProps = {
	value: '',
	icon: undefined
}

DropdownItem.propTypes = {
	value: PropTypes.string,
	icon: PropTypes.object
}

function mapStateToProps(state) {
	return { global: state.global }
}

function mapDispatchToProps(dispatch) {
	return {
		actions: bindActionCreators(globalActions, dispatch)
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(DropdownItem))
