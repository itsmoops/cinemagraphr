import { connect } from 'react-redux'
import { Flex } from 'rebass'
import styled from 'styled-components'
import firebase from 'firebase/app'
import 'firebase/firestore'
import { SORT_BY, SORT_FROM } from '../../constants/constants'
import Sort from '../shared/sort'
import Card from '../shared/card'

const FlexContainer = styled(Flex)`
    overflow: hidden;
    flex-wrap: wrap;
`
class Browse extends React.Component {
    constructor() {
        super()
        document.title = 'browse'

        this.state = {
            cinemagraphs: [],
            sortBy: localStorage.getItem('sortBy') || SORT_BY.ALL_TIME,
            sortFrom: localStorage.getItem('sortFrom') || SORT_FROM.TODAY,
            lastVisible: '',
            today: new Date()
        }
    }
    componentDidMount() {
        ReactGA.pageview(window.location.pathname)
        this.handleInfiniteScroll()
        this.fetchData()
    }
    handleInfiniteScroll = () => {
        window.onscroll = () => {
            if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
                this.fetchData()
            }
        }
    }
    getSortDateRange = () => {
        let startDate, endDate
        const { today } = this.state
        switch (this.state.sortFrom) {
            case SORT_FROM.TODAY:
                startDate = new Date(
                    today.getFullYear(),
                    today.getMonth(),
                    today.getDay() + 1,
                    today.getHours() - 24,
                    today.getMinutes(),
                    today.getSeconds(),
                    today.getMilliseconds()
                ).getTime()
                endDate = today.getTime()
                break
            case SORT_FROM.HOUR:
                startDate = new Date(
                    today.getFullYear(),
                    today.getMonth(),
                    today.getDay() + 1,
                    today.getHours() - 1,
                    today.getMinutes(),
                    today.getSeconds(),
                    today.getMilliseconds()
                ).getTime()
                endDate = today.getTime()
                break
            case SORT_FROM.WEEK:
                startDate = new Date(
                    today.getFullYear(),
                    today.getMonth(),
                    today.getDay() - 6,
                    today.getHours(),
                    today.getMinutes(),
                    today.getSeconds(),
                    today.getMilliseconds()
                ).getTime()
                endDate = today.getTime()
                break
            case SORT_FROM.MONTH:
                startDate = new Date(
                    today.getFullYear(),
                    today.getMonth() - 1,
                    today.getDay() + 1,
                    today.getHours(),
                    today.getMinutes(),
                    today.getSeconds(),
                    today.getMilliseconds()
                ).getTime()
                endDate = today.getTime()
                break
            case SORT_FROM.YEAR:
                startDate = new Date(
                    today.getFullYear() - 1,
                    today.getMonth(),
                    today.getDay() + 1,
                    today.getHours(),
                    today.getMinutes(),
                    today.getSeconds(),
                    today.getMilliseconds()
                ).getTime()
                endDate = today.getTime()
                break
            case SORT_FROM.ALL_TIME:
                startDate = new Date(2018, 0, 1).getTime()
                endDate = today.getTime()
                break
        }
        return {
            startDate,
            endDate
        }
    }
    fetchData = async () => {
        const db = firebase.firestore().collection('cinemagraphs')
        const itemsPerPage = 9
        let docRef
        if (this.state.sortBy === SORT_BY.TOP) {
            const dateRange = this.getSortDateRange()
            if (!this.state.lastVisible) {
                docRef = await db
                    .where('created', '>=', dateRange.startDate)
                    .where('created', '<=', dateRange.endDate)
                    .limit(itemsPerPage)
                    .get()
                if (docRef.size >= 1) {
                    const cinemagraphs = docRef.docs.map(doc => doc.data()).sort((a, b) => {
                        return b.ratio > a.ratio
                    })
                    this.setState({
                        cinemagraphs,
                        lastVisible: docRef.docs[docRef.docs.length - 1]
                    })
                }
            } else {
                docRef = await db
                    .where('created', '>=', dateRange.startDate)
                    .where('created', '<=', dateRange.endDate)
                    .startAfter(this.state.lastVisible)
                    .limit(itemsPerPage)
                    .get()
                if (docRef.size >= 1) {
                    const cinemagraphs = docRef.docs.map(doc => doc.data()).sort((a, b) => {
                        return b.ratio > a.ratio
                    })
                    this.setState(prevState => ({
                        cinemagraphs: [...prevState.cinemagraphs, ...cinemagraphs],
                        lastVisible: docRef.docs[docRef.docs.length - 1]
                    }))
                }
            }
        } else if (this.state.sortBy === SORT_BY.NEW) {
            if (!this.state.lastVisible) {
                docRef = await db
                    .orderBy('created', 'desc')
                    .limit(itemsPerPage)
                    .get()
                if (docRef.size >= 1) {
                    const cinemagraphs = docRef.docs.map(doc => doc.data())
                    this.setState({
                        cinemagraphs,
                        lastVisible: docRef.docs[docRef.docs.length - 1]
                    })
                }
            } else {
                docRef = await db
                    .orderBy('created', 'desc')
                    .startAfter(this.state.lastVisible)
                    .limit(itemsPerPage)
                    .get()
                if (docRef.size >= 1) {
                    const cinemagraphs = docRef.docs.map(doc => doc.data())
                    this.setState(prevState => ({
                        cinemagraphs: [...prevState.cinemagraphs, ...cinemagraphs],
                        lastVisible: docRef.docs[docRef.docs.length - 1]
                    }))
                }
            }
        }
    }
    handleSelectSortBy = e => {
        const { value } = e.target
        localStorage.setItem('sortBy', value)
        this.setState(
            {
                cinemagraphs: [],
                sortBy: value,
                lastVisible: '',
                sortFrom:
                    value === SORT_BY.TOP ? localStorage.getItem('sortFrom') || SORT_FROM.TODAY : ''
            },
            () => this.fetchData()
        )
    }
    handleSelectSortFrom = e => {
        const { value } = e.target
        localStorage.setItem('sortFrom', value)
        this.setState(
            {
                cinemagraphs: [],
                sortFrom: value,
                lastVisible: ''
            },
            () => this.fetchData()
        )
    }
    render() {
        const { cinemagraphs } = this.state
        const sortByOptions = Object.values(SORT_BY).map(value => ({ value }))
        const sortFromOptions = Object.values(SORT_FROM).map(value => ({ value }))
        return (
            <FlexContainer>
                <Sort
                    name="sortBy"
                    options={sortByOptions}
                    onChange={this.handleSelectSortBy}
                    defaultValue={this.state.sortBy}
                />
                {this.state.sortBy === SORT_BY.TOP && (
                    <Sort
                        name="sortFrom"
                        options={sortFromOptions}
                        onChange={this.handleSelectSortFrom}
                        defaultValue={this.state.sortFrom}
                        left="125"
                        width="100"
                    />
                )}
                {cinemagraphs.map(cinemagraph => (
                    <Card key={cinemagraph.name} cinemagraph={cinemagraph} />
                ))}
            </FlexContainer>
        )
    }
}

function mapStateToProps(state) {
    return { user: state.user }
}

export default connect(mapStateToProps)(Browse)
