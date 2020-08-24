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

const getRequests = () => async (dispatch) => {
  dispatch(setLoading())

  const response = await requestsAPI.getRequests()

  //console.log(response)

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

export default {
  getRequests,
  cancelRequest,
}
