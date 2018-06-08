import styled, { css } from 'styled-components'
import { Container, Flex, Box } from 'rebass'
import { format } from 'date-fns'
import Select from './select'

const StyledBox = styled(Box)`
	${props => css`
		${props.theme.screen.small} {
			padding-left: 5px;
		}
	`};
`

class DatePicker extends React.Component {
	state = {
		month: '1',
		day: '1',
		year: new Date().getFullYear().toString()
	}
	handleSelectChange = e => {
		const name = e.target.name
		const value = e.target.value
		this.setState({
			[name]: value
		})
	}
	componentWillReceiveProps(nextProps) {
		if (nextProps.date && nextProps.date !== this.props.date) {
			const date = this.getDateParts(nextProps.date)
			this.setState({
				month: date.month,
				day: date.day,
				year: date.year
			})
		}
	}
	getDateParts = date => {
		const dateParts = {}
		const formattedDate = format(new Date(date), 'MM/DD/YYYY').split('/')
		dateParts.month = formattedDate[0].includes('0')
			? formattedDate[0].substring(1)
			: formattedDate[0]
		dateParts.day = formattedDate[1].includes('0')
			? formattedDate[1].substring(1)
			: formattedDate[1]
		dateParts.year = formattedDate[2]
		return dateParts
	}
	render() {
		let date = {}
		if (this.props.date) {
			date = this.getDateParts(this.props.date)
		}

		const monthNames = [
			'January',
			'February',
			'March',
			'April',
			'May',
			'June',
			'July',
			'August',
			'September',
			'October',
			'November',
			'December'
		]
		const months = []
		for (let i = 1; i <= monthNames.length; i++) {
			months.push(
				<option value={i} key={i}>
					{monthNames[i - 1]}
				</option>
			)
		}

		const days = []
		for (let i = 1; i <= 31; i++) {
			days.push(
				<option value={i} key={i}>
					{i}
				</option>
			)
		}

		const years = []
		const currYear = parseInt(
			new Date()
				.getYear()
				.toString()
				.substr(1)
		)
		for (let i = currYear; i <= currYear + 100; i++) {
			const year = i
			let fullYear
			if (year > 99) {
				fullYear = `20${year.toString().substr(1)}`
			} else {
				fullYear = `19${year}`
			}
			years.push(
				<option value={fullYear} key={fullYear}>
					{fullYear}
				</option>
			)
		}
		return (
			<Container px={0}>
				<Flex wrap>
					<Box w={[1, 1 / 3]}>
						<Select
							name="month"
							onChange={e => {
								this.handleSelectChange(e)
								this.props.onChange(e)
							}}
							value={this.state.month || date.month}
						>
							{months}
						</Select>
					</Box>
					<StyledBox w={[1, 1 / 3]}>
						<Select
							name="day"
							onChange={e => {
								this.handleSelectChange(e)
								this.props.onChange(e)
							}}
							value={this.state.day || date.day}
						>
							{days}
						</Select>
					</StyledBox>
					<StyledBox w={[1, 1 / 3]}>
						<Select
							name="year"
							onChange={e => {
								this.handleSelectChange(e)
								this.props.onChange(e)
							}}
							value={this.state.year || date.year}
						>
							{years.reverse()}
						</Select>
					</StyledBox>
				</Flex>
			</Container>
		)
	}
}

export default DatePicker
