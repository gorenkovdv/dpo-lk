import { requestsAPI } from '../../services/api'
import { actions as snackbarActions } from '../reducers/snackbar'
import { actions as loaderActions } from '../reducers/loader'

const loadingSuccess = (data) => {
  return { type: 'REQUESTS_LOADING_SUCCESS', payload: data }
}

const requestCanceled = (courseID) => {
  return { type: 'REQUEST_CANCELED', payload: courseID }
}

const CMERequestUpdated = (data) => {
  return { type: 'REQUESTS_CME_REQUEST_UPDATE', payload: data }
}

const setSelectedRequest = (request) => {
  return { type: 'REQUESTS_SET_SELECTED_REQUEST', payload: request }
}

const documentsApprove = (data) => {
  return { type: 'REQUESTS_DOCUMENTS_APPROVE', payload: data }
}

const getRequests = () => async (dispatch) => {
  dispatch(loaderActions.setLoading())

  const response = await requestsAPI.getRequests()

  console.log(response.data)

  if (response.data.response) {
    dispatch(loadingSuccess(response.data.requests))
    dispatch(loaderActions.loadingSuccess())
  } else dispatch(snackbarActions.showError(response.data.error))
}

const cancelRequest = (request) => async (dispatch) => {
  dispatch(loaderActions.setLoading())

  const response = await requestsAPI.cancelRequest(request.ID)

  console.log(response.data)

  if (response.data.response) {
    dispatch(requestCanceled(request.ID))
    dispatch(
      snackbarActions.showSuccess(
        `Заявка на обучение по программе «${request.courseName}» отменена`
      )
    )
    dispatch(loaderActions.loadingSuccess())
  } else dispatch(snackbarActions.showError(response.data.error))
}

const updateCMERequest = (data) => async (dispatch) => {
  const response = await requestsAPI.updateCMERequest(data)

  if (response.data.response) dispatch(CMERequestUpdated(data))
  else dispatch(snackbarActions.showError(response.data.error))
}

const setDocumentsApprove = (requestID, status) => async (dispatch) => {
  dispatch(loaderActions.setLoading())
  const response = await requestsAPI.setDocumentsApprove(requestID, status)

  console.log(response.data)

  if (response.data.response) {
    dispatch(documentsApprove({ requestID, status }))
    dispatch(loaderActions.loadingSuccess())
  } else dispatch(snackbarActions.showError(response.data.error))
}

export default {
  getRequests,
  cancelRequest,
  updateCMERequest,
  setSelectedRequest,
  setDocumentsApprove,
}
