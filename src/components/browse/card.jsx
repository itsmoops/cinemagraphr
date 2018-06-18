import styled from 'styled-components'
import { Box, Text, Heading } from 'rebass'
import { Icon } from 'react-icons-kit'
import { arrows_slim_up as upvote } from 'react-icons-kit/linea/arrows_slim_up'
import { arrows_slim_down as downvote } from 'react-icons-kit/linea/arrows_slim_down'

const Container = styled(Box)`
    background: ${colors.cardBackground};
    height: 350px;
    align-items: center;
    justify-content: center;
    cursor: pointer;
`

const ImageContainer = styled.div`
    position: relative;
    overflow: hidden;
    display: flex;
    justify-content: center;
    align-items: center;

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
    display: flex;
    position: absolute;
    bottom: 20;
    right: 20;
    display: none;
    z-index: 1;
`

const StyledIcon = styled(Icon)`
    color: ${props => (props.active === 'true' ? colors.accent2 : colors.font1)};
    cursor: pointer;
    margin: 0 5 0 5;
    &:hover > svg {
        position: relative;
    }
`

class Card extends React.PureComponent {
    render() {
        const size = 16
        const { cinemagraph } = this.props
        return (
            <Container w={[1, 1 / 2, 1 / 2, 1 / 3]}>
                <ImageContainer>
                    <StyledHeading mb={20}>{cinemagraph.title}</StyledHeading>
                    <BottomLeftText>{cinemagraph.user.username}</BottomLeftText>
                    <VoteControls>
                        <StyledIcon
                            data-tip={'Upvote'}
                            data-for="upvote"
                            onClick={this.handleUpvote}
                            size={size}
                            icon={upvote} />
                        <Text>{cinemagraph.upvotes}</Text>
                        <StyledIcon
                            data-tip={'Downvote'}
                            data-for="downvote"
                            onClick={this.handleDownvote}
                            size={size}
                            icon={downvote} />
                        <Text>{cinemagraph.downvotes}</Text>
                    </VoteControls>

                    {cinemagraph.type === 'image/gif' ? (
                        <Gif src={cinemagraph.fileURL} />
                    ) : (
                        <Video src={cinemagraph.fileURL} autoPlay muted loop />
                    )}
                </ImageContainer>
            </Container>
        )
    }
}

export default Card
