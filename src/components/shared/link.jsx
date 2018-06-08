import { Link } from 'react-router-dom'
import styled from 'styled-components'

const StyledLinkContainer = styled.div`
	margin-top: ${props => props.theme.bufferTop};
	float: ${props => props.right && 'right'};
`

const StyledLink = styled(Link)`
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
        <StyledLinkContainer right={props.right}>
            <StyledLink to={props.to}>{props.children}</StyledLink>
        </StyledLinkContainer>
    )
}

export default WrappedLink
