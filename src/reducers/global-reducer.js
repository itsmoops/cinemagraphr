import * as types from '../actions/action-types'

const defaultState = {
    isSmallDevice: false,
    loading: false
}

export default function globalReducer(state = defaultState, action) {
    switch (action.type) {
        case types.CHECK_DEVICE_SIZE:
            return { ...state, isSmallDevice: action.isSmallDevice }
        case types.LOADING_STATE_CHANGE:
            return { ...state, loading: action.loading }
        case types.TOGGLE_MENU_DROPDOWN:
            return { ...state, menuOpen: action.menuOpen }
        default:
            return state
    }
}
