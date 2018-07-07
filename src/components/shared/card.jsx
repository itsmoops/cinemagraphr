import { connect } from 'react-redux'
import firebase from 'firebase/app'
import 'firebase/firestore'
import { withRouter } from 'react-router'
import styled from 'styled-components'
import { Box, Text, Heading } from 'rebass'
import { Link } from 'react-router-dom'
import { Icon } from 'react-icons-kit'
import { arrows_slim_up as upvote } from 'react-icons-kit/linea/arrows_slim_up'
import { arrows_slim_down as downvote } from 'react-icons-kit/linea/arrows_slim_down'
import VoteControls from './vote-controls'

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

const StyledLink = styled(Link)`
    display: inline;
    margin-top: ${props => props.theme.bufferTop};
    float: ${props => props.right && 'right'};
    text-decoration: none;
    color: ${colors.font1};
`

class Card extends React.PureComponent {
    handleRedirect = () => {
        this.props.history.push(`/?id=${this.props.cinemagraph.postId.replace('-', '')}`)
    }
    render() {
        const { cinemagraph } = this.props
        return (
            <Container w={[1, 1 / 2, 1 / 3, 1 / 3]}>
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
                <VoteControls iconSize={16} cinemagraph={cinemagraph} hide displayVotes />
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
