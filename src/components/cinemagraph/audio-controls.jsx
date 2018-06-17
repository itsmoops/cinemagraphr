import ReactTooltip from 'react-tooltip'
import { Text } from 'rebass'
import { Howl, Howler } from 'howler'
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
            mute: false
        }
    }
    componentDidMount() {
        const { track, trackNumber } = this.props
        const audioTag = document.createElement('audio')
        audioTag.src = track.preview
        audioTag.addEventListener('loadedmetadata', () => {
            this.track = new Howl({
                src: [track.preview],
                loop: this.state.loop,
                format: track.type === 'audio/x-m4a' ? 'm4a' : 'mp3',
                loopStart: 0,
                loopEnd: audioTag.duration * 1000,
                autoplay: true,
                volume: this.state.volume
            })
            this.track.play()
        })
    }
    componentWillUnmount() {
        this.track && this.track.unload()
    }
    handleLoop = e => {
        const { trackName, trackType } = e.currentTarget.dataset
        !this.track.playing() && this.track.play()
        this.setState(
            prevState => ({
                loop: !prevState.loop
            }),
            () => {
                this.track.loop(this.state.loop)
                this.props.handleUpdateAudio &&
                    this.props.handleUpdateAudio(trackName, trackType, this.state.loop)
            }
        )
    }
    handleVolumeUp = e => {
        const { trackName, trackType } = e.currentTarget.dataset
        this.state.volume <= 0.9 &&
            this.setState(
                prevState => ({
                    volume: parseFloat((prevState.volume + 0.1).toFixed(1))
                }),
                () => {
                    this.track.volume([this.state.volume])
                    this.props.handleUpdateAudio &&
                        this.props.handleUpdateAudio(trackName, trackType, this.state.volume)
                }
            )
    }
    handleVolumeDown = e => {
        const { trackName, trackType } = e.currentTarget.dataset
        this.state.volume >= 0.1 &&
            this.setState(
                prevState => ({
                    volume: parseFloat((prevState.volume - 0.1).toFixed(1))
                }),
                () => {
                    this.track.volume([this.state.volume])
                    this.props.handleUpdateAudio &&
                        this.props.handleUpdateAudio(trackName, trackType, this.state.volume)
                }
            )
    }
    handleMute = e => {
        const { trackName, trackType } = e.currentTarget.dataset
        this.setState(
            prevState => ({
                mute: !prevState.mute
            }),
            () => {
                this.track.mute(this.state.mute)
                this.props.handleUpdateAudio &&
                    this.props.handleUpdateAudio(trackName, trackType, this.state.mute)
            }
        )
    }
    render() {
        const size = 20
        const { track } = this.props
        return (
            <Container>
                <StyledIcon size={size} icon={tape} />
                <StyledText>{this.props.trackNumber}</StyledText>
                <StyledIcon
                    data-track-name={track.name}
                    data-track-type="loop"
                    data-tip={this.state.loop ? 'Stop looping' : 'Loop audio (off by default)'}
                    data-for="loop"
                    onClick={this.handleLoop}
                    active={this.state.loop.toString()}
                    size={size}
                    icon={loop}
                />
                <StyledIcon
                    data-track-name={track.name}
                    data-track-type="volume"
                    data-tip="Decrease volume"
                    data-for="volumeDown"
                    onClick={this.handleVolumeDown}
                    size={size}
                    icon={volumeDown}
                />
                <StyledIcon
                    data-track-name={track.name}
                    data-track-type="volume"
                    data-tip="Increase volume"
                    data-for="volumeUp"
                    onClick={this.handleVolumeUp}
                    size={size}
                    icon={volumeUp}
                />
                <StyledIcon
                    data-track-name={track.name}
                    data-track-type="mute"
                    data-tip={this.state.mute ? 'Unmute' : 'Mute'}
                    data-for="mute"
                    onClick={this.handleMute}
                    active={this.state.mute.toString()}
                    size={size}
                    icon={mute}
                />
                <StyledIcon
                    data-track-name={track.name}
                    data-tip={'Remove this audio track'}
                    data-for="remove"
                    onClick={e => {
                        this.track.unload()
                        this.props.handleRemoveAudio(e)
                    }}
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
