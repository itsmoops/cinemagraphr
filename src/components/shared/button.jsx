import styled, { css } from 'styled-components'

const StyledButton = styled.button`
    background: ${props => props.background || colors.buttonBackground};
    color: ${props => props.color || colors.font1};
    width: ${props => props.width};
    float: ${props => props.align};
    height: 50px;
    padding: 10px 0px;
    margin: 5px 0px;
    font-size: 18px;
    font: inherit;
    cursor: pointer;
    outline: none;
    border: 1px solid ${colors.buttonBackground.darken(0.1)};
    &:hover {
        background-color: ${colors.buttonBackground.darken(0.1)};
    }
    ${props =>
        props.disabled &&
        css`
            ${props.theme.disabled};
        `};
`

class Button extends React.PureComponent {
    render() {
        return (
            <StyledButton
                type={this.props.type || 'submit'}
                onClick={this.props.onClick}
                align={this.props.align}
                width={this.props.width}
                color={this.props.color}
                background={this.props.background}
                disabled={this.props.disabled}>
                {this.props.children}
            </StyledButton>
        )
    }
}

Button.defaultProps = {
    type: 'submit',
    width: '100%'
}

Button.propTypes = {
    type: PropTypes.string,
    width: PropTypes.string
}

export default Button
