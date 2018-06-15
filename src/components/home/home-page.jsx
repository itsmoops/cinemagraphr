import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import firebase from 'firebase/app'
import 'firebase/database'
import * as userActions from '../../actions/user-actions'
import * as firebaseActions from '../../actions/firebase-actions'
import Cinemagraph from '../cinemagraph/cinemagraph'

class HomePage extends React.Component {
    constructor() {
        super()
        document.title = 'cinemagraphr.io'
        this.state = {
            cinemagraph: {}
        }
    }
    componentDidMount() {
        ReactGA.pageview(window.location.pathname)

        const cinemagraphsRef = firebase.database().ref('cinemagraphs')
        cinemagraphsRef.once('value', (snapshot) => {
            // for now just choose one
            const data = snapshot.val()
            if (data !== null) {
                this.setState({
                    cinemagraph: Object.values(data)[
                        Math.ceil(Math.random() * (Object.values(data).length - 1))
                    ]
                })
            }
        })
    }
    render() {
        const { cinemagraph } = this.state
        return (
            <Cinemagraph
                creatorMode
                cinemagraph={cinemagraph}
                audio={cinemagraph.audio}
                theater={cinemagraph.theater} />
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
