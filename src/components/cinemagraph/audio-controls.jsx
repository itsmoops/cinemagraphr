import ReactTooltip from 'react-tooltip'
import { Text } from 'rebass'
import { Howl, Howler } from 'howler'
import styled from 'styled-components'
import { Icon } from 'react-icons-kit'
import { music_tape as tape } from 'react-icons-kit/linea/music_tape'
import { music_mute as mute } from 'react-icons-kit/linea/music_mute'
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

const StyledIconNoPointer = styled(Icon)`
    margin: 0 5 0 5;
    &:hover > svg {
        cursor: default;
        position: relative;
    }
`
class AudioControls extends React.PureComponent {
    constructor() {
        super()
        this.state = {
            fileURL: '',
            loop: false,
            volume: 1,
            mute: false
        }
    }
    componentDidMount() {
        const { track, trackName } = this.props
        this.setState(
            prevState => ({
                fileURL: track.preview || track.fileURL,
                loop: this.props.loopOnLoad || prevState.loop,
                volume: this.props.volumeOnLoad || prevState.volume,
                mute: this.props.muteOnLoad || prevState.mute
            }),
            () => {
                const audioTag = document.createElement('audio')
                audioTag.src = this.state.fileURL
                audioTag.addEventListener('loadedmetadata', () => {
                    const trackDuration = audioTag.duration * 1000
                    const loopEnd = 175 // shave off a few ms from end to loop seamlessly
                    this.track = new Howl({
                        src: [this.state.fileURL],
                        format: track.type === 'audio/x-m4a' ? 'm4a' : 'mp3',
                        sprite: {
                            [trackName]: [0, trackDuration - loopEnd, this.state.loop]
                        },
                        volume: this.state.volume
                    })
                    window.audio.push(this.track)
                    this.track.once('load', () => {
                        if (this.props.play) {
                            this.track.play(trackName)
                        }
                    })
                })
            }
        )
    }
    componentDidUpdate(prevProps) {
        if (prevProps.play !== this.props.play) {
            this.handlePlay()
        }
    }
    componentWillUnmount() {
        this.track && this.track.unload()
    }
    // checkAllReady = () => {
    //     // trying to build a function that starts all tracks at the same time
    //     const checkReady = setInterval(() => {
    //         if (window.audio.every(track => track.state() === 'loaded')) {
    //             this.track.play()
    //             clearInterval(checkReady)
    //         }
    //     }, 50)
    // }
    handleLoop = e => {
        const { trackName, trackType } = e.currentTarget.dataset

        this.setState(
            prevState => ({
                loop: !prevState.loop
            }),
            () => {
                this.track.loop(this.state.loop)

                if (!this.state.loop && this.track.playing()) {
                    this.track.stop()
                } else if (!this.state.loop && !this.track.playing()) {
                    this.track.play()
                } else if (this.state.loop && !this.track.playing()) {
                    this.track.play()
                }

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
    handlePlay = e => {
        this.setState(
            prevState => {
                play: !prevState.play
            },
            () => {
                if (this.state.play) {
                    this.track.pause()
                } else {
                    this.track.play()
                }
            }
        )
    }
    render() {
        const size = 20
        const { track } = this.props
        console.log('render')
        return (
            <div>
                {this.props.creatorMode && (
                    <Container>
                        <StyledIconNoPointer size={size} icon={tape} />
                        <StyledText>{this.props.trackNumber}</StyledText>
                        <StyledIcon
                            data-track-name={track.name}
                            data-track-type="loop"
                            data-tip={
                                this.state.loop ? 'stop looping' : 'loop audio (off by default)'
                            }
                            data-for="loop"
                            onClick={this.handleLoop}
                            active={this.state.loop.toString()}
                            size={size}
                            icon={loop}
                        />
                        <StyledIcon
                            data-track-name={track.name}
                            data-track-type="volume"
                            data-tip="decrease volume"
                            data-for="volumeDown"
                            onClick={this.handleVolumeDown}
                            size={size}
                            icon={volumeDown}
                        />
                        <StyledIcon
                            data-track-name={track.name}
                            data-track-type="volume"
                            data-tip="increase volume"
                            data-for="volumeUp"
                            onClick={this.handleVolumeUp}
                            size={size}
                            icon={volumeUp}
                        />
                        <StyledIcon
                            data-track-name={track.name}
                            data-track-type="mute"
                            data-tip={this.state.mute ? 'unmute' : 'mute'}
                            data-for="mute"
                            onClick={this.handleMute}
                            active={this.state.mute.toString()}
                            size={size}
                            icon={mute}
                        />
                        {this.props.creatorMode && (
                            <StyledIcon
                                data-track-name={track.name}
                                data-tip={'remove this audio track'}
                                data-for="remove"
                                onClick={e => {
                                    this.track.unload()
                                    this.props.handleRemoveAudio(e)
                                }}
                                size={size}
                                icon={trash}
                            />
                        )}

                        <ReactTooltip id="loop" place="top" effect="solid" delayShow={1000} />
                        <ReactTooltip id="volumeUp" place="top" effect="solid" delayShow={1000} />
                        <ReactTooltip id="volumeDown" place="top" effect="solid" delayShow={1000} />
                        <ReactTooltip id="mute" place="top" effect="solid" delayShow={1000} />
                        <ReactTooltip id="remove" place="top" effect="solid" delayShow={1000} />
                    </Container>
                )}
            </div>
        )
    }
}

export default AudioControls
