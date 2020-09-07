import { coursesAPI, requestsAPI, userAPI } from '../../services/api'
import snackbarActions from './snackbarActions'
import loaderActions from './loaderActions'

const setListenerInfoLoading = () => {
  return { type: 'COURSE_SET_LISTENER_INFO_LOADING' }
}
const loadingSuccess = (data) => {
  return { type: 'COURSES_LOADING_SUCCESS', payload: data }
}
const setSelectedCourse = (data) => {
  return { type: 'COURSES_SET_SELECTED_COURSE', payload: data }
}
const setListenerInfo = (data) => {
  return { type: 'COURSES_SET_LISTENER_INFO', payload: data }
}
const changeRequestStatus = (data) => {
  return { type: 'COURSES_CHANGE_REQUEST_STATUS', payload: data }
}
const courseRequestRemoved = (data) => {
  return { type: 'COURSES_REQUEST_REMOVED', payload: data }
}
const checkDataSaved = (data) => {
  return { type: 'COURSES_CHECK_DATA_SAVED', payload: data }
}

const requestCourses = (page, count, filters) => async (dispatch) => {
  dispatch(loaderActions.setLoading())
  const response = await coursesAPI.getCoursesList(page, count, filters)

  if (response.data.response) {
    dispatch(
      loadingSuccess({
        courses: response.data.courses,
        totalCount: response.data.totalCount,
        volumeList: response.data.volumeList,
        rootGroup: response.data.rootGroup,
        rootCathedra: response.data.rootCathedra,
      })
    )
    dispatch(loaderActions.loadingSuccess())
  } else dispatch(snackbarActions.showError(response.data.error))
}

const changeListParams = (page, count, filters) => async (dispatch) => {
  dispatch(loaderActions.setLoading())
  const response = await coursesAPI.getCoursesList(page, count, filters)

  if (response.data.response) {
    dispatch(
      loadingSuccess({
        courses: response.data.courses,
        totalCount: response.data.totalCount,
        page: response.data.page,
        pageSize: count,
        filters,
        rootGroup: response.data.rootGroup,
        rootCathedra: response.data.rootCathedra,
      })
    )
    dispatch(loaderActions.loadingSuccess())
  } else dispatch(snackbarActions.showError(response.data.error))
}

const createCancelRequest = async (
  dispatch,
  course,
  apiMethod,
  haveRequest,
  successMessage
) => {
  dispatch(loaderActions.setLoading())
  const response = await apiMethod(course)
  console.log(response.data)
  const users = response.data.users

  if (response.data.response) {
    const uid = userAPI.getUID()
    dispatch(changeRequestStatus({ course, users, haveRequest, uid }))
    dispatch(snackbarActions.showSuccess(successMessage))
    dispatch(loaderActions.loadingSuccess())
  } else dispatch(snackbarActions.showError(response.data.error))
}

const createRequest = (course) => async (dispatch) => {
  const message = `Подана заявка на обучение по программе «${course.Name}»`
  const apiMethod = requestsAPI.createRequest
  createCancelRequest(dispatch, course.ID, apiMethod, 1, message)
}

const cancelRequest = (course) => async (dispatch) => {
  const message = `Заявка на обучение по программе «${course.Name}» отменена`
  const apiMethod = requestsAPI.cancelRequest
  createCancelRequest(dispatch, course.ID, apiMethod, 0, message)
}

const removeCourseRequest = (courseID, userID) => async (dispatch) => {
  const isUserAuthorized = userID === userAPI.getUID()
  const response = await requestsAPI.cancelRequest(courseID, userID)

  if (response.data.response) {
    dispatch(courseRequestRemoved({ courseID, userID, isUserAuthorized }))
  } else dispatch(snackbarActions.showError(response.data.error))
}

const getListenerInfo = (userID) => async (dispatch) => {
  dispatch(setListenerInfoLoading())
  const response = await coursesAPI.getListenerInfo(userID)

  if (response.data.response) {
    dispatch(
      setListenerInfo({
        ...response.data.info,
        documents: response.data.documents,
      })
    )
    dispatch(loaderActions.loadingSuccess())
  } else dispatch(snackbarActions.showError(response.data.error))
}

const saveCheckData = (userID, rowID, data) => async (dispatch) => {
  const simpleDocumentsCheck = data.documents.map((document) => {
    return {
      id: document.id,
      check: document.documentCheck,
    }
  })

  const sendingData = {
    ...data,
    documents: simpleDocumentsCheck,
  }

  const response = await coursesAPI.saveCheckData(userID, rowID, sendingData)

  if (response.data.response) {
    dispatch(
      checkDataSaved({
        ...data,
        currentDatetime: response.data.currentDatetime,
        rowID,
      })
    )
    dispatch(snackbarActions.showSuccess('Изменения сохранены'))
  } else dispatch(snackbarActions.showError(response.data.error))
}

export default {
  setSelectedCourse,
  requestCourses,
  changeListParams,
  createRequest,
  cancelRequest,
  getListenerInfo,
  removeCourseRequest,
  saveCheckData,
}
