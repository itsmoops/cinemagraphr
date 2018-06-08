import styled, { css } from 'styled-components'
import { Flex } from 'rebass'

export default styled(Flex)`
    width: 100%;
    height: 100%;
    justify-content: center;
    align-items: center;
    ${props => css`
        ${props.theme.screen.small} {
            height: 100%;
        }
    `};
`
