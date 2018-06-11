import styled, { keyframes, css } from 'styled-components'

const rotate = keyframes`
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
`

const rotateReverse = keyframes`
  from {
    transform: rotate(360deg);
  }

  to {
    transform: rotate(0deg);
  }
`

const Container = styled.div`
    z-index: ${props => props.loading && '999'};
    display: inline-flex;
`
const BigCircle = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 ${props => props.margin};
    background: ${props => props.background || 'white'};
    border-radius: 50%;
    height: ${props => `${props.height}px`};
    width: ${props => `${props.width}px`};

    ${(props) => {
        if (props.animate && props.rotate && props.rotate === 'forward') {
            return css`
                animation: ${rotate} ${props.animationTime}s linear infinite;
            `
        } else if (props.animate && props.rotate && props.rotate === 'reverse') {
            return css`
                animation: ${rotateReverse} ${props.animationTime}s linear infinite;
            `
        }
    }};
`

const CenterCircle = styled.div`
    display: flex;
    background: ${props => props.background || 'black'};
    border-radius: 50%;
    height: ${props => `${props.height}px`};
    width: ${props => `${props.width}px`};
`

const CircleContainer = styled.div`
    position: absolute;
    height: ${props => `${props.height}px`};
    transform: rotate(${props => props.rotate || '0'}deg);
`

const SmallCircle = styled.div`
    background: ${props => props.background || 'black'};
    border-radius: 50%;
    height: ${props =>
        css`
            ${props.height}px;
        `};
    width: ${props =>
        css`
            ${props.width}px;
        `};
    margin-top: 2.9%;
`

const TapeContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
`

const InfinityTape = styled.div`
    position: absolute;
    height: ${props => `${props.height}px`};
    width: ${props => `${props.width}px`};
    background: ${props => props.background || 'white'};
    transform: rotate(${props => props.rotate || '0'}deg);
`

const Logo = (props) => {
    const { size, animate, animationTime, loading } = props
    return (
        <Container loading={loading}>
            <BigCircle
                height={size}
                width={size}
                margin={size * 0.175}
                rotate="forward"
                animate={animate}
                animationTime={animationTime}>
                <CenterCircle height={size * 0.175} width={size * 0.175} background="black" />
                <CircleContainer height={size * 0.875}>
                    <SmallCircle height={size * 0.3} width={size * 0.3} background="black" />
                </CircleContainer>
                <CircleContainer height={size * 0.875} rotate="72">
                    <SmallCircle height={size * 0.3} width={size * 0.3} background="black" />
                </CircleContainer>
                <CircleContainer height={size * 0.875} rotate="144">
                    <SmallCircle height={size * 0.3} width={size * 0.3} background="black" />
                </CircleContainer>
                <CircleContainer height={size * 0.875} rotate="-72">
                    <SmallCircle height={size * 0.3} width={size * 0.3} background="black" />
                </CircleContainer>
                <CircleContainer height={size * 0.875} rotate="-144">
                    <SmallCircle height={size * 0.3} width={size * 0.3} background="black" />
                </CircleContainer>
            </BigCircle>
            <TapeContainer>
                <InfinityTape height={size * 0.03} width={size * 0.9} rotate="45" />
                <InfinityTape height={size * 0.03} width={size * 0.9} rotate="-45" />
            </TapeContainer>
            <BigCircle
                height={size}
                width={size}
                margin={size * 0.175}
                rotate="reverse"
                animate={animate}
                animationTime={animationTime}>
                <CenterCircle height={size * 0.175} width={size * 0.175} background="black" />
                <CircleContainer height={size * 0.875}>
                    <SmallCircle height={size * 0.3} width={size * 0.3} background="black" />
                </CircleContainer>
                <CircleContainer height={size * 0.875} rotate="72">
                    <SmallCircle height={size * 0.3} width={size * 0.3} background="black" />
                </CircleContainer>
                <CircleContainer height={size * 0.875} rotate="144">
                    <SmallCircle height={size * 0.3} width={size * 0.3} background="black" />
                </CircleContainer>
                <CircleContainer height={size * 0.875} rotate="-72">
                    <SmallCircle height={size * 0.3} width={size * 0.3} background="black" />
                </CircleContainer>
                <CircleContainer height={size * 0.875} rotate="-144">
                    <SmallCircle height={size * 0.3} width={size * 0.3} background="black" />
                </CircleContainer>
            </BigCircle>
        </Container>
    )
}

export default Logo
