import { connect } from 'react-redux'
import styled, { keyframes } from 'styled-components'

const StyledOverlay = styled.div`
	opacity: 0.4;
	filter: alpha(opacity=20);
	background-color: ${colors.accent1.darken(0.2)};
	width: 100%;
	height: 100%;
	top: 0;
	left: 0;
	position: fixed;
	z-index: 998;
`

const spin = keyframes`
    0% {
        transform: rotate(0deg);
    }
    100% {
        transform: rotate(360deg);
    }
`
const animationTime = '0.5s'

const StyledLoader = styled.div`
	font-family: Helvetica;
	// border: 5px solid ${colors.background};
	-webkit-animation: ${spin} ${animationTime} linear infinite;
	animation: ${spin} ${animationTime} linear infinite;
	border-top: 5px solid ${colors.loadingSpinner};
	border-radius: 50%;
	position: fixed;
	z-index: 999;
	height: 4em;
	width: 4em;
	margin: auto;
	top: 0;
	left: 0;
	bottom: 0;
	right: 0;
	&:before {
		content: '';
		display: block;
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
	}
`

function LoadingSpinner(props) {
    if (props.global.loading) {
        return (
            <div>
                <StyledOverlay />
                <StyledLoader />
            </div>
        )
    }
    return null
}

function mapStateToProps(state) {
    return {
        global: state.global
    }
}

export default connect(mapStateToProps)(LoadingSpinner)
