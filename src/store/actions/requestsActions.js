import { requestsAPI } from '../../services/api'
import snackbarActions from './snackbarActions'

const setLoading = () => {
  return { type: 'REQUESTS_SET_LOADING' }
}

const loadingSuccess = (data) => {
  return { type: 'REQUESTS_LOADING_SUCCESS', payload: data }
}

const requestCanceled = (courseID) => {
  return { type: 'REQUEST_CANCELED', payload: courseID }
}

const CMERequestUpdated = (data) => {
  return { type: 'REQUESTS_CME_REQUEST_UPDATE', payload: data }
}

const getRequests = () => async (dispatch) => {
  dispatch(setLoading())

  const response = await requestsAPI.getRequests()

  if (response.data.response) dispatch(loadingSuccess(response.data.requests))
  else dispatch(snackbarActions.showError(response.data.error))
}

const cancelRequest = (course, uid) => async (dispatch) => {
  dispatch(setLoading())

  const response = await requestsAPI.cancelRequest(course.id, uid)
  if (response.data.response) {
    dispatch(requestCanceled(course.id))
    dispatch(
      snackbarActions.showSuccess(
        `Заявка на обучение по программе «${course.name}» отменена`
      )
    )
  } else dispatch(snackbarActions.showError(response.data.error))
}

const updateCMERequest = (data) => async (dispatch) => {
  const response = await requestsAPI.updateCMERequest(data)
  console.log(response.data)

  if (response.data.response) dispatch(CMERequestUpdated(data))
  else dispatch(snackbarActions.showError(response.data.error))
}

export default {
  getRequests,
  cancelRequest,
  updateCMERequest,
}
