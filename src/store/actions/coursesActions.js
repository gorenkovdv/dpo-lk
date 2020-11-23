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
const requestUserRemoved = (data) => {
  return { type: 'COURSES_REQUEST_USER_REMOVED', payload: data }
}
const checkDataSaved = (data) => {
  return { type: 'COURSES_CHECK_DATA_SAVED', payload: data }
}

const setListenersOptionsLoading = () => {
  return { type: 'COURSES_LISTENERS_OPTIONS_LOADING' }
}

const setListenersOptions = (data) => {
  return { type: 'COURSES_SET_LISTENERS_OPTIONS', payload: data }
}

const addListenerToList = (data) => {
  return { type: 'COURSES_ADD_LISTENER_TO_LIST', payload: data }
}

const setAdditionDialogOpen = (status) => {
  return { type: 'COURSES_SET_ADDITION_DIALOG_OPEN', payload: status }
}

const removeListenerFromList = (userID) => {
  return { type: 'COURSES_REMOVE_LISTENER_FROM_LIST', payload: userID }
}

const clearAdditionListeners = () => {
  return { type: 'COURSES_CLEAR_ADDITION_LISTENERS' }
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

const createRequest = (course) => async (dispatch) => {
  dispatch(loaderActions.setLoading())
  const response = await requestsAPI.createRequest(course.ID)
  const users = response.data.users

  console.log(response.data)

  if (response.data.response) {
    dispatch(changeRequestStatus({ courseID: course.ID, users }))
    dispatch(
      snackbarActions.showSuccess(
        `Подана заявка на обучение по программе «${course.Name}»`
      )
    )
    dispatch(loaderActions.loadingSuccess())
  } else dispatch(snackbarActions.showError(response.data.error))
}

const cancelRequest = (course, requestID) => async (dispatch) => {
  const message = `Заявка на обучение по программе «${course.Name}» отменена`

  dispatch(loaderActions.setLoading())
  const response = await requestsAPI.cancelRequest(requestID)
  const users = response.data.users

  console.log(response.data)

  if (response.data.response) {
    dispatch(changeRequestStatus({ courseID: course.ID, users, requestID }))
    dispatch(snackbarActions.showSuccess(message))
    dispatch(loaderActions.loadingSuccess())
  } else dispatch(snackbarActions.showError(response.data.error))
}

const createListenersRequests = (courseID, users) => async (dispatch) => {
  dispatch(loaderActions.setLoading())
  const response = await coursesAPI.createListenersRequests(courseID, users)

  if (response.data.response) {
    dispatch(
      changeRequestStatus({
        courseID,
        users: response.data.users,
      })
    )
    dispatch(snackbarActions.showSuccess('Слушатели добавлены на курс'))
    dispatch(loaderActions.loadingSuccess())
  } else dispatch(snackbarActions.showError(response.data.error))
}

const removeRequestUser = (courseID, rowID) => async (dispatch) => {
  const response = await requestsAPI.removeRequestUser(rowID)

  console.log(response.data)

  if (response.data.response) {
    dispatch(
      requestUserRemoved({
        courseID,
        rowID,
        userID: userAPI.getUID(),
      })
    )
    dispatch(snackbarActions.showSuccess('Слушатель удалён из заявки'))
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
  } else dispatch(snackbarActions.showError(response.data.error))
}

const getListenersOptions = (value) => async (dispatch) => {
  dispatch(setListenersOptionsLoading())

  if (value.length > 5) {
    const response = await coursesAPI.getListenersOptions(value)

    //console.log(response.data)

    if (response.data.response)
      dispatch(setListenersOptions(response.data.listeners))
    else dispatch(snackbarActions.showError(response.data.error))
  } else {
    dispatch(setListenersOptions([]))
  }
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

const addNewListener = (values) => async (dispatch) => {
  const response = await coursesAPI.addNewListener(values)

  console.log(response.data)

  if (response.data.response) {
    dispatch(addListenerToList(response.data.user))
    dispatch(setAdditionDialogOpen(false))
  } else dispatch(snackbarActions.showError(response.data.error))
}

export default {
  setSelectedCourse,
  requestCourses,
  changeListParams,
  createRequest,
  cancelRequest,
  getListenerInfo,
  removeRequestUser,
  saveCheckData,
  getListenersOptions,
  setAdditionDialogOpen,
  addListenerToList,
  removeListenerFromList,
  clearAdditionListeners,
  createListenersRequests,
  addNewListener,
}
