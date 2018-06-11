import ReactTooltip from 'react-tooltip'
import { Text } from 'rebass'
import styled from 'styled-components'
import { Icon } from 'react-icons-kit'
import { music_tape as tape } from 'react-icons-kit/linea/music_tape'
import { music_mute as mute } from 'react-icons-kit/linea/music_mute'
import { music_pause_button as pause } from 'react-icons-kit/linea/music_pause_button'
import { music_pause_button as play } from 'react-icons-kit/linea/music_pause_button'
import { music_volume_up as volumeUp } from 'react-icons-kit/linea/music_volume_up'
import { music_volume_down as volumeDown } from 'react-icons-kit/linea/music_volume_down'
import { music_repeat_button as loop } from 'react-icons-kit/linea/music_repeat_button'
import { basic_trashcan as trash } from 'react-icons-kit/linea/basic_trashcan'

const Container = styled.div`
    margin: 0 15;
    border: 1px solid white;
    padding: 5px;
`

const StyledText = styled(Text)`
    vertical-align: bottom;
    display: inline;
    margin: 0 10 0 10;
`

const StyledIcon = styled(Icon)`
    color: ${props => (props.active === 'true' ? colors.accent2 : colors.font1)};
    cursor: pointer;
    margin: 0 5 0 5;
    &:hover > svg {
        position: relative;
    }
`

class AudioControls extends React.Component {
    constructor() {
        super()
        this.state = {
            loop: false,
            volume: 1,
            muted: false
        }
    }
    componentDidMount() {
        this.audio.loop = this.state.loop
        this.audio.muted = this.state.muted
        this.audio.volume = this.state.volume
        this.audio.play()
    }
    toggleLoopAudio = () => {
        this.setState(
            prevState => ({
                loop: !prevState.loop
            }),
            () => {
                this.audio.loop = this.state.loop
            }
        )
    }
    handleVolumeUp = () => {
        this.state.volume <= 0.9 &&
            this.setState(
                prevState => ({
                    volume: prevState.volume + 0.1
                }),
                () => {
                    this.audio.volume = this.state.volume
                }
            )
    }
    handleVolumeDown = () => {
        this.state.volume >= 0.1 &&
            this.setState(
                prevState => ({
                    volume: prevState.volume - 0.1
                }),
                () => {
                    this.audio.volume = this.state.volume
                }
            )
    }
    handleMute = () => {
        this.setState(
            prevState => ({
                muted: !prevState.muted
            }),
            () => {
                this.audio.muted = this.state.muted
            }
        )
    }
    handleRemoveAudio = () => {
        // if (confirm('Are you sure you want to remove this track?')) {
        //     this.props.handleRemoveAudio(this.props.track.preview)
        // }
    }
    render() {
        const size = 20
        return (
            <Container>
                <audio ref={a => (this.audio = a)}>
                    <source src={this.props.track.preview} />>
                </audio>
                <StyledIcon size={size} icon={tape} />
                <StyledText>{this.props.trackNumber}</StyledText>
                <StyledIcon
                    data-tip={this.state.loop ? 'Stop looping' : 'Loop audio (off by default)'}
                    data-for="loop"
                    onClick={this.toggleLoopAudio}
                    active={this.state.loop.toString()}
                    size={size}
                    icon={loop}
                />
                <StyledIcon
                    data-tip="Decrease volume"
                    data-for="volumeDown"
                    onClick={this.handleVolumeDown}
                    size={size}
                    icon={volumeDown}
                />
                <StyledIcon
                    data-tip="Increase volume"
                    data-for="volumeUp"
                    onClick={this.handleVolumeUp}
                    size={size}
                    icon={volumeUp}
                />
                <StyledIcon
                    data-tip={this.state.muted ? 'Unmute' : 'Mute'}
                    data-for="mute"
                    onClick={this.handleMute}
                    active={this.state.muted.toString()}
                    size={size}
                    icon={mute}
                />
                <StyledIcon
                    data-tip={'Remove this audio track'}
                    data-for="remove"
                    onClick={this.handleRemoveAudio}
                    size={size}
                    icon={trash}
                />
                <ReactTooltip id="loop" place="top" effect="solid" delayShow={1000} />
                <ReactTooltip id="volumeUp" place="top" effect="solid" delayShow={1000} />
                <ReactTooltip id="volumeDown" place="top" effect="solid" delayShow={1000} />
                <ReactTooltip id="mute" place="top" effect="solid" delayShow={1000} />
                <ReactTooltip id="remove" place="top" effect="solid" delayShow={1000} />
            </Container>
        )
    }
}

export default AudioControls
