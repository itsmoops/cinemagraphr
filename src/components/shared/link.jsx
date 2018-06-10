import { Link } from 'react-router-dom'
import styled from 'styled-components'

const StyledLink = styled(Link)`
    display: inline;
    margin-top: ${props => props.theme.bufferTop};
    float: ${props => props.right && 'right'};
    text-decoration: none;
    color: ${colors.link};
    &:active {
        color: ${colors.link.darken(0.15)};
    }
    &:hover {
        color: ${colors.link.darken(0.15)};
    }
    &:focus {
        color: ${colors.link.darken(0.15)};
        outline: none;
    }
    &:visited {
        color: ${colors.link.darken(0.15)};
    }
`

function WrappedLink(props) {
    return (
        <StyledLink right={props.right} to={props.to}>
            {props.children}
        </StyledLink>
    )
}

export default WrappedLink
