import styled, { css } from 'styled-components'
import { Flex } from 'rebass'

export default styled(Flex)`
	max-width: 100%;
	padding-top: ${props => props.theme.navBarHeight};
	${props => css`
			${props.theme.screen.small} {
				height: 100%;
			}
		`};
`
