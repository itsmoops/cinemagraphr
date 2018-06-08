import * as types from '../actions/action-types'

const defaultState = {
    authenticated: false
}

export default function firebaseReducer(state = defaultState, action) {
    switch (action.type) {
        case types.UPLOAD_FILE_SUCCESS:
            return { ...state, ...{ fileURL: action.fileURL } }
        case types.UPLOAD_FILE_FAILURE:
            return { ...state, ...action.error }
        case types.SANITIZE_FIREBASE_STATE:
            return { ...state, ...action.reset }
        case types.SANITIZE_FIREBASE_ERROR_STATE:
            return { ...state, ...action.reset }
        default:
            return state
    }
}
