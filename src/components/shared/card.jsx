import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/storage'
import { withRouter } from 'react-router'
import styled from 'styled-components'
import ReactTooltip from 'react-tooltip'
import { Icon } from 'react-icons-kit'
import { basic_trashcan as trash } from 'react-icons-kit/linea/basic_trashcan'
import { Box, Heading } from 'rebass'
import { Link } from 'react-router-dom'
import VoteControls from './vote-controls'
import * as globalActions from '../../actions/global-actions'

const Container = styled(Box)`
    position: relative;
    background: ${colors.cardBackground};
    height: 350px;
    align-items: center;
    justify-content: center;
    cursor: pointer;

    &:hover h2 {
        display: block;
    }

    &:hover p {
        display: block;
    }

    &:hover div {
        display: flex;
    }

    &:hover img {
        filter: blur(4px);
        box-shadow: inset 0px 0px 0px 0px;
    }

    &:hover video {
        filter: blur(4px);
        box-shadow: inset 0px 0px 0px 0px;
    }
`

const ImageContainer = styled.div`
    overflow: hidden;
    display: flex;
    justify-content: center;
    align-items: center;
`

const Video = styled.video`
    height: 100%;
    object-fit: fill;
`

const Gif = styled.img`
    width: 100%;
    height: 100%;
    object-fit: cover;
`

const StyledHeading = styled(Heading)`
    position: absolute;
    display: none;
    z-index: 1;
    text-transform: lowercase;
    padding: 0 10 0 10;
    // font-family: 'Amatic SC', cursive;
    // font-size: 3.5em;
`

const StyledIcon = styled(Icon)`
    cursor: pointer;
    margin: 0 5 0 5;
    &:hover > svg {
        position: relative;
    }
`

const BottomLeftText = styled.div`
    position: absolute;
    bottom: 20;
    left: 20;
    display: none;
    z-index: 1;
`

const TopRightText = styled.div`
    position: absolute;
    top: 20;
    right: 20;
    display: none;
    z-index: 1;
`

const StyledLink = styled(Link)`
    display: inline;
    margin-top: ${props => props.theme.bufferTop};
    float: ${props => props.right && 'right'};
    text-decoration: none;
    color: ${colors.font1};
`

class Card extends React.PureComponent {
    constructor() {
        super()

        this.state = {
            owner: false
        }
    }
    componentDidMount() {
        const { cinemagraph, user } = this.props
        if (Object.keys(cinemagraph).length && user.authenticated) {
            this.setState({
                owner: user.uid === cinemagraph.user.uid
            })
        }
    }
    handleRedirect = () => {
        this.props.history.push(`/?id=${this.props.cinemagraph.postId.replace('-', '')}`)
    }
    handleDelete = async () => {
        const { cinemagraph } = this.props
        if (window.confirm(`are you sure you want to delete "${cinemagraph.title}"?`)) {
            this.props.globalActions.loadingStateChange(true)

            const { audio } = cinemagraph

            if (audio.length >= 1) {
                for (const track of audio) {
                    await firebase
                        .storage()
                        .ref(track.fullPath)
                        .delete()
                }
            }

            await firebase
                .storage()
                .ref(cinemagraph.fullPath)
                .delete()

            await firebase
                .firestore()
                .collection('cinemagraphs')
                .doc(cinemagraph.postId)
                .delete()

            this.props.handleDelete()
            this.props.globalActions.loadingStateChange(false)
        }
    }
    render() {
        const { cinemagraph } = this.props
        const { owner } = this.state
        const size = 16
        return (
            <Container w={[1, 1 / 2, 1 / 3, 1 / 4]}>
                {owner && (
                    <TopRightText onClick={this.handleDelete}>
                        <StyledIcon icon={trash} size={24} data-tip={'delete'} data-for="delete" />
                    </TopRightText>
                )}
                <BottomLeftText>
                    <StyledLink to={`/profile?u=${cinemagraph.user.username}`}>
                        {cinemagraph.user.username}
                    </StyledLink>
                </BottomLeftText>
                <ImageContainer onClick={this.handleRedirect}>
                    <StyledHeading mb={20}>{cinemagraph.title}</StyledHeading>
                    {cinemagraph.type === 'image/gif' ? (
                        <Gif src={cinemagraph.fileURL} />
                    ) : (
                        <Video src={cinemagraph.fileURL} autoPlay muted loop />
                    )}
                </ImageContainer>
                <VoteControls
                    iconSize={size}
                    cinemagraph={cinemagraph}
                    hasAudio={!!cinemagraph.audio.length}
                    hide
                    displayVotes
                />
                <ReactTooltip id="delete" place="bottom" effect="solid" delayShow={1000} />
            </Container>
        )
    }
}

function mapStateToProps(state) {
    return {
        user: state.user
    }
}

function mapDispatchToProps(dispatch) {
    return {
        globalActions: bindActionCreators(globalActions, dispatch)
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(withRouter(Card))
