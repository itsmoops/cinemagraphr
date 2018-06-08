import { injectGlobal } from 'styled-components'
import colors from './colors'
import reset from './reset'

const global = `
  body {
    background: ${colors.background};
    font-family: Helvetica;
    font-family: 'Montserrat', sans-serif;
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
  }
`

export default injectGlobal`
    ${reset}
    ${global}
`
