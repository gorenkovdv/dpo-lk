import { ThunkAction } from 'redux-thunk'
import { coursesAPI, requestsAPI, userAPI } from '../../services/api'
import { actions as snackbarActions } from '../reducers/snackbar'
import { actions as loaderActions } from '../reducers/loader'
import { AppStateType, InferActionsType } from './index'
import { ICourseBasic, IDocument } from '../../types'
import moment from 'moment'

interface IUserOption {
  id: number
  login: string | null
  name: string
  isUserAdded?: boolean
}

interface ICourseUser {
  id: number
  requestID: number
  rowID: number
  fullname: string
  cathedraAllow?: number
  instituteAllow?: number
  comment: string
  lastUpdate: string | null
  requestCME: string | null
  checks: {
    cathedra: ICourseUserCheck,
    institute: ICourseUserCheck
  }
}

interface ICourseUserCheck {
  comment: string
  date: string | null
  label: string
  person: string | undefined
}

interface ICourse extends ICourseBasic {
  StartDateTooltip: string
  BeginDateMonth: string
  users: Array<ICourseUser>
}

interface IFilters {
  searchString: string
  searchUser: number | null
  enrolPossible: boolean
  CME: boolean
  traditional: boolean
  budgetaryOnly: boolean
  nonBudgetaryOnly: boolean
  retraining: boolean
  skillsDevelopment: boolean
  forDoctors: boolean
  forNursingStaff: boolean
  currentVolume: number
  startDate: string
  endDate: string
  minStartDate: string
  maxEndDate: string
}

interface ISelectedCourse {
  ID: number
  Name: string
}
interface IListenerInfo {
  documents?: Array<IDocument>
  fullname?: string
  username?: string
  birthdate?: string
  email?: string
  lastUpdate?: string | null
  phone?: string
  workCheck?: number
  isListenerInfoLoading: boolean
}

interface INewListener {
  lastname: string,
  firstname: string,
  middlename: string,
  birthdate: string | null,
  snils: string,
}

interface IState {
  list: Array<ICourse>
  filters: IFilters
  volumeList: Array<number>
  totalCount: number
  pageSize: number
  currentPage: number
  selectedCourse: ISelectedCourse | null
  listenerInfo: IListenerInfo
  listenersAddition: {
    isDialogOpen: boolean
    isLoading: boolean
    options: Array<IUserOption>
    list: Array<IUserOption>
  }
  roots: {
    group: number | null
    cathedra: string | null | undefined
  }
}

type coursesActionsTypes = InferActionsType<typeof actions>

const startDate = moment().add(-60, 'day').format('YYYY-MM-DD')
const minStartDate = moment()
  .startOf('year')
  .add(-1, 'year')
  .format('YYYY-MM-DD')

const initialState: IState = {
  list: [],
  filters: {
    searchString: '',
    searchUser: null,
    enrolPossible: true,
    CME: true,
    traditional: true,
    budgetaryOnly: false,
    nonBudgetaryOnly: false,
    retraining: true,
    skillsDevelopment: true,
    forDoctors: true,
    forNursingStaff: true,
    currentVolume: 0,
    startDate: startDate > minStartDate ? startDate : minStartDate,
    endDate: moment().add(2, 'years').format('YYYY-MM-DD'),
    minStartDate,
    maxEndDate: moment().add(3, 'years').format('YYYY-MM-DD'),
  },
  volumeList: [],
  totalCount: 0,
  pageSize: 5,
  currentPage: 1,
  roots: { group: null, cathedra: null },
  listenerInfo: {
    isListenerInfoLoading: false,
  },
  selectedCourse: null,
  listenersAddition: {
    isDialogOpen: false,
    isLoading: false,
    options: [],
    list: [],
  },
}

