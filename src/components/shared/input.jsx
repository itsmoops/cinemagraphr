import styled, { css } from 'styled-components'
import { eye } from 'react-icons-kit/fa/eye'
import { eyeSlash } from 'react-icons-kit/fa/eyeSlash'

const StyledInput = styled.input`
	width: 100%;
	min-height: 35px;
	font-size: 1.1em;
	font-weight: 300;
	padding: 5 0 5 15;
	margin: 0 0 10 0;
	border: none;
	border-bottom: 2px solid ${colors.background.darken(0.2)};
	outline: none;
	overflow: auto;
	box-shadow: none;
	border-radius: 0px;
	&:focus {
		border-bottom: 2px solid ${colors.accent1};
	}
	${props =>
		props.disabled &&
		css`
			${props.theme.disabled};
		`};
`

const StyledIcon = styled(Icon)`
	float: right;
	margin-right: 10px;
	margin-top: -45px;
	cursor: pointer;
	overflow: scroll;
`

class Input extends React.Component {
	state = {
		showText: false,
		inputType: this.props.type || 'text'
	}
	handleIconClick = () => {
		this.setState({
			showText: !this.state.showText,
			inputType: this.state.showText ? 'password' : 'text'
		})
	}
	render() {
		let icon
		if (this.props.toggleHiddenText) {
			if (!this.state.showText) {
				icon = <StyledIcon icon={eye} size={20} onClick={this.handleIconClick} />
			} else {
				icon = <StyledIcon icon={eyeSlash} size={20} onClick={this.handleIconClick} />
			}
		}
		return (
			<div>
				<StyledInput
					id={this.props.id}
					placeholder={this.props.placeholder}
					autocomplete={this.props.autocomplete}
					type={this.state.inputType}
					name={this.props.name}
					onChange={this.props.onChange}
					required={this.props.required}
					hidden={this.props.hidden}
					disabled={this.props.disabled}
					value={this.props.value}
				/>
				{icon}
			</div>
		)
	}
}

Input.defaultProps = {
	type: 'text'
}

Input.propTypes = {
	type: PropTypes.string
}

export default Input
