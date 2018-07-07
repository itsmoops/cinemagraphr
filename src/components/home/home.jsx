import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import styled, { css, keyframes } from 'styled-components'
import firebase from 'firebase/app'
import 'firebase/firestore'
import * as userActions from '../../actions/user-actions'
import * as firebaseActions from '../../actions/firebase-actions'
import Title from './title'
import Cinemagraph from '../cinemagraph/cinemagraph'
import Controls from '../cinemagraph/controls'
import VoteControls from '../shared/vote-controls'

const animationTime = 10

const fadeIn = keyframes`
    0% {
        filter: blur(4px);
    }
    100% {
        filter: blur(0px);
    }
`

const Container = styled.div`
    ${props =>
        props.firstVisit &&
        css`
            animation-name: ${fadeIn};
            animation-iteration-count: 1;
            animation-timing-function: ease-in;
            animation-duration: ${animationTime}s;
        `};
`

class HomePage extends React.Component {
    constructor() {
        super()
        document.title = 'cinemagraphr'
        this.state = {
            cinemagraph: {},
            audio: [],
            theater: false,
            firstVisit: !localStorage.getItem('visited')
        }
    }
    async componentDidMount() {
        ReactGA.pageview(window.location.pathname)

        if (this.state.firstVisit) {
            setTimeout(() => {
                localStorage.setItem('visited', true)
                this.setState({
                    firstVisit: false
                })
            }, animationTime * 1000)
        }

        if (window.location.search) {
            const postId = window.location.search.split('=')[1]
            const cinemagraphs = await firebase
                .firestore()
                .collection('cinemagraphs')
                .where('postId', '==', postId)
                .get()
            if (cinemagraphs.size >= 1) {
                const data = cinemagraphs.docs[0].data()
                document.title = data.title
                this.setState({
                    cinemagraph: data,
                    audio: data.audio || [],
                    theater: data.theater
                })
            }
        } else {
            const cinemagraphs = await firebase
                .firestore()
                .collection('cinemagraphs')
                .get()
            if (cinemagraphs.size >= 1) {
                // for now just choose one
                const idx = Math.ceil(Math.random() * (cinemagraphs.size - 1))
                const data = cinemagraphs.docs[idx].data()
                document.title = data.title
                this.setState({
                    cinemagraph: data,
                    audio: data.audio || [],
                    theater: data.theater
                })

                // TODO: Remove - randomize some upvotes and downvotes
                cinemagraphs.docs.forEach((doc) => {
                    const upvotes = Math.ceil(Math.random() * 5000)
                    const downvotes = Math.ceil(Math.random() * 5000)
                    const ratio = upvotes / (upvotes + downvotes)
                    this.props.firebaseActions.updateData(
                        'cinemagraphs',
                        {
                            userFavorites: [],
                            upvotes,
                            downvotes,
                            ratio: parseFloat(ratio.toFixed(6))
                        },
                        doc.id
                    )
                })
            }
        }
    }
    shouldComponentUpdate(nextProps, nextState) {
        if (nextState.audio !== this.state.audio || nextState.theater !== this.state.theater) {
            return true
        }
        return false
    }
    render() {
        const { cinemagraph, audio, theater, firstVisit } = this.state
        return (
            <div>
                {firstVisit && <Title render={!!Object.keys(cinemagraph).length} />}
                <Container firstVisit={firstVisit}>
                    <Cinemagraph
                        creatorMode
                        cinemagraph={cinemagraph}
                        theater={theater}
                        firstVisit={firstVisit} />
                    <Controls
                        creatorMode={false}
                        cinemagraph={!!Object.keys(cinemagraph).length}
                        audio={audio}
                        handleUploadAudio={this.handleUploadAudio}
                        handleRemoveAudio={this.handleRemoveAudio}
                        handleUpdateAudio={this.handleUpdateAudio}
                        toggleTheaterMode={() => {
                            this.setState(prevState => ({
                                theater: !prevState.theater
                            }))
                        }} />
                    <VoteControls iconSize={32} cinemagraph={cinemagraph} />
                </Container>
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        user: state.user,
        firebase: state.firebase
    }
}

function mapDispatchToProps(dispatch) {
    return {
        userActions: bindActionCreators(userActions, dispatch),
        firebaseActions: bindActionCreators(firebaseActions, dispatch)
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(HomePage)
