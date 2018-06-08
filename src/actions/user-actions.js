import * as types from './action-types'
import { loadingStateChange } from './global-actions'
import { sanitizeUserErrorMessage } from '../utilities/utilities'

export function sanitizeUserState() {
    const reset = {
        emailSent: undefined,
        passwordUpdated: undefined,
        codeVerified: undefined,
        profileSaved: undefined,
        profileUpdated: undefined
    }
    return {
        type: types.SANITIZE_USER_STATE,
        reset
    }
}

export function sanitizeUserErrorState() {
    const reset = {
        message: undefined,
        code: undefined
    }
    return {
        type: types.SANITIZE_USER_ERROR_STATE,
        reset
    }
}

function checkForUserSuccess(user) {
    return {
        type: types.CHECK_FOR_USER_SUCCESS,
        user
    }
}

function checkForUserFailed(user) {
    return {
        type: types.CHECK_FOR_USER_FAILURE,
        user
    }
}

export function checkForUser() {
    return (dispatch) => {
        dispatch(loadingStateChange(true))
        firebase.auth().onAuthStateChanged(async (user) => {
            if (user) {
                let userData = {
                    authenticated: true,
                    email: user.email,
                    emailVerified: user.emailVerified,
                    displayName: user.displayName,
                    isAnonymous: user.isAnonymous,
                    phoneNumber: user.phoneNumber,
                    photoURL: user.photoURL,
                    refreshToken: user.refreshToken,
                    dateCreated: user.metadata.creationTime,
                    uid: user.uid
                }
                const profileRef = firebase.database().ref(`users/${user.uid}`)
                profileRef.on('value', (snapshot) => {
                    const profileData = snapshot.val()
                    if (profileData !== null) {
                        userData = { ...userData, ...profileData }
                    }
                    dispatch(checkForUserSuccess(userData))
                    dispatch(loadingStateChange(false))
                })
            } else {
                const userData = {
                    authenticated: false
                }
                dispatch(checkForUserFailed(userData))
                dispatch(loadingStateChange(false))
            }
        })
    }
}

function userSignUpSuccess(user) {
    return {
        type: types.USER_SIGN_UP_SUCCESS,
        user
    }
}

function userSignUpFailure(error) {
    return {
        type: types.USER_SIGN_UP_FAILURE,
        error
    }
}

export function userSignUp(email, password) {
    return async (dispatch) => {
        try {
            dispatch(loadingStateChange(true))
            const user = await firebase.auth().createUserWithEmailAndPassword(email, password)
            const userData = {
                authenticated: true,
                email: user.email,
                emailVerified: user.emailVerified,
                displayName: user.displayName,
                isAnonymous: user.isAnonymous,
                phoneNumber: user.phoneNumber,
                photoURL: user.photoURL,
                refreshToken: user.refreshToken,
                message: undefined
            }
            dispatch(userSignUpSuccess(userData))
            dispatch(sanitizeUserErrorState())
            dispatch(loadingStateChange(false))
        } catch (err) {
            err.message = err.code && sanitizeUserErrorMessage(err)
            dispatch(userSignUpFailure(err))
            dispatch(loadingStateChange(false))
        }
    }
}

function userCompleteProfileSuccess(user) {
    return {
        type: types.USER_COMPLETE_PROFILE_SUCCESS,
        user
    }
}

function userCompleteProfileFailure(error) {
    return {
        type: types.USER_COMPLETE_PROFILE_FAILURE,
        error
    }
}

export function userCompleteProfile(userProfile) {
    return async (dispatch) => {
        try {
            dispatch(loadingStateChange(true))
            const user = await firebase.auth().currentUser
            await firebase
                .database()
                .ref(`users/${user.uid}`)
                .set(userProfile)
            await user.updateProfile({
                displayName: userProfile.firstName,
                phoneNumber: userProfile.phoneNumber
            })
            const success = {
                profileSaved: true
            }
            dispatch(userCompleteProfileSuccess(success))
            dispatch(sanitizeUserErrorState())
            dispatch(loadingStateChange(false))
        } catch (err) {
            err.message = err.code && sanitizeUserErrorMessage(err)
            dispatch(userCompleteProfileFailure(err))
            dispatch(loadingStateChange(false))
        }
    }
}

function userLoginSuccess(user) {
    return {
        type: types.USER_LOGIN_SUCCESS,
        user
    }
}

