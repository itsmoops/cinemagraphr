import firebase from 'firebase/app'
import 'firebase/storage'
import 'firebase/database'
import uuidV4 from 'uuid/v4'
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

function fetchDataSuccess(data) {
    return {
        type: types.FETCH_DATA_SUCCESS,
        data
    }
}

function fetchDataFailure(error) {
    return {
        type: types.FETCH_DATA_FAILURE,
        error
    }
}

export function fetchData(endpoint) {
    return async (dispatch) => {
        try {
            dispatch(loadingStateChange(true))
            await firebase
                .database()
                .ref(endpoint)
                .once('value', (snapshot) => {
                    dispatch(fetchDataSuccess(snapshot.val()))
                    dispatch(loadingStateChange(false))
                })
        } catch (err) {
            err.message = err.code && sanitizeUserErrorMessage(err)
            dispatch(fetchDataFailure(err))
            dispatch(loadingStateChange(false))
        }
    }
}

function writeDataSuccess(data) {
    return {
        type: types.WRITE_DATA_SUCCESS,
        data
    }
}

function writeDataFailure(error) {
    return {
        type: types.WRITE_DATA_FAILURE,
        error
    }
}

export function writeData(endpoint, data) {
    return async (dispatch) => {
        try {
            if (endpoint && data) {
                dispatch(loadingStateChange(true))
                const ref = firebase.database().ref(endpoint)
                ref.once('value', async (snapshot) => {
                    function onWriteCompleted(err) {
                        if (err) {
                            err.message = err.code && sanitizeUserErrorMessage(err)
                            dispatch(writeDataFailure(err))
                            dispatch(loadingStateChange(false))
                        } else {
                            dispatch(writeDataSuccess(this))
                            dispatch(loadingStateChange(false))
                        }
                    }
                    if (snapshot.exists()) {
                        await ref.update(data, onWriteCompleted.bind(data))
                    } else {
                        await ref.set(data, onWriteCompleted.bind(data))
                    }
                })
            }
        } catch (err) {
            err.message = err.code && sanitizeUserErrorMessage(err)
            dispatch(writeDataFailure(err))
            dispatch(loadingStateChange(false))
        }
    }
}

function updateDataSuccess(data) {
    return {
        type: types.UPDATE_DATA_SUCCESS,
        data
    }
}

function updateDataFailure(error) {
    return {
        type: types.UPDATE_DATA_FAILURE,
        error
    }
}

export function updateData(endpoint, data) {
    return async (dispatch) => {
        try {
            dispatch(loadingStateChange(true))
            if (endpoint && data) {
                dispatch(loadingStateChange(true))
                const ref = firebase.database().ref(endpoint)
                await ref.update(data, (err) => {
                    if (err) {
                        err.message = err.code && sanitizeUserErrorMessage(err)
                        dispatch(writeDataFailure(err))
                        dispatch(loadingStateChange(false))
                    } else {
                        dispatch(writeDataSuccess(data))
                        dispatch(loadingStateChange(false))
                    }
                })
            }
            dispatch(updateDataSuccess(true))
            dispatch(loadingStateChange(false))
        } catch (err) {
            err.message = err.code && sanitizeUserErrorMessage(err)
            dispatch(updateDataFailure(err))
            dispatch(loadingStateChange(false))
        }
    }
}

function pushDataSuccess(data) {
    return {
        type: types.PUSH_DATA_SUCCESS,
        data
    }
}

function pushDataFailure(error) {
    return {
        type: types.PUSH_DATA_FAILURE,
        error
    }
}

export function pushData(endpoint, data) {
    return async dispatch =>
        new Promise((resolve, reject) => {
            try {
                if (endpoint && data) {
                    dispatch(loadingStateChange(true))
                    const ref = firebase.database().ref(endpoint)
                    const newRef = ref.push()
                    newRef.set(data)
                    dispatch(pushDataSuccess(newRef.key))
                    dispatch(loadingStateChange(false))
                    resolve(newRef.key)
                }
            } catch (err) {
                err.message = err.code && sanitizeUserErrorMessage(err)
                dispatch(pushDataFailure(err))
                dispatch(loadingStateChange(false))
                reject()
            }
        })
}

function deleteDataSuccess(data) {
    return {
        type: types.DELETE_DATA_SUCCESS,
        data
    }
}

function deleteDataFailure(error) {
    return {
        type: types.DELETE_DATA_FAILURE,
        error
    }
}

export function deleteData(endpoint) {
    return async (dispatch) => {
        try {
            dispatch(loadingStateChange(true))
            dispatch(deleteDataSuccess(true))
            dispatch(loadingStateChange(false))
        } catch (err) {
            err.message = err.code && sanitizeUserErrorMessage(err)
            dispatch(deleteDataFailure(err))
            dispatch(loadingStateChange(false))
        }
    }
}

function uploadFileSuccess(data) {
    return {
        type: types.UPLOAD_FILE_SUCCESS,
        data
    }
}

function uploadFileFailure(error) {
    return {
        type: types.UPLOAD_FILE_FAILURE,
        error
    }
}

export function uploadFile(file) {
    return async dispatch =>
        new Promise((resolve, reject) => {
            try {
                dispatch(loadingStateChange(true))
                const typeShort = file.type === 'audio/x-m4a' ? 'm4a' : file.type.split('/')[1]
                const uniqueName = `${file.name.split(`.${typeShort}`)[0]}-${uuidV4()}.${typeShort}`

                const storageRef = firebase.storage().ref(`/${file.directory}/${uniqueName}`)
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
                        reject()
                    },
                    async () => {
                        const metadata = await storageRef.getMetadata()
                        const fileURL = await storageRef.getDownloadURL()
                        const fileData = { ...metadata, fileURL }
                        dispatch(uploadFileSuccess(fileData))
                        dispatch(sanitizeFirebaseErrorState())
                        dispatch(loadingStateChange(false))
                        resolve(fileData)
                    }
                )
            } catch (err) {
                err.message = err.code && sanitizeUserErrorMessage(err)
                dispatch(uploadFileFailure(err))
                dispatch(loadingStateChange(false))
                reject()
            }
        })
}
