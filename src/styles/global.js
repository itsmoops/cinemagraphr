import { injectGlobal } from 'styled-components'
import colors from './colors'
import reset from './reset'

const global = `
  body {
    background: ${colors.background};
    font-family: Helvetica;
    font-family: 'Montserrat', sans-serif;
    // font-family: 'Amatic SC', cursive;
    // font-size:30px;
    font-weight: 300;
    color: ${colors.font1};
  }

  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    text-align: center;
    // font-family: 'Amatic SC', cursive;
    // font-size:30px;
  }

  svg:hover {
    content: "";
    display: block;
    position: absolute;
    background-color: transparent;
    cursor: pointer;
    /* plus width and height of the SVG */
  }
`

export default injectGlobal`
    ${reset}
    ${global}
`
