import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { withRouter } from 'react-router'
import { Container } from 'rebass'
import uuidV4 from 'uuid/v4'
import ReactTooltip from 'react-tooltip'
import Dropzone from 'react-dropzone'
import styled from 'styled-components'
import { Icon } from 'react-icons-kit'
import { basic_display as display } from 'react-icons-kit/linea/basic_display'
import { basic_floppydisk as floppyDisk } from 'react-icons-kit/linea/basic_floppydisk'
import { arrows_plus as arrowsPlus } from 'react-icons-kit/linea/arrows_plus'
import { music_tape as tape } from 'react-icons-kit/linea/music_tape'
import { music_play_button as play } from 'react-icons-kit/linea/music_play_button'
import { music_pause_button as pause } from 'react-icons-kit/linea/music_pause_button'
import { arrows_clockwise as refresh } from 'react-icons-kit/linea/arrows_clockwise'
import AudioControls from './audio-controls'
import * as globalActions from '../../actions/global-actions'
import * as userActions from '../../actions/user-actions'
import * as firebaseActions from '../../actions/firebase-actions'

const StyledContainer = styled(Container)`
    position: absolute;
    bottom: 20px;
    z-index: 99;
    display: flex;
    justify-content: center;
    width: 100%;
    max-width: unset;
    padding: 0 0 0 0;
`

const StyledIcon = styled(Icon)`
    cursor: pointer;
    margin: 0 20 0 20;
    &:hover > svg {
        position: relative;
    }
`

const StyledDropzone = styled(Dropzone)`
    cursor: pointer;
`

const IconLeft = styled.div`
    position: absolute;
    left: 0;
    bottom: 0;
`

const IconLeft2 = styled.div`
    position: absolute;
    left: 42;
    bottom: 0;
`

const IconRight = styled.div`
    position: absolute;
    right: 0;
    bottom: 0;
`

const Plus = styled(Icon)`
    position: absolute;
    margin-left: -13px;
    cursor: pointer;
    &:hover > svg {
        position: relative;
    }
`

class Controls extends React.Component {
    constructor(props) {
        super()

        window.audio = []

        this.state = {
            playAll: !!props.global.userEngaged
        }
    }
    shouldComponentUpdate(nextProps, nextState) {
        if (
            nextProps.cinemagraph !== this.props.cinemagraph ||
            nextProps.audio !== this.props.audio ||
            nextState.playAll !== this.state.playAll
        ) {
            return true
        }
        return false
    }
    componentDidUpdate() {
        const { userEngaged } = this.props.global
        if (userEngaged !== this.state.playAll) {
            this.setState({
                playAll: userEngaged
            })
        }
    }
    render() {
        const size = 32
        const delayShow = 1000
        const {
            audio,
            cinemagraph,
            creatorMode,
            handleRefresh,
            handleUpdateAudio,
            handleRemoveAudio,
            handleUploadAudio,
            handleSave,
            toggleTheaterMode
        } = this.props
        return (
            <StyledContainer>
                {cinemagraph && creatorMode && (
                    <IconLeft>
                        <StyledIcon
                            data-tip="toggle theater mode"
                            data-for="theater"
                            onClick={toggleTheaterMode}
                            icon={display}
                            size={size} />
                        <ReactTooltip
                            id="theater"
                            place="top"
                            effect="solid"
                            delayShow={delayShow} />
                    </IconLeft>
                )}
                {cinemagraph && !creatorMode && !!audio.length && (
                    <IconLeft2>
                        <StyledIcon
                            data-tip={this.state.playAll ? 'pause audio' : 'play audio'}
                            data-for="play"
                            onClick={() => {
                                this.setState(prevState => ({
                                    playAll: !prevState.playAll
                                }))
                            }}
                            icon={this.state.playAll ? pause : play}
                            size={size} />
                        <ReactTooltip id="play" place="top" effect="solid" delayShow={delayShow} />
                    </IconLeft2>
                )}
                {cinemagraph && !creatorMode && (
                    <IconLeft>
                        <StyledIcon
                            data-tip={'get new'}
                            data-for="new"
                            onClick={handleRefresh}
                            icon={refresh}
                            size={size} />
                        <ReactTooltip id="new" place="top" effect="solid" delayShow={delayShow} />
                    </IconLeft>
                )}
                {!!audio.length &&
                    audio.map((track, idx) => (
                        <div key={uuidV4()}>
                            <AudioControls
                                track={track}
                                trackNumber={idx + 1}
                                trackName={`track${idx + 1}`}
                                totalTracks={audio.length}
                                play={this.state.playAll}
                                loopOnLoad={track.loop}
                                volumeOnLoad={track.volume}
                                muteOnLoad={track.mute}
                                creatorMode={creatorMode}
                                handleUpdateAudio={handleUpdateAudio}
                                handleRemoveAudio={handleRemoveAudio} />
                        </div>
                    ))}
                <div>
                    {cinemagraph && creatorMode && audio.length <= 2 && (
                        <StyledDropzone onDrop={handleUploadAudio}>
                            <StyledIcon
                                data-tip="upload audio track (.mp3 or .m4a)"
                                data-for="add-audio"
                                icon={tape}
                                size={size} />
                            <Plus
                                data-tip="upload audio track (.mp3 or .m4a)"
                                data-for="add-audio"
                                icon={arrowsPlus}
                                size={20} />
                            <ReactTooltip
                                id="add-audio"
                                place="top"
                                effect="solid"
                                delayShow={delayShow} />
                        </StyledDropzone>
                    )}
                </div>
                {cinemagraph && creatorMode && (
                    <IconRight>
                        <StyledIcon
                            data-tip="save cinemagraph"
                            data-for="save"
                            onClick={handleSave}
                            icon={floppyDisk}
                            size={size} />
                        <ReactTooltip id="save" place="top" effect="solid" delayShow={delayShow} />
                    </IconRight>
                )}
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
