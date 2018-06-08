import firebase from 'firebase/app'
import 'firebase/storage'
import * as types from './action-types'
import { loadingStateChange } from './global-actions'
import { sanitizeUserErrorMessage } from '../utilities/utilities'

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
                    debugger
                    dispatch(uploadFileSuccess(fileURL))
                    dispatch(loadingStateChange(false))
                }
            )
        } catch (err) {
            err.message = err.code && sanitizeUserErrorMessage(err)
            dispatch(uploadFileFailure(err))
            dispatch(loadingStateChange(false))
        }
    }
}
