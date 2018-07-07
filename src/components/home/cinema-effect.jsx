import styled, { keyframes } from 'styled-components'

const grainImg =
    'https://firebasestorage.googleapis.com/v0/b/cinemagraphr-prod.appspot.com/o/assets%2Fgrain.jpg?alt=media&token=bc57cd48-e063-49ba-8eb5-aa6090a81c24'
const scratchImg =
    'https://firebasestorage.googleapis.com/v0/b/cinemagraphr-prod.appspot.com/o/assets%2Fscratch.png?alt=media&token=8e37b86a-77f0-4fdf-9fa2-cd9324705ccf'

const fadeOut = keyframes`
    0% {
        opacity: 1;
    }
    100% {
        opacity: 0;
    }
`

const grain = keyframes`
    0%, 100% {
      transform: translate(0, 0, 0);
    }
  
    10% {
      transform: translate(-1%, -1%);
    }
  
    20% {
      transform: translate(1%, 1%);
    }
  
    30% {
      transform: translate(-2%, -2%);
    }
  
    40% {
      transform: translate(3%, 3%);
    }
  
    50% {
      transform: translate(-3%, -3%);
    }
  
    60% {
      transform: translate(4%, 4%);
    }
  
    70% {
      transform: translate(-4%, -4%);
    }
  
    80% {
      transform: translate(2%, 2%);
    }
  
    90% {
      transform: translate(-3%, -3%);
    }
  }
`

const scratch = keyframes`
    0%, 100% {
      transform: translateX(0);
      opacity: 0.075;
    }
  
    10% {
      transform: translateX(-1%);
    }
  
    20% {
      transform: translateX(1%);
    }
  
    30% {
      transform: translateX(-2%);
          opacity: 0.09;
    }
  
    40% {
      transform: translateX(3%);
    }
  
    50% {
      transform: translateX(-3%);
      opacity: 0.07;
    }
  
    60% {
      transform: translateX(8%);
    }
  
    70% {
      transform: translateX(-3%);
    }
  
    80% {
      transform: translateX(10%);
      opacity: 0.02;
    }
  
    90% {
      transform: translateX(-2%);
    }
`

const innerScratch = keyframes`
    0% {
      transform: translateX(0);
      opacity: 0.08;
    }
  
    10% {
      transform: translateX(-1%);
    }
  
    20% {
      transform: translateX(1%);
    }
  
    30% {
      transform: translateX(-2%);
    }
  
    40% {
      transform: translateX(3%);
    }
  
    50% {
      transform: translateX(-3%);
      opacity: 0.06;
    }
  
    60% {
      transform: translateX(8%);
    }
  
    70% {
      transform: translateX(-3%);
    }
  
    80% {
      transform: translateX(10%);
      opacity: 0.03;
    }
  
    90% {
      transform: translateX(20%);
    }
  
    100% {
      transform: translateX(30%);
    }
`

const OuterScratch = styled.div`
    z-index: 999;
    position: absolute;
    height: 100%;
    width: 100%;
    margin: 0;
    overflow: hidden;

    opacity: 0;
    animation-name: ${fadeOut};
    animation-iteration-count: 1;
    animation-timing-function: ease-in;
    animation-duration: 20s;

    &:after {
        content: '';
        width: 120%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
        padding-left: 100px;
        opacity: 0.4;
        background: url(${scratchImg}) repeat center center;
        animation: ${scratch} 0.45s steps(1) infinite;
    }
`

const InnerScratch = styled.div`
    &:after {
        content: '';
        width: 120%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 30%;
        padding-left: 100px;
        opacity: 0.2;
        background: url(${scratchImg}) repeat center center;
        animation: ${innerScratch} 2s infinite;
    }
`

const Grain = styled.div`
    width: 100%;
    height: 100%;
    :after {
        content: '';
        width: 110%;
        height: 110%;
        position: absolute;
        top: -5%;
        left: -5%;
        opacity: 0.15;
        background: url(${grainImg});
        background-position: center;
        background-repeat: no-repeat;
        background-size: cover;
        animation: ${grain} 0.5s steps(1) infinite;
    }
`

const CinemaEffect = () => (
    <OuterScratch className="outer-scratch">
        <InnerScratch className="inner-scratch">
            <Grain className="grain" />
        </InnerScratch>
    </OuterScratch>
)

export default CinemaEffect
