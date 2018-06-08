import * as types from '../actions/action-types'

const defaultState = {
    authenticated: false
}

export default function firebaseReducer(state = defaultState, action) {
    switch (action.type) {
        case types.UPLOAD_FILE_SUCCESS:
            debugger
            return { ...state, ...{ fileURL: action.fileURL } }
        case types.UPLOAD_FILE_FAILURE:
            return { ...state, ...action.error }
        default:
            return state
    }
}
