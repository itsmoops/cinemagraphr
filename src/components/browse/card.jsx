import { connect } from 'react-redux'
import firebase from 'firebase/app'
import 'firebase/database'
import { withRouter } from 'react-router'
import styled from 'styled-components'
import { Box, Text, Heading } from 'rebass'
import { Link } from 'react-router-dom'
import { Icon } from 'react-icons-kit'
import { arrows_slim_up as upvote } from 'react-icons-kit/linea/arrows_slim_up'
import { arrows_slim_down as downvote } from 'react-icons-kit/linea/arrows_slim_down'

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
`

const BottomLeftText = styled(Text)`
    position: absolute;
    bottom: 20;
    left: 20;
    display: none;
    z-index: 1;
`

const VoteControls = styled.div`
    cursor: pointer;
    display: flex;
    position: absolute;
    bottom: 20;
    right: 20;
    display: none;
    z-index: 2;
`

const StyledIcon = styled(Icon)`
    color: ${props => (props.voted === 'true' ? colors.accent2 : colors.font1)};
    cursor: pointer;
    margin: 0 5 0 5;
    &:hover > svg {
        position: relative;
    }
`

const StyledLink = styled(Link)`
    display: inline;
    margin-top: ${props => props.theme.bufferTop};
    float: ${props => props.right && 'right'};
    text-decoration: none;
    color: ${colors.font1};
`

class Card extends React.PureComponent {
    constructor(props) {
        super(props)
        const { cinemagraph } = this.props
        this.state = {
            upvoted: false,
            upvotes: cinemagraph.upvotes,
            downvoted: false,
            downvotes: cinemagraph.downvotes
        }
    }
    componentDidUpdate() {
        if (this.props.user) {
            const { cinemagraph, user } = this.props
            this.setState({
                upvoted: cinemagraph.userUpvotes
                    ? cinemagraph.userUpvotes.includes(user.uid)
                    : false,
                downvoted: cinemagraph.userDownvotes
                    ? cinemagraph.userDownvotes.includes(user.uid)
                    : false
            })
        }
    }
    handleRedirect = () => {
        this.props.history.push(`/?id=${this.props.cinemagraph.postId.replace('-', '')}`)
    }
    handleUpvote = () => {
        const { cinemagraph } = this.props
        let { upvotes } = this.state
        if (this.state.upvoted && this.state.upvotes >= 1) {
            upvotes = upvotes - 1
        }
        if (!this.state.upvoted) {
            upvotes = upvotes + 1
        }
        this.setState(
            prevState => ({
                upvoted: !prevState.upvoted,
                upvotes
            }),
            () => {
                const { userUpvotes } = this.props.cinemagraph
                let newUserUpvotes
                if (!userUpvotes) {
                    newUserUpvotes = [this.props.user.uid]
                }
                if (userUpvotes && !userUpvotes.includes(this.props.user.uid)) {
                    newUserUpvotes = [...userUpvotes, this.props.user.uid]
                }
                if (newUserUpvotes) {
                    const ref = firebase.database().ref(`cinemagraphs/${cinemagraph.postId}`)
                    ref.once('value', snapshot => {
                        const data = snapshot.val()
                        if (data !== null) {
                            const { upvotes, downvotes } = data
                            const ratio = upvotes / (upvotes + downvotes)
                            ref.update({
                                ratio: parseFloat(ratio.toFixed(6)),
                                upvotes: upvotes + 1,
                                userUpvotes: newUserUpvotes
                            })
                        }
                    })
                }
            }
        )
    }
    handleDownvote = () => {
        const { cinemagraph } = this.props
        this.setState(
            prevState => ({
                downvoted: !prevState.downvoted,
                downvotes: prevState.downvoted
                    ? prevState.downvotes >= 1 && prevState.downvotes - 1
                    : prevState.downvotes + 1
            }),
            () => {
                const { userDownvotes } = this.props.cinemagraph
                let newUserDownvotes
                if (!userDownvotes) {
                    newUserDownvotes = [this.props.user.uid]
                }
                if (userDownvotes && !userDownvotes.includes(this.props.user.uid)) {
                    newUserDownvotes = [...userDownvotes, this.props.user.uid]
                }
                if (newUserDownvotes) {
                    ref.once('value', snapshot => {
                        const data = snapshot.val()
                        if (data !== null) {
                            const { upvotes, downvotes } = data
                            const ratio = upvotes / (upvotes + downvotes)
                            ref.update({
                                ratio: parseFloat(ratio.toFixed(6)),
                                downvotes: downvotes + 1,
                                userDownvotes: newUserDownvotes
                            })
                        }
                    })
                }
            }
        )
    }
    render() {
        const size = 16
        const { cinemagraph } = this.props
        return (
            <Container w={[1, 1 / 2, 1 / 2, 1 / 3]}>
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
                <VoteControls>
                    <StyledIcon
                        data-tip={'Upvote'}
                        data-for="upvote"
                        onClick={this.handleUpvote}
                        size={size}
                        icon={upvote}
                        voted={this.state.upvoted.toString()}
                    />
                    <Text>{this.state.upvotes}</Text>
                    <StyledIcon
                        data-tip={'Downvote'}
                        data-for="downvote"
                        onClick={this.handleDownvote}
                        size={size}
                        icon={downvote}
                        voted={this.state.downvoted.toString()}
                    />
                    <Text>{this.state.downvotes}</Text>
                </VoteControls>
            </Container>
        )
    }
}

function mapStateToProps(state) {
    return {
        user: state.user
    }
}

export default connect(mapStateToProps)(withRouter(Card))
