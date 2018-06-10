import * as types from '../actions/action-types'

export default function firebaseReducer(state = {}, action) {
    switch (action.type) {
        case types.FETCH_DATA_SUCCESS:
            return { ...state, ...action.data }
        case types.FETCH_DATA_FAILURE:
            return { ...state, ...action.data }
        case types.WRITE_DATA_SUCCESS:
            return { ...state, ...action.data }
        case types.WRITE_DATA_FAILURE:
            return { ...state, ...action.data }
        case types.UPDATE_DATA_SUCCESS:
            return { ...state, ...action.data }
        case types.UPDATE_DATA_FAILURE:
            return { ...state, ...action.data }
        case types.PUSH_DATA_SUCCESS:
            return { ...state, ...action.data }
        case types.PUSH_DATA_FAILURE:
            return { ...state, ...action.data }
        case types.DELETE_DATA_SUCCESS:
            return { ...state, ...action.data }
        case types.DELETE_DATA_FAILURE:
            return { ...state, ...action.data }
        case types.UPLOAD_FILE_SUCCESS:
            return { ...state, ...action.data }
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
