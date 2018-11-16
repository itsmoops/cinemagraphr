import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { withRouter } from 'react-router'
import styled, { css, keyframes } from 'styled-components'
import * as globalActions from '../../actions/global-actions'
import * as userActions from '../../actions/user-actions'
import * as firebaseActions from '../../actions/firebase-actions'

const Container = styled.div`
    width: 100%;
    height: 100%;
    position: absolute;
    z-index: -2;
    filter: ${props => props.blur && 'blur(4px)'};
`

const Theater = styled.div`
    position: absolute;
    z-index: -1;
    background: black;
    display: flex;
    width: 100%;
    height: 100%;
    align-items: center;
    justify-content: center;
`

const fadeIn = keyframes`
    0% {
        opacity: 0;
    }
    100% {
        opacity: 1;
    }
`

const Gif = styled.img`
    width: 100%;
    height: 100%;
    object-fit: ${props => (props.theater ? 'contain' : 'cover')};
    ${(props) => {
        if (props.firstVisit) {
            return css`
                opacity: 1;
                animation-name: ${fadeIn};
                animation-iteration-count: 1;
                animation-timing-function: ease-in;
                animation-duration: 8s;
            `
        }
    }};
`

const Video = styled.video`
    width: 100%;
    height: 100%;
    object-fit: ${props => (props.theater ? '' : 'cover')};
    ${(props) => {
        if (props.firstVisit) {
            return css`
                opacity: 1;
                animation-name: ${fadeIn};
                animation-iteration-count: 1;
                animation-timing-function: ease-in;
                animation-duration: 5s;
            `
        }
    }};
`

class Cinemagraph extends React.PureComponent {
    render() {
        const { cinemagraph, theater, firstVisit } = this.props
        const source = cinemagraph && (cinemagraph.preview || cinemagraph.fileURL)
        if (source) {
            return (
                <Container blur={this.props.global.loading}>
                    <Theater>
                        {cinemagraph.type === 'image/gif' ? (
                            <Gif src={source} theater={theater} firstVisit={firstVisit} />
                        ) : (
                            <Video
                                src={source}
                                theater={theater}
                                firstVisit={firstVisit}
                                autoPlay
                                muted
                                loop />
                        )}
                    </Theater>
                </Container>
            )
        }
        return null
    }
}

function mapStateToProps(state) {
    return {
        global: state.global,
        user: state.user,
        firebase: state.firebase
    }
}

function mapDispatchToProps(dispatch) {
    return {
        globalActions: bindActionCreators(globalActions, dispatch),
        userActions: bindActionCreators(userActions, dispatch),
        firebaseActions: bindActionCreators(firebaseActions, dispatch)
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(withRouter(Cinemagraph))
