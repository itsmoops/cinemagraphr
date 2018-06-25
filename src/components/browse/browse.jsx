import { connect } from 'react-redux'
import { Flex } from 'rebass'
import styled from 'styled-components'
import firebase from 'firebase/app'
import 'firebase/database'
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
            sortType: localStorage.getItem('sortType') || 'Top',
            sortTime: localStorage.getItem('sortTime') || 'Past day'
        }
    }
    componentDidMount() {
        ReactGA.pageview(window.location.pathname)
        this.fetchData()
        this.handleInfiniteScroll()
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.user && !nextProps.user.authenticated) {
            this.props.history.push('/')
        }
    }
    fetchData = () => {
        const cinemagraphsRef = firebase
            .database()
            .ref('cinemagraphs')
            .orderByKey()
            .limitToLast(9)
        cinemagraphsRef.once('value', snapshot => {
            const data = snapshot.val()
            if (data !== null) {
                const reversedKeys = Object.keys(data).reverse()
                const reversedCinemagraphs = Object.entries(data)
                    .map(([key, value]) => {
                        const cinemagraph = value
                        cinemagraph.postId = key
                        return cinemagraph
                    })
                    .reverse()
                this.setState({
                    cinemagraphs: reversedCinemagraphs,
                    lastKey: reversedKeys[reversedKeys.length - 1]
                })
            }
        })
    }
    handleInfiniteScroll = () => {
        window.onscroll = () => {
            if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
                this.fetchMore()
            }
        }
    }
    fetchMore = () => {
        const cinemagraphsRef = firebase
            .database()
            .ref('cinemagraphs')
            .orderByKey()
            .endAt(this.state.lastKey)
            .limitToLast(10)
        cinemagraphsRef.once('value', snapshot => {
            const data = snapshot.val()
            if (data !== null) {
                const reversedKeys = Object.keys(data).reverse()
                const reversedCinemagraphs = Object.entries(data)
                    .map(([key, value]) => {
                        const cinemagraph = value
                        cinemagraph.postId = key
                        return cinemagraph
                    })
                    .reverse()
                    .slice(1)
                this.setState(prevState => ({
                    cinemagraphs: [...prevState.cinemagraphs, ...reversedCinemagraphs],
                    lastKey: reversedKeys[reversedKeys.length - 1]
                }))
            }
        })
    }
    handleSelectSortType = e => {
        const { value } = e.target
        localStorage.setItem('sortType', value)
        this.setState({
            sortType: value
        })
    }
    handleSelectSortTime = e => {
        const { value } = e.target
        localStorage.setItem('sortTime', value)
        this.setState({
            sortTime: value
        })
    }
    render() {
        const { cinemagraphs } = this.state
        const sortTypeOptions = [
            {
                value: 'Top'
            },
            {
                value: 'New'
            },
            {
                value: 'Rising'
            }
        ]
        const sortTimeOptions = [
            {
                value: 'Past day'
            },
            {
                value: 'Past week'
            },
            {
                value: 'Past year'
            },
            {
                value: 'All time'
            }
        ]
        return (
            <FlexContainer>
                <Sort
                    name="sortType"
                    options={sortTypeOptions}
                    onChange={this.handleSelectSortType}
                    defaultValue={this.state.sortType}
                />
                {this.state.sortType === 'Top' && (
                    <Sort
                        name="sortTime"
                        options={sortTimeOptions}
                        onChange={this.handleSelectSortTime}
                        defaultValue={this.state.sortTime}
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
