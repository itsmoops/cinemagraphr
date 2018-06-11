import { connect } from 'react-redux'
import styled from 'styled-components'
import Logo from './logo'

const StyledContainer = styled.div`
	display: flex;
	width 100%;
	height: 100%;
	justify-content: center;
	align-items: center;
	position: absolute;
    top: 0;
`

const StyledOverlay = styled.div`
    opacity: 0.6;
    filter: alpha(opacity=20);
    background-color: ${colors.accent1.darken(0.2)};
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    position: fixed;
    z-index: 998;
`

function LoadingSpinner(props) {
    const animationTime = '1.5'
    if (props.global.loading) {
        return (
            <StyledContainer>
                <Logo size={75} animate animationTime={animationTime} loading />
                <StyledOverlay />
            </StyledContainer>
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
