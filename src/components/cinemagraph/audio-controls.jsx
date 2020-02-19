import ReactTooltip from "react-tooltip";
import { Text } from "rebass";
import { Howl } from "howler";
import styled from "styled-components";
import { Icon } from "react-icons-kit";
import { music_tape as tape } from "react-icons-kit/linea/music_tape";
import { music_mute as mute } from "react-icons-kit/linea/music_mute";
import { music_volume_up as volumeUp } from "react-icons-kit/linea/music_volume_up";
import { music_volume_down as volumeDown } from "react-icons-kit/linea/music_volume_down";
import { music_repeat_button as loop } from "react-icons-kit/linea/music_repeat_button";
import { basic_trashcan as trash } from "react-icons-kit/linea/basic_trashcan";

const Container = styled.div`
  margin: 0 15;
  border: 1px solid white;
  padding: 5px;
`;

const StyledText = styled(Text)`
  vertical-align: bottom;
  display: inline;
  margin: 0 10 0 10;
`;

const StyledIcon = styled(Icon)`
  color: ${props => (props.active === "true" ? colors.accent2 : colors.font1)};
  cursor: pointer;
  margin: 0 5 0 5;
  &:hover > svg {
    position: relative;
  }
`;

const StyledIconNoPointer = styled(Icon)`
  margin: 0 5 0 5;
  &:hover > svg {
    cursor: default;
    position: relative;
  }
`;
class AudioControls extends React.PureComponent {
  constructor() {
    super();
    this.state = {
      fileURL: "",
      loop: false,
      volume: 1,
      mute: false
    };
  }
  componentDidMount() {
    const { track, trackName, creatorMode, play } = this.props;

    this.setState(
      prevState => ({
        fileURL: track.preview || track.fileURL,
        loop: this.props.loopOnLoad || prevState.loop,
        volume: this.props.volumeOnLoad || prevState.volume,
        mute: this.props.muteOnLoad || prevState.mute
      }),
      () => {
        const audioTag = document.createElement("audio");
        audioTag.src = this.state.fileURL;
        audioTag.addEventListener("loadedmetadata", () => {
          const trackDuration = audioTag.duration * 1000;
          const loopEnd = creatorMode ? (track.type === "audio/x-m4a" ? 0 : 90) : 180; // shave off a few ms from end to loop seamlessly
          this.track = new Howl({
            src: [this.state.fileURL],
            format: track.type === "audio/x-m4a" ? "m4a" : "mp3",
            sprite: {
              [trackName]: [0, trackDuration - loopEnd, this.state.loop]
            },
            volume: this.state.volume
          });
          window.audio.push(this.track);
          if (play) {
            this.playWhenAllReady();
          }
        });
      }
    );
  }
  componentWillUnmount() {
    const { trackName } = this.props;

    window.audio.forEach((track, idx) => {
      if (Object.keys(track._sprite)[0] === trackName) {
        window.audio.splice(idx, 1);
      }
    });

    this.track && this.track.unload(trackName);
  }
  playWhenAllReady = () => {
    const { totalTracks, trackName } = this.props;

    const checkAudioReady = setInterval(() => {
      if (window.audio.length === totalTracks) {
        const allReady = window.audio.every(track => track._state === "loaded");
        if (allReady) {
          clearInterval(checkAudioReady);
          this.track.play(trackName);
        }
      }
    }, 10);

    setTimeout(() => {
      clearInterval(checkAudioReady);
    }, 5000);
  };
  handlePlay = () => {
    const { play, trackName } = this.props;

    if (play) {
      this.track.play(trackName);
    } else {
      this.track.pause(trackName);
    }
  };
  handleLoop = e => {
    const { trackName, trackType } = e.currentTarget.dataset;

    this.setState(
      prevState => ({
        loop: !prevState.loop
      }),
      () => {
        this.track.loop(this.state.loop);

        if (!this.state.loop && this.track.playing()) {
          this.track.stop();
        } else if (!this.state.loop && !this.track.playing()) {
          this.track.play(trackName);
        } else if (this.state.loop && !this.track.playing()) {
          this.track.play(trackName);
        }

        this.props.handleUpdateAudio && this.props.handleUpdateAudio(trackName, trackType, this.state.loop);
      }
    );
  };
  handleVolumeUp = e => {
    const { trackName, trackType } = e.currentTarget.dataset;

    if (this.state.volume <= 0.9) {
      this.setState(
        prevState => ({
          volume: parseFloat((prevState.volume + 0.1).toFixed(1))
        }),
        () => {
          this.track.volume([this.state.volume]);
          this.props.handleUpdateAudio && this.props.handleUpdateAudio(trackName, trackType, this.state.volume);
        }
      );
    }
  };
  handleVolumeDown = e => {
    const { trackName, trackType } = e.currentTarget.dataset;

    if (this.state.volume >= 0.1) {
      this.setState(
        prevState => ({
          volume: parseFloat((prevState.volume - 0.1).toFixed(1))
        }),
        () => {
          this.track.volume([this.state.volume]);
          this.props.handleUpdateAudio && this.props.handleUpdateAudio(trackName, trackType, this.state.volume);
        }
      );
    }
  };
  handleMute = e => {
    const { trackName, trackType } = e.currentTarget.dataset;

    this.setState(
      prevState => ({
        mute: !prevState.mute
      }),
      () => {
        this.track.mute(this.state.mute);
        this.props.handleUpdateAudio && this.props.handleUpdateAudio(trackName, trackType, this.state.mute);
      }
    );
  };
  render() {
    const size = 20;
    const delayShow = 1000;
    const { creatorMode, handleRemoveAudio, trackName, trackNumber } = this.props;

    return (
      <div>
        {creatorMode && (
          <Container>
            <StyledIconNoPointer size={size} icon={tape} />
            <StyledText>{trackNumber}</StyledText>
            <StyledIcon
              data-track-name={trackName}
              data-track-type="loop"
              data-tip={this.state.loop ? "stop looping" : "loop audio (off by default)"}
              data-for="loop"
              onClick={this.handleLoop}
              active={this.state.loop.toString()}
              size={size}
              icon={loop}
            />
            <StyledIcon
              data-track-name={trackName}
              data-track-type="volume"
              data-tip="decrease volume"
              data-for="volumeDown"
              onClick={this.handleVolumeDown}
              size={size}
              icon={volumeDown}
            />
            <StyledIcon
              data-track-name={trackName}
              data-track-type="volume"
              data-tip="increase volume"
              data-for="volumeUp"
              onClick={this.handleVolumeUp}
              size={size}
              icon={volumeUp}
            />
            <StyledIcon
              data-track-name={trackName}
              data-track-type="mute"
              data-tip={this.state.mute ? "unmute" : "mute"}
              data-for="mute"
              onClick={this.handleMute}
              active={this.state.mute.toString()}
              size={size}
              icon={mute}
            />
            {creatorMode && (
              <StyledIcon
                data-track-name={trackName}
                data-tip={"remove this audio track"}
                data-for="remove"
                onClick={e => {
                  this.track.unload();
                  handleRemoveAudio(e);
                }}
                size={size}
                icon={trash}
              />
            )}

            <ReactTooltip id="loop" place="top" effect="solid" delayShow={delayShow} />
            <ReactTooltip id="volumeUp" place="top" effect="solid" delayShow={delayShow} />
            <ReactTooltip id="volumeDown" place="top" effect="solid" delayShow={delayShow} />
            <ReactTooltip id="mute" place="top" effect="solid" delayShow={delayShow} />
            <ReactTooltip id="remove" place="top" effect="solid" delayShow={delayShow} />
          </Container>
        )}
      </div>
    );
  }
}

export default AudioControls;
