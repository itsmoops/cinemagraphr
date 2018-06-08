import styled, { css } from 'styled-components'

const StyledDiv = styled.div`
	overflow: hidden;
	clear: both;
`

const StyledMessage = styled.div`
	clear: both;
	border-radius: ${props => props.theme.borderRadius};
	padding: 10px;
	margin-top: 10px;
	${(props) => {
        if (props.success) {
            return css`
				background-color: ${colors.messageSuccess};
				border-color: ${colors.messageSuccess.darken(0.7)};
				color: ${colors.messageSuccess.darken(0.7)};
			`
        } else if (props.warn) {
            return css`
				background-color: ${colors.messageWarn};
				border-color: ${colors.messageWarn.darken(0.7)};
				color: ${colors.messageWarn.darken(0.7)};
			`
        }
        return css`
			background-color: ${colors.messageError};
			border-color: ${colors.messageError.darken(0.7)};
			color: ${colors.messageError.darken(0.7)};
		`
    }};
`

class Message extends React.PureComponent {
    render() {
        return (
            <StyledDiv>
                <StyledMessage
                    success={this.props.success}
                    warn={this.props.warn}
                    error={this.props.error}>
                    {this.props.children}
                </StyledMessage>
            </StyledDiv>
        )
    }
}

Message.defaultProps = {
    success: false,
    warn: false,
    error: true
}

Message.propTypes = {
    success: PropTypes.bool,
    warn: PropTypes.bool,
    error: PropTypes.bool
}

export default Message
