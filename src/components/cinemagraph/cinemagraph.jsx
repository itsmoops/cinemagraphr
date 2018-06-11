import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { withRouter } from 'react-router'
import styled from 'styled-components'
import Controls from './controls'
import * as globalActions from '../../actions/global-actions'
import * as userActions from '../../actions/user-actions'
import * as firebaseActions from '../../actions/firebase-actions'

const Container = styled.div`
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

const Gif = styled.img`
    width: 100%;
    height: 100%;
    object-fit: ${props => (props.theater ? 'contain' : 'cover')};
`

const Video = styled.video`
    width: 100%;
    height: 100%;
    object-fit: ${props => (props.theater ? '' : 'cover')};
`

class Cinemagraph extends React.PureComponent {
    render() {
        const { cinemagraph } = this.props
        if (true || cinemagraph.preview) {
            return (
                <Container blur={this.props.global.loading}>
                    <Theater>
                        {cinemagraph.type === 'image/gif' ? (
                            <Gif src={cinemagraph.preview} theater={this.props.theater} />
                        ) : (
                            <Video
                                src={cinemagraph.preview}
                                theater={this.props.theater}
                                autoPlay
                                loop />
                        )}
                    </Theater>
                    <Controls
                        creatorMode={this.props.creatorMode}
                        handleUploadAudio={this.props.handleUploadAudio}
                        handleRemoveAudio={this.props.handleRemoveAudio}
                        audio={this.props.audio}
                        toggleTheaterMode={this.props.toggleTheaterMode}
                        handleSave={this.props.handleSave} />
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
