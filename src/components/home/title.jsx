import { connect } from 'react-redux'
import styled, { keyframes } from 'styled-components'
import CinemaEffect from './cinema-effect'
import Logo from '../shared/logo'

const fadeOut = keyframes`
    0% {
        opacity: 1;
    }
    100% {
        opacity: 0;
    }
`

const StyledContainer = styled.div`
	display: flex;
	width 100%;
	height: 100%;
	justify-content: center;
	align-items: center;
    position: absolute;
    flex-direction: column;

    & > * {
        opacity: 0;
        animation-name: ${fadeOut};
        animation-iteration-count: 1;
        animation-timing-function: ease-in;
        animation-duration: 8s;
    }
`

const StyledTitle = styled.div`
    z-index: 999;
    font-family: 'Amatic SC', cursive;
    font-size: 9em;
    margin-bottom: 20px;
`

function Title(props) {
    const animationTime = '1.5'
    if (!props.global.loading && props.render) {
        return (
            <div>
                <CinemaEffect />
                <StyledContainer>
                    <StyledTitle>cinemagraphr</StyledTitle>
                    <Logo size={75} animate animationTime={animationTime} loading />
                </StyledContainer>
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

export default connect(mapStateToProps)(Title)