export const coursesReducer = (state = initialState, action: coursesActionsTypes): IState => {
  switch (action.type) {
    case 'COURSE_SET_LISTENER_INFO_LOADING':
      return {
        ...state,
        listenerInfo: {
          ...state.listenerInfo,
          isListenerInfoLoading: true,
        },
      }
    case 'COURSES_SET_SELECTED_COURSE':
      return {
        ...state,
        selectedCourse: action.payload,
      }
    case 'COURSES_SET_ADDITION_DIALOG_OPEN':
      return {
        ...state,
        listenersAddition: {
          ...state.listenersAddition,
          isDialogOpen: action.payload,
        },
      }
    case 'COURSES_CHANGE_REQUEST_STATUS':
      return {
        ...state,
        list: state.list.map((course, index) => {
          if (course.ID === action.payload.courseID) {
            return {
              ...course,
              users: action.payload.requestID
                ? state.list[index].users.filter(
                  (user) =>
                    user.requestID !==
                    action.payload.requestID
                )
                : state.list[index].users.concat(action.payload.users),
            }
          }
          return course
        }),
      }
    case 'COURSES_REQUEST_USER_REMOVED':
      return {
        ...state,
        list: state.list.map((course, index) => {
          if (course.ID === action.payload.courseID) {
            return {
              ...course,
              users: state.list[index].users.filter(
                (user) => {
                  console.log(user.rowID, action.payload.rowID)
                  return user.rowID !== action.payload.rowID
                }
              ),
            }
          }
          return course
        }),
      }
    case 'COURSES_LOADING_SUCCESS':
      return {
        ...state,
        list: action.payload.courses,
        filters: action.payload.filters
          ? action.payload.filters
          : state.filters,
        volumeList: action.payload.volumeList
          ? action.payload.volumeList
          : state.volumeList,
        currentPage:
          action.payload.page !== undefined
            ? action.payload.page
            : state.currentPage,
        totalCount: action.payload.totalCount,
        pageSize: action.payload.pageSize
          ? action.payload.pageSize
          : state.pageSize,
        roots: {
          group: action.payload.rootGroup,
          cathedra: action.payload.rootCathedra,
        },
      }
    case 'COURSES_SET_LISTENER_INFO':
      return {
        ...state,
        listenerInfo: {
          ...action.payload,
          isListenerInfoLoading: false,
        },
      }
    case 'COURSES_CHECK_DATA_SAVED':
      return {
        ...state,
        listenerInfo: {
          ...state.listenerInfo,
          workCheck: action.payload.workCheck
            ? action.payload.workCheck
            : state.listenerInfo.workCheck,
          documents: action.payload.documents,
        },
        list: state.list.map((course) => {
          return {
            ...course,
            users: course.users.map((user) => {
              if (
                state.selectedCourse &&
                (course.ID !== state.selectedCourse.ID ||
                  user.rowID !== action.payload.rowID)
              )
                return user

              return {
                ...user,
                comment: action.payload.comment
                  ? action.payload.comment
                  : user.comment,
                cathedraAllow:
                  action.payload.cathedraAllow !== undefined
                    ? action.payload.cathedraAllow
                      ? 1
                      : 0
                    : user.cathedraAllow,
                instituteAllow:
                  action.payload.instituteAllow !== undefined
                    ? action.payload.instituteAllow
                      ? 1
                      : 0
                    : user.instituteAllow,
                checks: {
                  cathedra:
                    action.payload.cathedraAllow !== undefined
                      ? {
                        date: action.payload.currentDatetime,
                        comment: action.payload.cathedraComment,
                        person: state.listenerInfo.fullname,
                        label: `: ${action.payload.currentDatetime} ${state.listenerInfo.fullname}`,
                      }
                      : user.checks.cathedra,
                  institute:
                    action.payload.instituteAllow !== undefined
                      ? {
                        date: action.payload.currentDatetime,
                        comment: action.payload.instituteComment,
                        person: state.listenerInfo.fullname,
                        label: `: ${action.payload.currentDatetime} ${state.listenerInfo.fullname}`,
                      }
                      : user.checks.institute,
                },
              }
            }),
          }
        }),
      }
    case 'COURSES_LISTENERS_OPTIONS_LOADING':
      return {
        ...state,
        listenersAddition: {
          ...state.listenersAddition,
          isLoading: true,
        },
      }
    case 'COURSES_SET_LISTENERS_OPTIONS':
      return {
        ...state,
        listenersAddition: {
          ...state.listenersAddition,
          isLoading: false,
          options: action.payload.map((user) => {
            let isUserAdded = false

            state.listenersAddition.list.map((addedUser) => {
              if (addedUser.id === user.id) isUserAdded = true
              return null
            })

            state.list
              .filter((item) => state.selectedCourse && item.ID === state.selectedCourse.ID)
              .map((searchingCourse) => {
                searchingCourse.users.map((addedUser) => {
                  if (addedUser.id === user.id) isUserAdded = true
                  return null
                })
                return null
              })

            return {
              id: user.id,
              login: user.username ? user.username.toLowerCase() : null,
              name: user.fullname,
              isUserAdded,
            }
          }),
        },
      }
    case 'COURSES_ADD_LISTENER_TO_LIST':
      console.log()
      return {
        ...state,
        listenersAddition: {
          ...state.listenersAddition,
          options: [],
          list: state.listenersAddition.list
            .map((user) => {
              return user
            })
            .concat(action.payload),
        },
      }
    case 'COURSES_REMOVE_LISTENER_FROM_LIST':
      return {
        ...state,
        listenersAddition: {
          ...state.listenersAddition,
          list: state.listenersAddition.list.filter(
            (user) => user.id !== action.payload
          ),
        },
      }
    case 'COURSES_CLEAR_ADDITION_LISTENERS':
      return {
        ...state,
        listenersAddition: {
          ...state.listenersAddition,
          options: [],
          list: [],
        },
      }
    default:
      return state
  }
}

