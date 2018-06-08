import styled from 'styled-components'
import { Select } from 'rebass'

export default styled(Select)`
	& > select {
		margin: 5 0 5 0;
		min-height: 40px;
		padding-left: 15px;
		box-shadow: inset 0 0 0 1px ${colors.background.darken(0.2)};

		&:focus {
			box-shadow: inset 0 0 0 1px ${colors.accent1};
		}
	}

	& > svg {
		padding-top: 8px;
		padding-right: 10;
	}
`
