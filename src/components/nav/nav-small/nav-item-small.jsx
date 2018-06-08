import { withRouter } from 'react-router'
import styled from 'styled-components'

const StyledItemContainer = styled.div`
	display: inline-block;
	width: 100%;
	text-align: left;
	cursor: pointer;
	font-size: 1.5em;
	font-weight: ${props => (props.active ? 'bold' : 'normal')};
	-webkit-tap-highlight-color: rgba(0, 0, 0, 0);
`

const StyledItem = styled.div`
	padding-left: 20px;
	display: block;
	margin: 1em 0em 1em 0em;
	-webkit-margin-before: 1em;
	-webkit-margin-after: 1em;
	-webkit-margin-start: 0px;
	-webkit-margin-end: 0px;
	-webkit-tap-highlight-color: rgba(0, 0, 0, 0);
	& > div {
		display: flex !important;
		justify-content: space-between !important;
		padding-right: 20px;
	}
`

class NavItemSmall extends React.PureComponent {
	handleClick = () => {
		this.props.history.push(this.props.linkTo)
	}
	render() {
		const icon = this.props.icon ? (
			<div>
				<Icon icon={this.props.icon} size={this.props.iconSize} />
			</div>
		) : (
			undefined
		)
		const Item = horizontalCenter(props => (
			<StyledItemContainer
				active={this.props.active}
				onClick={() => {
					this.props.onClick()
					this.handleClick()
				}}
			>
				<StyledItem>{props.children}</StyledItem>
			</StyledItemContainer>
		))
		return (
			<Item>
				{this.props.value || this.props.children} {icon}
			</Item>
		)
	}
}

NavItemSmall.defaultProps = {
	active: false,
	linkTo: '/',
	value: '',
	icon: undefined,
	iconSize: 24
}

NavItemSmall.propTypes = {
	active: PropTypes.bool,
	linkTo: PropTypes.string,
	value: PropTypes.string,
	icon: PropTypes.object,
	iconSize: PropTypes.number
}

export default withRouter(NavItemSmall)
