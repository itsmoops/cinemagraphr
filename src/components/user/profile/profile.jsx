import { connect } from 'react-redux'
import firebase from 'firebase/app'
import 'firebase/firestore'
import { Flex } from 'rebass'
import styled from 'styled-components'
import throttle from 'lodash.throttle'
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

const notFoundMessage = 'nothing to see here...'
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
        } else if (this.props.user.username) {
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
        window.onscroll = throttle(() => {
            if (window.innerHeight + window.pageYOffset >= document.body.offsetHeight) {
                this.fetchData()
            }
        }, 1000)
    }
    handleDelete = () => {
        this.setState(
            {
                lastVisible: undefined
            },
            this.fetchData
        )
    }
    fetchData = async () => {
        const db = firebase.firestore().collection('cinemagraphs')
        const itemsPerPage = 12
        let docRef

        if (this.state.sortBy === USER_SORT_BY.CREATED) {
            if (!this.state.lastVisible) {
                docRef = await db
                    .where('user.uid', '==', this.state.uid)
                    .orderBy('created', 'desc')
                    .limit(itemsPerPage)
                    .get()
                if (docRef.size >= 1) {
                    const cinemagraphs = docRef.docs.map(doc => doc.data())
                    this.setState(() => ({
                        cinemagraphs,
                        lastVisible: docRef.docs[docRef.docs.length - 1]
                    }))
                } else {
                    this.setState({
                        message: notFoundMessage
                    })
                }
            } else {
                docRef = await db
                    .where('user.uid', '==', this.state.uid)
                    .orderBy('created', 'desc')
                    .limit(itemsPerPage)
                    .startAfter(this.state.lastVisible)
                    .get()
                if (docRef.size >= 1) {
                    const cinemagraphs = docRef.docs.map(doc => doc.data())
                    this.setState(prevState => ({
                        cinemagraphs: [...prevState.cinemagraphs, ...cinemagraphs],
                        lastVisible: docRef.docs[docRef.docs.length - 1]
                    }))
                } else {
                    this.setState({
                        message: notFoundMessage
                    })
                }
            }
        } else if (this.state.sortBy === USER_SORT_BY.FAVORITED) {
            if (!this.state.lastVisible) {
                docRef = await db
                    .where(`userFavorites.${this.state.uid}`, '==', true)
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
                } else {
                    this.setState({
                        message: notFoundMessage
                    })
                }
            } else {
                docRef = await db
                    .where(`userFavorites.${this.state.uid}`, '==', true)
                    .limit(itemsPerPage)
                    .startAfter(this.state.lastVisible)
                    .get()
                if (docRef.size >= 1) {
                    const cinemagraphs = docRef.docs.map(doc => doc.data()).sort((a, b) => {
                        return b.created > a.created
                    })
                    this.setState(prevState => ({
                        cinemagraphs: [...prevState.cinemagraphs, ...cinemagraphs],
                        lastVisible: docRef.docs[docRef.docs.length - 1]
                    }))
                } else {
                    this.setState({
                        message: notFoundMessage
                    })
                }
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
        const { cinemagraphs, owner, sortBy, message } = this.state
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
                        <Card
                            key={cinemagraph.name}
                            cinemagraph={cinemagraph}
                            allowDelete={true}
                            handleDelete={this.handleDelete}
                        />
                    ))
                ) : (
                    <Text>{message && message}</Text>
                )}
            </FlexContainer>
        )
    }
}

function mapStateToProps(state) {
    return { user: state.user }
}

export default connect(mapStateToProps)(Profile)
