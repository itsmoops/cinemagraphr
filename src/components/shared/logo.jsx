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
    display: inline-flex;
`
const BigCircle = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 15;
    background: ${props => props.background || 'white'};
    border-radius: 50%;
    height: ${props => props.height};
    width: ${props => props.width};

    ${(props) => {
        if (props.rotate && props.rotate === 'forward') {
            return css`
                animation: ${rotate} 2s linear infinite;
            `
        } else if (props.rotate && props.rotate === 'reverse') {
            return css`
                animation: ${rotateReverse} 2s linear infinite;
            `
        }
    }};
`

const CenterCircle = styled.div`
    display: flex;
    background: ${props => props.background || 'black'};
    border-radius: 50%;
    height: ${props => props.height};
    width: ${props => props.width};
`

const CircleContainer = styled.div`
    position: absolute;
    height: ${props => props.height || '90px'};
    transform: rotate(${props => props.rotate || '0'}deg);
`

const SmallCircle = styled.div`
    background: ${props => props.background || 'black'};
    border-radius: 50%;
    height: ${props => props.height};
    width: ${props => props.width};
    margin-top: 2.9%;
`

const TapeContainer = styled.div`
    display: flex;
    justify-content: center;
`

const InfinityTape = styled.div`
    position: absolute;
    height: ${props => props.height || '100px'};
    width: ${props => props.width || '5px'};
    background: ${props => props.background || 'white'};
    transform: rotate(${props => props.rotate || '0'}deg);
`

const Logo = props => (
    <Container>
        <BigCircle height="100px" width="100px" rotate="forward">
            <CenterCircle height="20px" width="20px" background="black" />
            <CircleContainer>
                <SmallCircle height="30px" width="30px" background="black" />
            </CircleContainer>
            <CircleContainer rotate="72">
                <SmallCircle height="30px" width="30px" background="black" />
            </CircleContainer>
            <CircleContainer rotate="144">
                <SmallCircle height="30px" width="30px" background="black" />
            </CircleContainer>
            <CircleContainer rotate="-72">
                <SmallCircle height="30px" width="30px" background="black" />
            </CircleContainer>
            <CircleContainer rotate="-144">
                <SmallCircle height="30px" width="30px" background="black" />
            </CircleContainer>
        </BigCircle>
        <TapeContainer>
            <InfinityTape rotate="44" />
            <InfinityTape rotate="-44" />
        </TapeContainer>
        <BigCircle height="100px" width="100px" rotate="reverse">
            <CenterCircle height="20px" width="20px" background="black" />
            <CircleContainer>
                <SmallCircle height="30px" width="30px" background="black" />
            </CircleContainer>
            <CircleContainer rotate="72">
                <SmallCircle height="30px" width="30px" background="black" />
            </CircleContainer>
            <CircleContainer rotate="144">
                <SmallCircle height="30px" width="30px" background="black" />
            </CircleContainer>
            <CircleContainer rotate="-72">
                <SmallCircle height="30px" width="30px" background="black" />
            </CircleContainer>
            <CircleContainer rotate="-144">
                <SmallCircle height="30px" width="30px" background="black" />
            </CircleContainer>
        </BigCircle>
    </Container>
)

export default Logo
