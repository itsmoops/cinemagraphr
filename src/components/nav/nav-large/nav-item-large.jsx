import { withRouter } from 'react-router'
import styled, { css } from 'styled-components'

const StyledDiv = styled.div`
	height: 100%;
	display: flex;
	align-items: center;
	padding: 0 20px;
	text-align: center;
	cursor: pointer;
	${props => props.active && css`box-shadow: inset 0 -2px 0 ${colors.accent1};`};
	${props => (props.align === 'right' ? 'float: right;' : 'float: left;')};
`

class NavItem extends React.PureComponent {
	handleClick = () => {
		this.props.history.push(this.props.linkTo)
	}

	render() {
		return (
			<StyledDiv
				onClick={this.handleClick}
				active={this.props.active}
				align={this.props.align}
			>
				<p>{this.props.value || this.props.children}</p>
			</StyledDiv>
		)
	}
}

NavItem.defaultProps = {
	active: false,
	align: 'left',
	linkTo: '/',
	value: ''
}

NavItem.propTypes = {
	active: PropTypes.bool,
	align: PropTypes.string,
	linkTo: PropTypes.string,
	value: PropTypes.string
}

export default withRouter(NavItem)
