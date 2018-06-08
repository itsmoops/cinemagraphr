import { combineReducers } from 'redux'
import global from './global-reducer'
import user from './user-reducer'
import firebase from './firebase-reducer'

// naming here matters, this is how we will reference data in components
const rootReducer = combineReducers({
    global,
    user,
    firebase
})

export default rootReducer