function userLoginFailure(error) {
    return {
        type: types.USER_LOGIN_FAILURE,
        error
    }
}

export function userLogin(email, password) {
    return async (dispatch) => {
        try {
            dispatch(loadingStateChange(true))
            const user = await firebase.auth().signInWithEmailAndPassword(email, password)
            const userData = {
                authenticated: true,
                email: user.email,
                emailVerified: user.emailVerified,
                displayName: user.displayName,
                isAnonymous: user.isAnonymous,
                phoneNumber: user.phoneNumber,
                photoURL: user.photoURL,
                refreshToken: user.refreshToken
            }
            dispatch(userLoginSuccess(userData))
            dispatch(loadingStateChange(false))
        } catch (err) {
            err.message = err.code && sanitizeUserErrorMessage(err)
            dispatch(userLoginFailure(err))
            dispatch(loadingStateChange(false))
        }
    }
}

function userLogoutSuccess(user) {
    return {
        type: types.USER_LOGOUT_SUCCESS,
        user
    }
}

function userLogoutFailure(error) {
    return {
        type: types.USER_LOGOUT_FAILURE,
        error
    }
}

export function userLogout() {
    return async (dispatch) => {
        try {
            dispatch(loadingStateChange(true))
            await firebase.auth().signOut()
            const userData = {
                authenticated: false
            }
            dispatch(userLogoutSuccess(userData))
            dispatch(loadingStateChange(false))
        } catch (err) {
            err.message = err.code && sanitizeUserErrorMessage(err)
            dispatch(userLogoutFailure(err))
            dispatch(loadingStateChange(false))
        }
    }
}

function sendEmailVerificationSuccess(success) {
    return {
        type: types.SEND_EMAIL_VERIFICATION_SUCCESS,
        success
    }
}

function sendEmailVerificationFailure(error) {
    return {
        type: types.SEND_EMAIL_VERIFICATION_FAILURE,
        error
    }
}

export function sendEmailVerification() {
    return async (dispatch) => {
        try {
            await firebase.auth().currentUser.sendEmailVerification()
            const success = {
                emailSent: true
            }
            dispatch(sendEmailVerificationSuccess(success))
        } catch (err) {
            err.message = err.code && sanitizeUserErrorMessage(err)
            dispatch(sendEmailVerificationFailure(err))
        }
    }
}

function verifyEmailCodeSuccess(success) {
    return {
        type: types.SEND_EMAIL_VERIFICATION_SUCCESS,
        success
    }
}

function verifyEmailCodeFailure(error) {
    return {
        type: types.SEND_EMAIL_VERIFICATION_FAILURE,
        error
    }
}

export function verifyEmailCode(code) {
    return async (dispatch) => {
        try {
            dispatch(loadingStateChange(true))
            await firebase.auth().applyActionCode(code)
            const success = {
                codeVerified: true
            }
            dispatch(verifyEmailCodeSuccess(success))
            dispatch(loadingStateChange(false))
        } catch (err) {
            err.message = err.code && sanitizeUserErrorMessage(err)
            dispatch(verifyEmailCodeFailure(err))
            dispatch(loadingStateChange(false))
        }
    }
}

function verifyPasswordResetCodeSuccess(success) {
    return {
        type: types.VERIFY_PASSWORD_RESET_CODE_SUCCESS,
        success
    }
}

function verifyPasswordResetCodeFailure(error) {
    return {
        type: types.VERIFY_PASSWORD_RESET_CODE_FAILURE,
        error
    }
}

export function verifyPasswordResetCode(code) {
    return async (dispatch) => {
        try {
            dispatch(loadingStateChange(true))
            await firebase.auth().verifyPasswordResetCode(code)
            const success = {
                codeVerified: true
            }
            dispatch(verifyPasswordResetCodeSuccess(success))
            dispatch(loadingStateChange(false))
        } catch (err) {
            err.message = err.code && sanitizeUserErrorMessage(err)
            dispatch(verifyPasswordResetCodeFailure(err))
            dispatch(loadingStateChange(false))
        }
    }
}

function confirmPasswordResetSuccess(success) {
    return {
        type: types.CONFIRM_PASSWORD_RESET_SUCCESS,
        success
    }
}

function confirmPasswordResetFailure(error) {
    return {
        type: types.CONFIRM_PASSWORD_RESET_FAILURE,
        error
    }
}

