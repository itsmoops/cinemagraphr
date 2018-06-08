import * as types from './action-types'

export function checkDeviceSize() {
    let isSmallDevice = false
    const mobileReg = new RegExp(/Mobile|iP(hone|od|ad)|Android|BlackBerry|IEMobile/)
    if (mobileReg.test(window.navigator.userAgent)) {
        isSmallDevice = true
    } else if (window.innerWidth <= 768) {
        isSmallDevice = true
    }
    return {
        type: types.CHECK_DEVICE_SIZE,
        isSmallDevice
    }
}

export function loadingStateChange(loading) {
    return {
        type: types.LOADING_STATE_CHANGE,
        loading
    }
}

export function toggleMenuDropdown(menuOpen) {
    return {
        type: types.TOGGLE_MENU_DROPDOWN,
        menuOpen
    }
}
