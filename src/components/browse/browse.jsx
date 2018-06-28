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
            sortTime: localStorage.getItem('sortTime') || 'Today',
            endAt: ''
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
                switch (this.state.sortType) {
                    default:
                        this.fetchData('created')
                }
            }
        }
    }
    fetchData = () => {
        const itemsPerPage = 9
        let key
        switch (this.state.sortType) {
            case 'Top':
                key = 'ratio'
                break
            case 'New':
                key = 'created'
                break
        }
        if (!this.state.endAt) {
            const cinemagraphsRef = firebase
                .database()
                .ref('cinemagraphs')
                .orderByChild(key)
                .limitToLast(itemsPerPage)
            cinemagraphsRef.once('value', snapshot => {
                const data = []
                snapshot.forEach(child => {
                    data.push(child.val())
                })
                if (data.length > 0) {
                    data.reverse()
                    this.setState({
                        cinemagraphs: data,
                        endAt: data[data.length - 1][key]
                    })
                }
            })
        } else {
            const cinemagraphsRef = firebase
                .database()
                .ref('cinemagraphs')
                .orderByChild(key)
                .endAt(this.state.endAt)
                .limitToLast(itemsPerPage + 1)
            cinemagraphsRef.once('value', snapshot => {
                const data = []
                snapshot.forEach(child => {
                    data.push(child.val())
                })
                if (data.length > 0) {
                    data.reverse()
                    if (data.slice(1).length > 0) {
                        this.setState(prevState => ({
                            cinemagraphs: [...prevState.cinemagraphs, ...data.slice(1)],
                            endAt: data[data.length - 1][key]
                        }))
                    }
                }
            })
        }
    }
    handleSelectSortType = e => {
        const { value } = e.target
        localStorage.setItem('sortType', value)
        this.setState(
            {
                cinemagraphs: [],
                sortType: value,
                endAt: '',
                sortTime: value === 'Top' ? localStorage.getItem('sortTime') || 'Today' : ''
            },
            () => this.fetchData()
        )
    }
    handleSelectSortTime = e => {
        const { value } = e.target
        localStorage.setItem('sortTime', value)
        this.setState(
            {
                cinemagraphs: [],
                sortTime: value,
                endAt: ''
            },
            () => this.fetchData()
        )
    }
    render() {
        const { cinemagraphs } = this.state
        const sortTypeOptions = [
            {
                value: 'Top'
            },
            {
                value: 'New'
            }
        ]
        const sortTimeOptions = [
            {
                value: 'Today'
            },
            {
                value: 'This week'
            },
            {
                value: 'This year'
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
