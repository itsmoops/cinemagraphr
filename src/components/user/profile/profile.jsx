import { connect } from 'react-redux'
import firebase from 'firebase/app'
import { Flex } from 'rebass'
import 'firebase/firestore'
import styled from 'styled-components'
import { USER_SORT_BY } from '../../../constants/constants'
import Sort from '../../shared/sort'
import Card from '../../shared/card'

const FlexContainer = styled(Flex)`
    overflow: hidden;
    flex-wrap: wrap;
`

const Text = styled.div`
    display: flex;
    width: 100%;
    height: 100%;
    align-items: center;
    justify-content: center;
`
class Profile extends React.Component {
    constructor() {
        super()
        document.title = 'profile'

        this.state = {
            cinemagraphs: [],
            sortBy: localStorage.getItem('userSortBy') || USER_SORT_BY.CREATED,
            lastVisible: ''
        }
    }
    componentDidMount() {
        ReactGA.pageview(window.location.pathname)

        if (window.location.search) {
            const username = window.location.search.split('=')[1]
            this.fetchUserInfo(username)
        } else if (this.props.user) {
            this.fetchUserInfo(this.props.user.displayName)
        }
    }
    componentWillReceiveProps(nextProps) {
        // if (this.props.user && !this.props.user.authenticated && !window.location.search) {
        //     this.props.history.push('/')
        // }
        if (nextProps.user && nextProps.user.authenticated && !this.state.uid) {
            this.fetchUserInfo(nextProps.user.displayName)
        }
    }
    fetchUserInfo = async username => {
        const user = await firebase
            .firestore()
            .collection('users')
            .where('username', '==', username)
            .get()
        if (user.size >= 1) {
            const data = user.docs[0].data()
            document.title = data.username
            this.setState(
                {
                    username: data.username,
                    uid: data.uid,
                    owner: data.uid === this.props.user.uid
                },
                () => {
                    this.handleInfiniteScroll()
                    this.fetchData()
                }
            )
        }
    }
    handleInfiniteScroll = () => {
        window.onscroll = () => {
            if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
                this.fetchData()
            }
        }
    }
    fetchData = async () => {
        const db = firebase.firestore().collection('cinemagraphs')
        const itemsPerPage = 9
        let docRef
        if (this.state.sortBy === USER_SORT_BY.CREATED) {
            if (!this.state.lastVisible) {
                const docRef = await db
                    .where('user.uid', '==', this.state.uid)
                    .limit(itemsPerPage)
                    .get()
                if (docRef.size >= 1) {
                    const cinemagraphs = docRef.docs.map(doc => doc.data()).sort((a, b) => {
                        return b.created > a.created
                    })
                    this.setState({
                        cinemagraphs,
                        lastVisible: docRef.docs[docRef.docs.length - 1]
                    })
                }
            } else {
            }
        } else if (this.state.sortBy === USER_SORT_BY.FAVORITED) {
            if (!this.state.lastVisible) {
            } else {
            }
        }
    }
    handleSelectSortBy = e => {
        const { value } = e.target
        localStorage.setItem('userSortBy', value)
        this.setState(
            {
                cinemagraphs: [],
                sortBy: value,
                lastVisible: ''
            },
            () => this.fetchData()
        )
    }
    render() {
        const { cinemagraphs, owner, sortBy } = this.state
        const sortByOptions = Object.values(USER_SORT_BY).map(value => ({ value }))
        return (
            <FlexContainer>
                {owner && (
                    <Sort
                        name="sortBy"
                        options={sortByOptions}
                        onChange={this.handleSelectSortBy}
                        defaultValue={sortBy}
                        width="85px"
                    />
                )}
                {cinemagraphs.length >= 1 ? (
                    cinemagraphs.map(cinemagraph => (
                        <Card key={cinemagraph.name} cinemagraph={cinemagraph} />
                    ))
                ) : (
                    <Text>
                        {!this.state.owner &&
                            `${this.state.username || 'This user'} doesn't have any cinemagraphs`}
                        {this.state.owner &&
                            this.state.sortBy === USER_SORT_BY.CREATED &&
                            'No cinemagraphs created'}
                        {this.state.owner &&
                            this.state.sortBy === USER_SORT_BY.FAVORITED &&
                            'No cinemagraphs favorited'}
                    </Text>
                )}
            </FlexContainer>
        )
    }
}

function mapStateToProps(state) {
    return { user: state.user }
}

export default connect(mapStateToProps)(Profile)
