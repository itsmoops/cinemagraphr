const utilities = {
    isSmallDevice() {
        const mobileReg = new RegExp(/Mobile|iP(hone|od|ad)|Android|BlackBerry|IEMobile/)
        if (mobileReg.test(window.navigator.userAgent)) {
            return true
        } else if (window.innerWidth <= 768) {
            return true
        }
        return false
    },

    sanitizeUserErrorMessage(error) {
        switch (error.code) {
            case 'auth/user-not-found':
                return 'There is no user record corresponding to this email address. Make sure that you\'ve entered your information correctly.'
            case 'auth/email-already-in-use':
                return 'This email address is already in use by another account.'
            case 'auth/wrong-password':
                return 'The password entered is incorrect.'
            case 'auth/invalid-email':
                return 'The email address entered is badly formatted.'
            default:
                return error.message
        }
    }
}

export default utilities