export const requestCourses = (page: number, count: number, filters: IFilters): ThunkAction<Promise<void>, AppStateType, unknown, coursesActionsTypes> => {
  return async (dispatch) => {
    dispatch(loaderActions.setLoading())
    const response = await coursesAPI.getCoursesList(page, count, filters)

    if (response.data.response) {
      dispatch(
        actions.coursesLoadingSuccess({
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
}

export const changeListParams = (page: number, count: number, filters: IFilters): ThunkAction<Promise<void>, AppStateType, unknown, coursesActionsTypes> => {
  return async (dispatch) => {
    dispatch(loaderActions.setLoading())
    const response = await coursesAPI.getCoursesList(page, count, filters)

    if (response.data.response) {
      dispatch(
        actions.coursesLoadingSuccess({
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
}

export const createRequest = (course: ISelectedCourse): ThunkAction<Promise<void>, AppStateType, unknown, coursesActionsTypes> => {
  return async (dispatch) => {
    dispatch(loaderActions.setLoading())
    const response = await requestsAPI.createRequest(course.ID)
    const users = response.data.users

    if (response.data.response) {
      dispatch(actions.changeRequestStatus({ courseID: course.ID, users }))
      dispatch(
        snackbarActions.showSuccess(
          `Подана заявка на обучение по программе «${course.Name}»`
        )
      )
      dispatch(loaderActions.loadingSuccess())
    } else dispatch(snackbarActions.showError(response.data.error))
  }
}

export const cancelRequest = (course: ISelectedCourse, requestID: number): ThunkAction<Promise<void>, AppStateType, unknown, coursesActionsTypes> => {
  return async (dispatch) => {
    const message = `Заявка на обучение по программе «${course.Name}» отменена`

    dispatch(loaderActions.setLoading())
    const response = await requestsAPI.cancelRequest(requestID)
    const users = response.data.users

    if (response.data.response) {
      dispatch(actions.changeRequestStatus({ courseID: course.ID, users, requestID }))
      dispatch(snackbarActions.showSuccess(message))
      dispatch(loaderActions.loadingSuccess())
    } else dispatch(snackbarActions.showError(response.data.error))
  }
}

export const createListenersRequests = (courseID: number, users: Array<ICourseUser>): ThunkAction<Promise<void>, AppStateType, unknown, coursesActionsTypes> => {
  return async (dispatch) => {
    dispatch(loaderActions.setLoading())
    const response = await coursesAPI.createListenersRequests(courseID, users)

    if (response.data.response) {
      dispatch(
        actions.changeRequestStatus({
          courseID,
          users: response.data.users,
        })
      )
      dispatch(snackbarActions.showSuccess('Слушатели добавлены на курс'))
      dispatch(loaderActions.loadingSuccess())
    } else dispatch(snackbarActions.showError(response.data.error))
  }
}

export const removeRequestUser = (courseID: number, rowID: number): ThunkAction<Promise<void>, AppStateType, unknown, coursesActionsTypes> => {
  return async (dispatch) => {
    const response = await requestsAPI.removeRequestUser(rowID)

    console.log(response.data)

    if (response.data.response) {
      dispatch(
        actions.requestUserRemoved({
          courseID,
          rowID,
          userID: userAPI.getUID(),
        })
      )
      dispatch(snackbarActions.showSuccess('Слушатель удалён из заявки'))
    } else dispatch(snackbarActions.showError(response.data.error))
  }
}

export const getListenerInfo = (userID: number): ThunkAction<Promise<void>, AppStateType, unknown, coursesActionsTypes> => {
  return async (dispatch) => {
    dispatch(actions.setListenerInfoLoading())
    const response = await coursesAPI.getListenerInfo(userID)

    if (response.data.response) {
      dispatch(
        actions.setListenerInfo({
          ...response.data.info,
          documents: response.data.documents,
        })
      )
    } else dispatch(snackbarActions.showError(response.data.error))
  }
}

export const getListenersOptions = (value: string): ThunkAction<Promise<void>, AppStateType, unknown, coursesActionsTypes> => {
  return async (dispatch) => {
    dispatch(actions.setListenersOptionsLoading())

    if (value.length > 5) {
      const response = await coursesAPI.getListenersOptions(value)

      if (response.data.response)
        dispatch(actions.setListenersOptions(response.data.listeners))
      else dispatch(snackbarActions.showError(response.data.error))
    } else {
      dispatch(actions.setListenersOptions([]))
    }
  }
}

export const saveCheckData = (userID: number, rowID: number, data: any): ThunkAction<Promise<void>, AppStateType, unknown, coursesActionsTypes> => {
  console.log(data)
  return async (dispatch) => {
    const simpleDocumentsCheck = data.documents.map((document: IDocument) => {
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
        actions.checkDataSaved({
          ...data,
          currentDatetime: response.data.currentDatetime,
          rowID,
        })
      )
      dispatch(snackbarActions.showSuccess('Изменения сохранены'))
    } else dispatch(snackbarActions.showError(response.data.error))
  }
}

export const addNewListener = (values: INewListener): ThunkAction<Promise<void>, AppStateType, unknown, coursesActionsTypes> => {
  return async (dispatch) => {
    const response = await coursesAPI.addNewListener(values)

    if (response.data.response) {
      dispatch(actions.addListenerToList(response.data.user))
      dispatch(actions.setAdditionDialogOpen(false))
    } else dispatch(snackbarActions.showError(response.data.error))
  }
}

export const actions = {
  setListenerInfoLoading: () => ({
    type: 'COURSE_SET_LISTENER_INFO_LOADING'
  } as const),
  coursesLoadingSuccess: (data: any) => ({
    type: 'COURSES_LOADING_SUCCESS',
    payload: data
  } as const),
  setSelectedCourse: (data: ISelectedCourse) => ({
    type: 'COURSES_SET_SELECTED_COURSE',
    payload: data
  } as const),
  setListenerInfo: (data: IListenerInfo) => ({
    type: 'COURSES_SET_LISTENER_INFO',
    payload: data
  } as const),
  changeRequestStatus: (data: { courseID: number, users: ICourseUser, requestID?: number }) => ({
    type: 'COURSES_CHANGE_REQUEST_STATUS',
    payload: data
  } as const),
  requestUserRemoved: (data: { courseID: number, userID: number, rowID: number }) => ({
    type: 'COURSES_REQUEST_USER_REMOVED',
    payload: data
  } as const),
  checkDataSaved: (data: any) => ({
    type: 'COURSES_CHECK_DATA_SAVED',
    payload: data
  } as const),
  setListenersOptionsLoading: () => ({
    type: 'COURSES_LISTENERS_OPTIONS_LOADING'
  } as const),
  setListenersOptions: (data: Array<{ id: number, username: string | null, fullname: string }>) => ({
    type: 'COURSES_SET_LISTENERS_OPTIONS',
    payload: data
  } as const),
  addListenerToList: (data: IUserOption) => ({
    type: 'COURSES_ADD_LISTENER_TO_LIST',
    payload: data
  } as const),
  setAdditionDialogOpen: (isDialogOpen: boolean) => ({
    type: 'COURSES_SET_ADDITION_DIALOG_OPEN',
    payload: isDialogOpen
  } as const),
  removeListenerFromList: (userID: number) => ({
    type: 'COURSES_REMOVE_LISTENER_FROM_LIST',
    payload: userID
  } as const),
  clearAdditionListeners: () => ({
    type: 'COURSES_CLEAR_ADDITION_LISTENERS'
  } as const),
  ...snackbarActions,
  ...loaderActions
}
