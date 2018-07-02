import firebase from 'firebase/app'
import { BrowserRouter as Router } from 'react-router-dom'
import { Provider } from 'react-redux'
import { ThemeProvider } from 'styled-components'
import common from './styles/common'
import colors from './styles/colors'
import routes from './routes'
import storeConfig from './store/config'
import firebaseConfig from './firebase-config'
import './styles/global'

// environment settings
let store
if (process.env.NODE_ENV === 'production') {
    store = storeConfig.prod()
    firebase.initializeApp(firebaseConfig.prod)
} else {
    store = storeConfig.dev()
    firebase.initializeApp(firebaseConfig.dev)
}

const firestore = firebase.firestore()
const settings = { /* your settings... */ timestampsInSnapshots: true }
firestore.settings(settings)

// merge styles for theme
const theme = Object.assign({}, common, colors)

// analytics
ReactGA.initialize('UA-120888774-1')

ReactDOM.render(
    <Provider store={store}>
        <ThemeProvider theme={theme}>
            <Router>{routes}</Router>
        </ThemeProvider>
    </Provider>,
    document.getElementById('app')
)
