import firebase from 'firebase/app'
import 'firebase/storage'
import 'firebase/firestore'
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
        errorMessage: undefined,
        code: undefined
    }
    return {
        type: types.SANITIZE_FIREBASE_ERROR_STATE,
        reset
    }
}

export function docExists(collection, field, value) {
    return new Promise(async (resolve, reject) => {
        try {
            const docRef = await firebase
                .firestore()
                .collection(collection)
                .where(field, '==', value)
                .get()
            if (docRef.size >= 1) {
                resolve(docRef.docs[0].exists)
            } else {
                resolve(false)
            }
        } catch (err) {
            reject(err)
        }
    })
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

export function fetchData(endpoint, ref) {
    return async (dispatch) => {
        try {
            dispatch(loadingStateChange(true))
            const db = firebase.firestore()
            if (ref) {
                const doc = await db
                    .collection(endpoint)
                    .doc(ref)
                    .get()
                dispatch(fetchDataSuccess(doc.data()))
                dispatch(loadingStateChange(false))
            } else {
                const doc = await firebase
                    .firestore()
                    .collection(endpoint)
                    .get()
                dispatch(fetchDataSuccess(doc.data()))
                dispatch(loadingStateChange(false))
            }
        } catch (err) {
            err.errorMessage = err.code && sanitizeUserErrorMessage(err)
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

export function writeData(endpoint, data, key) {
    return async (dispatch) => {
        try {
            if (endpoint && data) {
                dispatch(loadingStateChange(true))
                const ref = await firebase.firestore().collection(endpoint)
                if (key) {
                    await ref.doc(key).set(data)
                    dispatch(writeDataSuccess(data))
                    dispatch(loadingStateChange(false))
                } else {
                    await ref.add(data)
                    dispatch(writeDataSuccess(data))
                    dispatch(loadingStateChange(false))
                }
            }
        } catch (err) {
            err.errorMessage = err.code && sanitizeUserErrorMessage(err)
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

export function updateData(endpoint, data, ref, merge) {
    return async (dispatch) => {
        try {
            dispatch(loadingStateChange(true))
            if (endpoint && data && ref) {
                if (merge) {
                    await firebase
                        .firestore()
                        .collection(endpoint)
                        .doc(ref)
                        .set(data, { merge: true })
                    dispatch(updateDataSuccess(true))
                    dispatch(loadingStateChange(false))
                } else {
                    await firebase
                        .firestore()
                        .collection(endpoint)
                        .doc(ref)
                        .update(data)
                }
            }
        } catch (err) {
            err.errorMessage = err.code && sanitizeUserErrorMessage(err)
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
        new Promise(async (resolve, reject) => {
            try {
                if (endpoint && data) {
                    dispatch(loadingStateChange(true))
                    const docRef = await firebase
                        .firestore()
                        .collection(endpoint)
                        .add(data)
                    docRef.update({
                        postId: docRef.id
                    })
                    resolve(docRef.id)
                    dispatch(pushDataSuccess(docRef.id))
                    dispatch(loadingStateChange(false))
                }
            } catch (err) {
                err.errorMessage = err.code && sanitizeUserErrorMessage(err)
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
            err.errorMessage = err.code && sanitizeUserErrorMessage(err)
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
                        err.errorMessage = err.code && sanitizeUserErrorMessage(err)
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
                err.errorMessage = err.code && sanitizeUserErrorMessage(err)
                dispatch(uploadFileFailure(err))
                dispatch(loadingStateChange(false))
                reject()
            }
        })
}
