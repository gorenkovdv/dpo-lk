import { profileAPI, documentAPI } from '../../services/api'
import { actions as snackbarActions } from '../reducers/snackbar'
import { actions as loaderActions } from '../reducers/loader'

const loadingSuccess = (data) => {
  return { type: 'LISTENER_DATA_LOAD_SUCCESS', payload: data }
}

const setSelectedTab = (value) => {
  return { type: 'LISTENER_DATA_SET_SELECTED_TAB', payload: value }
}

const setDocumentsTab = (value) => {
  return { type: 'LISTENER_DATA_SET_DOCUMENTS_TAB', payload: value }
}

const requestListenerData = (selectedTab) => async (dispatch) => {
  dispatch(loaderActions.setLoading())

  const response = await profileAPI.getListenerData(selectedTab)
  if (response.data.response) {
    dispatch(loadingSuccess(response.data))
    dispatch(loaderActions.loadingSuccess())
  } else dispatch(snackbarActions.showError(response.data.error))
}

const workFileDeleted = () => {
  return { type: 'LISTENER_DATA_WORK_FILE_DELETED' }
}
const workFileDelete = () => async (dispatch) => {
  const response = await documentAPI.deleteWorkFile()

  if (response.data.response) dispatch(workFileDeleted())
  else dispatch(snackbarActions.showError(response.data.error))
}

const selectEducationLevel = (level) => {
  return { type: 'LISTENER_DATA_CHANGE_EDUCATION_LEVEL', payload: level }
}
const dropNewEducationDocument = () => {
  return { type: 'LISTENER_DATA_DROP_NEW_EDUCATION_DOCUMENT' }
}
const dropNewSertificate = (redirectIndex) => {
  return { type: 'LISTENER_DATA_DROP_NEW_SERTIFICATE', payload: redirectIndex }
}
const dropNewOthersDocument = (redirectIndex) => {
  return {
    type: 'LISTENER_DATA_DROP_NEW_OTHERS_DOCUMENT',
    payload: redirectIndex,
  }
}

const setDataActionTypes = (type) => {
  switch (type) {
    case 0:
      return 'LISTENER_DATA_SET_REG_ADDRESS'
    case 1:
      return 'LISTENER_DATA_SET_FACT_ADDRESS'
    case 2:
      return 'LISTENER_DATA_SET_PASSPORT_DATA'
    case 3:
      return 'LISTENER_DATA_SET_WORK_DATA'
    case 4:
      return 'LISTENER_DATA_SET_EDUCATION_DATA'
    case 5:
      return 'LISTENER_DATA_SET_SERTIFICATES_DATA'
    case 6:
      return 'LISTENER_DATA_SET_OTHERS_DATA'
    default:
      return null
  }
}

const dataUpdated = (data, type) => {
  return { type: setDataActionTypes(type), payload: data }
}
const updateData = (data, type) => async (dispatch) => {
  const response = await profileAPI.setListenerData(data, type)

  if (response.data.response) {
    dispatch(dataUpdated(response.data.output, type))
    dispatch(snackbarActions.showSuccess('Данные успешно обновлены'))
  } else dispatch(snackbarActions.showError(response.data.error))
}

const fileDeletedActionTypes = (type) => {
  switch (type) {
    case 4:
      return 'LISTENER_DATA_EDUCATION_FILE_DELETED'
    case 5:
      return 'LISTENER_DATA_SERTIFICATE_FILE_DELETED'
    case 6:
      return 'LISTENER_DATA_OTHERS_FILE_DELETED'
    default:
      return null
  }
}

const fileDeleted = (documentId, type) => {
  return { type: fileDeletedActionTypes(type), payload: documentId }
}
const requestFileDelete = (documentId, type) => async (dispatch) => {
  const response = await documentAPI.deleteDocumentsFile(documentId)

  if (response.data.response) {
    dispatch(fileDeleted(documentId, type))
    dispatch(snackbarActions.showSuccess('Файл успешно удалён'))
  } else dispatch(snackbarActions.showError(response.data.error))
}

const documentDeletedActionTypes = (type) => {
  switch (type) {
    case 4:
      return 'LISTENER_DATA_EDUCATION_DOCUMENT_DELETED'
    case 5:
      return 'LISTENER_DATA_SERTIFICATES_DOCUMENT_DELETED'
    case 6:
      return 'LISTENER_DATA_OTHERS_DOCUMENT_DELETED'
    default:
      return null
  }
}

const documentDeleted = (documentId, type) => {
  return { type: documentDeletedActionTypes(type), payload: documentId }
}
const requestDocumentDelete = (documentId, type) => async (dispatch) => {
  const response = await documentAPI.deleteDocument(documentId)

  if (response.data.response) {
    dispatch(documentDeleted(documentId, type))
    dispatch(snackbarActions.showSuccess('Документ успешно удалён'))
  } else dispatch(snackbarActions.showError(response.data.error))
}

const selectDocumentActionTypes = (type) => {
  switch (type) {
    case 4:
      return 'LISTENER_DATA_CHANGE_EDUCATION_DOCUMENT'
    case 5:
      return 'LISTENER_DATA_CHANGE_SERTIFICATES_DOCUMENT'
    case 6:
      return 'LISTENER_DATA_CHANGE_OTHERS_DOCUMENT'
    default:
      return null
  }
}

const selectDocument = (index, type) => {
  return { type: selectDocumentActionTypes(type), payload: index }
}

const createNewDocumentActionTypes = (type) => {
  switch (type) {
    case 4:
      return 'LISTENER_DATA_CREATE_NEW_EDUCATION_DOCUMENT'
    case 5:
      return 'LISTENER_DATA_CREATE_NEW_SERTIFICATE'
    case 6:
      return 'LISTENER_DATA_CREATE_NEW_OTHERS_DOCUMENT'
    default:
      return null
  }
}

const createNewDocument = (document, type) => {
  return { type: createNewDocumentActionTypes(type), payload: document }
}

export default {
  setSelectedTab,
  setDocumentsTab,
  requestListenerData,
  updateData,
  workFileDelete,
  createNewDocument,
  selectDocument,
  selectEducationLevel,
  dropNewEducationDocument,
  dropNewSertificate,
  dropNewOthersDocument,
  requestFileDelete,
  requestDocumentDelete,
}
