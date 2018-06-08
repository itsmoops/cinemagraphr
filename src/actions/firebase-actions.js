import firebase from 'firebase/app'
import 'firebase/storage'
import * as types from './action-types'
import { loadingStateChange } from './global-actions'
import { sanitizeUserErrorMessage } from '../utilities/utilities'

export function sanitizeFirebaseState() {
    const reset = {}
    return {
        type: types.SANITIZE_FIREBASE_STATE,
        reset
    }
}

export function sanitizeFirebaseErrorState() {
    const reset = {
        message: undefined,
        code: undefined
    }
    return {
        type: types.SANITIZE_FIREBASE_ERROR_STATE,
        reset
    }
}
function uploadFileSuccess(fileURL) {
    return {
        type: types.UPLOAD_FILE_SUCCESS,
        fileURL
    }
}

function uploadFileFailure(error) {
    return {
        type: types.UPLOAD_FILE_FAILURE,
        error
    }
}

export function uploadFile(file) {
    return async (dispatch) => {
        try {
            dispatch(loadingStateChange(true))
            debugger
            if (!file.validFileTypes || file.validFileTypes.includes(file.type)) {
                const storageRef = firebase.storage().ref(`/${file.directory}/${file.name}`)
                const task = storageRef.put(file.file)
                task.on(
                    'state_changed',
                    (snapshot) => {
                        // can use this if a progress bar is needed
                    },
                    (err) => {
                        err.message = err.code && sanitizeUserErrorMessage(err)
                        dispatch(uploadFileFailure(err))
                        dispatch(loadingStateChange(false))
                    },
                    async () => {
                        // photo successfully uploaded
                        const fileURL = await storageRef.getDownloadURL()
                        dispatch(uploadFileSuccess(fileURL))
                        dispatch(sanitizeFirebaseErrorState())
                        dispatch(loadingStateChange(false))
                    }
                )
            } else {
                dispatch(
                    uploadFileFailure({
                        message: 'Invalid file type'
                    })
                )
                dispatch(loadingStateChange(false))
            }
        } catch (err) {
            err.message = err.code && sanitizeUserErrorMessage(err)
            dispatch(uploadFileFailure(err))
            dispatch(loadingStateChange(false))
        }
    }
}
