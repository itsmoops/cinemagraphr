import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import firebase from 'firebase/app'
import 'firebase/database'
import * as userActions from '../../actions/user-actions'
import * as firebaseActions from '../../actions/firebase-actions'
import Cinemagraph from '../cinemagraph/cinemagraph'
import Controls from '../cinemagraph/controls'

class HomePage extends React.Component {
    constructor() {
        super()
        document.title = 'cinemagraphr'
        this.state = {
            cinemagraph: {},
            audio: [],
            theater: false
        }
    }
    componentDidMount() {
        ReactGA.pageview(window.location.pathname)

        if (window.location.search) {
            const postId = window.location.search.split('=')[1]
            const cinemagraphsRef = firebase.database().ref(`cinemagraphs/-${postId}`)
            cinemagraphsRef.once('value', (snapshot) => {
                const data = snapshot.val()
                if (data !== null) {
                    document.title = data.title
                    this.setState({
                        cinemagraph: data,
                        audio: data.audio || [],
                        theater: data.theater
                    })
                }
            })
        } else {
            const cinemagraphsRef = firebase.database().ref('cinemagraphs')
            cinemagraphsRef.once('value', (snapshot) => {
                // for now just choose one
                const data = snapshot.val()

                Object.entries(data).forEach(([key, value], idx) => {
                    const upvotes = Math.ceil(Math.random() * 5000)
                    const downvotes = Math.ceil(Math.random() * 5000)
                    const ratio = upvotes / (upvotes + downvotes)

                    this.props.firebaseActions.updateData(`cinemagraphs/${key}`, {
                        postId: key,
                        upvotes,
                        downvotes,
                        ratio: parseFloat(ratio.toFixed(6))
                    })
                })

                const idx = Math.ceil(Math.random() * (Object.values(data).length - 1))
                if (data !== null) {
                    this.setState({
                        cinemagraph: Object.values(data)[idx],
                        audio: Object.values(data)[idx].audio || [],
                        theater: Object.values(data)[idx].theater
                    })
                }
            })
        }
    }
    shouldComponentUpdate(nextProps, nextState) {
        if (nextState.audio !== this.state.audio || nextState.theater !== this.state.theater) {
            return true
        }
        return false
    }
    render() {
        const { cinemagraph, audio } = this.state
        return (
            <div>
                <Cinemagraph creatorMode cinemagraph={cinemagraph} theater={this.state.theater} />
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
