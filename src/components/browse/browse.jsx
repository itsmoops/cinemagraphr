import { connect } from 'react-redux'
import { Flex } from 'rebass'
import styled from 'styled-components'
import firebase from 'firebase/app'
import 'firebase/firestore'
import { SORT_BY, SORT_FROM } from '../../constants/constants.js'
import Card from './card'
import Sort from './sort'

const FlexContainer = styled(Flex)`
    overflow: hidden;
    flex-wrap: wrap;
`
class Browse extends React.Component {
    constructor() {
        super()
        document.title = 'Browse'

        this.state = {
            cinemagraphs: [],
            sortBy: localStorage.getItem('sortBy') || SORT_BY.TOP,
            sortFrom: localStorage.getItem('sortFrom') || SORT_FROM.TODAY,
            lastVisible: ''
        }
    }
    componentDidMount() {
        ReactGA.pageview(window.location.pathname)
        this.handleInfiniteScroll()
        this.fetchData()
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.user && !nextProps.user.authenticated) {
            this.props.history.push('/')
        }
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
        const today = new Date()
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
        let orderBy, docRef, date
        if (this.state.sortBy === SORT_BY.TOP) {
            orderBy = 'ratio'
            const dateRange = this.getSortDateRange()
            console.log(dateRange)
            if (!this.state.lastVisible) {
                docRef = await db
                    .where('created', '>=', dateRange.startDate)
                    .where('created', '<=', dateRange.endDate)
                    .limit(itemsPerPage)
                    .get()
                if (docRef.size >= 1) {
                    const cinemagraphs = docRef.docs.map(doc => doc.data()).sort((a, b) => {
                        return b[orderBy] > a[orderBy]
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
                        return b[orderBy] > a[orderBy]
                    })
                    this.setState(prevState => ({
                        cinemagraphs: [...prevState.cinemagraphs, ...cinemagraphs],
                        lastVisible: docRef.docs[docRef.docs.length - 1]
                    }))
                }
            }
        } else if (this.state.sortBy === SORT_BY.NEW) {
            orderBy = 'created'
            if (!this.state.lastVisible) {
                docRef = await db
                    .orderBy(orderBy, 'desc')
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
                    .orderBy(orderBy, 'desc')
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
        const sortByOptions = [
            {
                value: SORT_BY.TOP
            },
            {
                value: SORT_BY.NEW
            }
        ]
        const sortFromOptions = [
            {
                value: SORT_FROM.TODAY
            },
            {
                value: SORT_FROM.WEEK
            },
            {
                value: SORT_FROM.MONTH
            },
            {
                value: SORT_FROM.YEAR
            },
            {
                value: SORT_FROM.ALL_TIME
            }
        ]
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
