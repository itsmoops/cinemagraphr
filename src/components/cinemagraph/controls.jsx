import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { withRouter } from 'react-router'
import { Container } from 'rebass'
import styled from 'styled-components'
import { Icon } from 'react-icons-kit'
import { music_note_multiple } from 'react-icons-kit/linea/music_note_multiple'
import { basic_display } from 'react-icons-kit/linea/basic_display'
import { basic_floppydisk } from 'react-icons-kit/linea/basic_floppydisk'
import * as globalActions from '../../actions/global-actions'
import * as userActions from '../../actions/user-actions'
import * as firebaseActions from '../../actions/firebase-actions'
import Button from '../shared/button'

const StyledContainer = styled(Container)`
    position: absolute;
    bottom: 15px;
    z-index: 99;
    display: flex;
    width: 100%;
    align-items: center;
    justify-content: center;
    max-width: unset;
    padding: 0 0 0 0;
`

const StyledIcon = styled(Icon)`
    cursor: pointer;
    margin: 0 15 0 15;
    &:hover > svg {
        position: relative;
    }
`

class Controls extends React.PureComponent {
    render() {
        const size = 32
        return (
            <StyledContainer>
                <StyledIcon
                    onClick={this.props.handleAudio}
                    icon={music_note_multiple}
                    size={size} />
                <StyledIcon
                    onClick={this.props.toggleTheaterMode}
                    icon={basic_display}
                    size={size} />
                <StyledIcon onClick={this.props.handleSave} icon={basic_floppydisk} size={size} />
            </StyledContainer>
        )
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
)(withRouter(Controls))