export function confirmPasswordReset(code, newPassword) {
    return async (dispatch) => {
        try {
            dispatch(loadingStateChange(true))
            await firebase.auth().confirmPasswordReset(code, newPassword)
            const success = {
                passwordUpdated: true
            }
            dispatch(confirmPasswordResetSuccess(success))
            dispatch(loadingStateChange(false))
        } catch (err) {
            err.message = err.code && sanitizeUserErrorMessage(err)
            dispatch(confirmPasswordResetFailure(err))
            dispatch(loadingStateChange(false))
        }
    }
}

function sendPasswordResetEmailSuccess(success) {
    return {
        type: types.SEND_PASSWORD_RESET_EMAIL_SUCCESS,
        success
    }
}

function sendPasswordResetEmailFailure(error) {
    return {
        type: types.SEND_PASSWORD_RESET_EMAIL_FAILURE,
        error
    }
}

export function sendPasswordResetEmail(email) {
    return async (dispatch) => {
        try {
            dispatch(loadingStateChange(true))
            await firebase.auth().sendPasswordResetEmail(email)
            const success = {
                emailSent: true
            }
            dispatch(sendPasswordResetEmailSuccess(success))
            dispatch(loadingStateChange(false))
        } catch (err) {
            err.message = err.code && sanitizeUserErrorMessage(err)
            dispatch(sendPasswordResetEmailFailure(err))
            dispatch(loadingStateChange(false))
        }
    }
}

function userUpdatePasswordSuccess(success) {
    return {
        type: types.USER_UPDATE_PASSWORD_SUCCESS,
        success
    }
}

function userUpdatePasswordFailure(error) {
    return {
        type: types.USER_UPDATE_PASSWORD_FAILURE,
        error
    }
}

export function userUpdatePassword(currentPassword, newPassword) {
    return async (dispatch) => {
        try {
            dispatch(loadingStateChange(true))
            const user = await firebase.auth().currentUser
            const credential = firebase.auth.EmailAuthProvider.credential(
                user.email,
                currentPassword
            )
            await user.reauthenticateWithCredential(credential)
            await user.updatePassword(newPassword)
            const success = {
                passwordUpdated: true
            }
            dispatch(userUpdatePasswordSuccess(success))
            dispatch(loadingStateChange(false))
        } catch (err) {
            err.message = err.code && sanitizeUserErrorMessage(err)
            dispatch(userUpdatePasswordFailure(err))
            dispatch(loadingStateChange(false))
        }
    }
}

function userUpdateProfileSuccess(user) {
    return {
        type: types.USER_UPDATE_PROFILE_SUCCESS,
        user
    }
}

function userUpdateProfileFailure(error) {
    return {
        type: types.USER_UPDATE_PROFILE_FAILURE,
        error
    }
}

export function userUpdateProfile(userProfile) {
    return async (dispatch) => {
        try {
            dispatch(loadingStateChange(true))
            const user = firebase.auth().currentUser
            await firebase
                .database()
                .ref(`users/${user.uid}`)
                .update(userProfile)
            const success = {
                profileUpdated: true
            }
            dispatch(userUpdateProfileSuccess(success))
            dispatch(loadingStateChange(false))
        } catch (err) {
            err.message = err.code && sanitizeUserErrorMessage(err)
            dispatch(userUpdateProfileFailure(err))
            dispatch(loadingStateChange(false))
        }
    }
}

function saveUserProfilePictureSuccess(success) {
    return {
        type: types.UPLOAD_PROFILE_PICTURE_SUCCESS,
        success
    }
}

function saveUserProfilePictureFailure(error) {
    return {
        type: types.UPLOAD_PROFILE_PICTURE_FAILURE,
        error
    }
}

export function saveUserProfilePicture(photoURL) {
    return async (dispatch) => {
        try {
            dispatch(loadingStateChange(true))
            const user = firebase.auth().currentUser
            await user.updateProfile({
                photoURL
            })
            const success = {
                profilePhotoSaved: true
            }
            dispatch(saveUserProfilePictureSuccess(success))
            dispatch(loadingStateChange(false))
        } catch (err) {
            err.message = err.code && sanitizeUserErrorMessage(err)
            dispatch(saveUserProfilePictureFailure(err))
            dispatch(loadingStateChange(false))
        }
    }
}
