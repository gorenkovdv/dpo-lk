import { coursesAPI, requestsAPI, userAPI } from '../../services/api'
import { actions as snackbarActions } from '../reducers/snackbar'
import { actions as loaderActions } from '../reducers/loader'
import { BaseThunkType, InferActionsType } from './index'
import {
  ICourse,
  IDocument,
  IUserOption,
  ICourseUser,
  ICourseRoots,
  ISelectedCourse,
  ICourseFilters
} from '../../types'
import moment from 'moment'


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
  work?: any
}
interface INewListener {
  lastname: string,
  firstname: string,
  middlename: string,
  birthdate: string | null,
  snils: string,
}

export interface IState {
  list: Array<ICourse>
  filters: ICourseFilters
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
  roots: ICourseRoots
}

type coursesActionsTypes = InferActionsType<typeof actions>
type ThunkType = BaseThunkType<coursesActionsTypes>

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
    case 'dpo-lk/courses/SET_LISTENER_INFO_LOADING':
      return {
        ...state,
        listenerInfo: {
          ...state.listenerInfo,
          isListenerInfoLoading: true,
        },
      }
    case 'dpo-lk/courses/SET_SELECTED_COURSE':
      return {
        ...state,
        selectedCourse: action.payload,
      }
    case 'dpo-lk/courses/SET_ADDITION_DIALOG_OPEN':
      return {
        ...state,
        listenersAddition: {
          ...state.listenersAddition,
          isDialogOpen: action.payload,
        },
      }
    case 'dpo-lk/courses/CHANGE_REQUEST_STATUS':
      return {
        ...state,
        list: state.list.map((course, index) => {
          if (course.ID.toString() === action.payload.courseID.toString()) {
            return {
              ...course,
              users: action.payload.requestID
                ? state.list[index].users.filter(
                  (user) =>
                    user.requestID.toString() !==
                    action.payload.requestID?.toString()
                )
                : state.list[index].users.concat(action.payload.users),
            }
          }
          return course
        }),
      }
    case 'dpo-lk/courses/REQUEST_USER_REMOVED':
      return {
        ...state,
        list: state.list.map((course, index) => {
          if (course.ID.toString() === action.payload.courseID.toString()) {
            return {
              ...course,
              users: state.list[index].users.filter(
                (user) => {
                  return user.rowID.toString() !== action.payload.rowID.toString()
                }
              ),
            }
          }
          return course
        }),
      }
    case 'dpo-lk/courses/LOADING_SUCCESS':
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
    case 'dpo-lk/courses/SET_LISTENER_INFO':
      return {
        ...state,
        listenerInfo: {
          ...action.payload,
          isListenerInfoLoading: false,
        },
      }
    case 'dpo-lk/courses/CHECK_DATA_SAVED':
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
    case 'dpo-lk/courses/LISTENERS_OPTIONS_LOADING':
      return {
        ...state,
        listenersAddition: {
          ...state.listenersAddition,
          isLoading: true,
        },
      }
    case 'dpo-lk/courses/SET_LISTENERS_OPTIONS':
      return {
        ...state,
        listenersAddition: {
          ...state.listenersAddition,
          isLoading: false,
          options: action.payload.map((user) => {
            let isUserAdded = false

            state.listenersAddition.list.map((addedUser) => {
              if (addedUser.id.toString() === user.id.toString()) isUserAdded = true
              return null
            })

            state.list
              .filter((item) => state.selectedCourse && item.ID === state.selectedCourse.ID)
              .map((searchingCourse) => {
                searchingCourse.users.map((addedUser) => {
                  if (addedUser.id.toString() === user.id.toString()) isUserAdded = true
                  return null
                })
                return null
              })

            return {
              id: user.id,
              login: user.username.toLowerCase(),
              name: user.fullname,
              isUserAdded,
            }
          }),
        },
      }
    case 'dpo-lk/courses/ADD_LISTENER_TO_LIST':
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
    case 'dpo-lk/courses/REMOVE_LISTENER_FROM_LIST':
      return {
        ...state,
        listenersAddition: {
          ...state.listenersAddition,
          list: state.listenersAddition.list.filter(
            (user) => user.id.toString() !== action.payload.userID.toString()
          ),
        },
      }
    case 'dpo-lk/courses/CLEAR_ADDITION_LISTENERS':
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

export const requestCourses = (page: number, count: number, filters: ICourseFilters): ThunkType => {
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
      dispatch(actions.loadingSuccess())
    } else dispatch(actions.showMessageAction(response.data.error, 'error'))
  }
}

export const changeListParams = (page: number, count: number, filters: ICourseFilters): ThunkType => {
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
      dispatch(actions.loadingSuccess())
    } else dispatch(actions.showMessageAction(response.data.error, 'error'))
  }
}

export const createRequest = (course: ISelectedCourse): ThunkType => {
  return async (dispatch) => {
    dispatch(loaderActions.setLoading())
    const response = await requestsAPI.createRequest(course.ID)
    const users = response.data.users

    if (response.data.response) {
      dispatch(actions.changeRequestStatus({ courseID: course.ID, users }))
      dispatch(
        snackbarActions.showMessageAction(
          `Подана заявка на обучение по программе «${course.Name}»`,
          `success`
        )
      )
      dispatch(loaderActions.loadingSuccess())
    } else dispatch(snackbarActions.showMessageAction(response.data.error, 'error'))
  }
}

export const cancelRequest = (course: ISelectedCourse, requestID: number): ThunkType => {
  return async (dispatch) => {
    const message = `Заявка на обучение по программе «${course.Name}» отменена`

    dispatch(loaderActions.setLoading())
    const response = await requestsAPI.cancelRequest(requestID)
    const users = response.data.users

    if (response.data.response) {
      dispatch(actions.changeRequestStatus({ courseID: course.ID, users, requestID }))
      dispatch(snackbarActions.showMessageAction(message, 'success'))
      dispatch(loaderActions.loadingSuccess())
    } else dispatch(snackbarActions.showMessageAction(response.data.error, 'error'))
  }
}

export const createListenersRequests = (courseID: number, users: Array<number>): ThunkType => {
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
      dispatch(snackbarActions.showMessageAction('Слушатели добавлены на курс', 'success'))
      dispatch(loaderActions.loadingSuccess())
    } else dispatch(snackbarActions.showMessageAction(response.data.error, 'error'))
  }
}

export const removeRequestUser = (courseID: number, rowID: number): ThunkType => {
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
      dispatch(snackbarActions.showMessageAction('Слушатель удалён из заявки', 'success'))
    } else dispatch(snackbarActions.showMessageAction(response.data.error, 'error'))
  }
}

export const getListenerInfo = (userID: number): ThunkType => {
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
    } else dispatch(snackbarActions.showMessageAction(response.data.error, 'error'))
  }
}

export const getListenersOptions = (value: string): ThunkType => {
  return async (dispatch) => {
    dispatch(actions.setListenersOptionsLoading())

    if (value.length > 5) {
      const response = await coursesAPI.getListenersOptions(value)

      if (response.data.response)
        dispatch(actions.setListenersOptions(response.data.listeners))
      else dispatch(snackbarActions.showMessageAction(response.data.error, 'error'))
    } else {
      dispatch(actions.setListenersOptions([]))
    }
  }
}

export const saveCheckData = (userID: number, rowID: number, data: any): ThunkType => {
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
      dispatch(snackbarActions.showMessageAction('Изменения сохранены', 'success'))
    } else dispatch(snackbarActions.showMessageAction(response.data.error, 'error'))
  }
}

export const addNewListener = (values: INewListener): ThunkType => {
  return async (dispatch) => {
    const response = await coursesAPI.addNewListener(values)

    if (response.data.response) {
      dispatch(actions.addListenerToList(response.data.user))
      dispatch(actions.setAdditionDialogOpen(false))
    } else dispatch(snackbarActions.showMessageAction(response.data.error, 'error'))
  }
}

export const actions = {
  setListenerInfoLoading: () => ({
    type: 'dpo-lk/courses/SET_LISTENER_INFO_LOADING'
  } as const),
  coursesLoadingSuccess: (data: any) => ({
    type: 'dpo-lk/courses/LOADING_SUCCESS',
    payload: data
  } as const),
  setSelectedCourse: (data: ISelectedCourse | null) => ({
    type: 'dpo-lk/courses/SET_SELECTED_COURSE',
    payload: data
  } as const),
  setListenerInfo: (data: IListenerInfo) => ({
    type: 'dpo-lk/courses/SET_LISTENER_INFO',
    payload: data
  } as const),
  changeRequestStatus: (data: { courseID: number, users: ICourseUser, requestID?: number }) => ({
    type: 'dpo-lk/courses/CHANGE_REQUEST_STATUS',
    payload: data
  } as const),
  requestUserRemoved: (data: { courseID: number, userID: number, rowID: number }) => ({
    type: 'dpo-lk/courses/REQUEST_USER_REMOVED',
    payload: data
  } as const),
  checkDataSaved: (data: any) => ({
    type: 'dpo-lk/courses/CHECK_DATA_SAVED',
    payload: data
  } as const),
  setListenersOptionsLoading: () => ({
    type: 'dpo-lk/courses/LISTENERS_OPTIONS_LOADING'
  } as const),
  setListenersOptions: (data: Array<{ id: number, username: string, fullname: string }>) => ({
    type: 'dpo-lk/courses/SET_LISTENERS_OPTIONS',
    payload: data
  } as const),
  addListenerToList: (data: IUserOption) => ({
    type: 'dpo-lk/courses/ADD_LISTENER_TO_LIST',
    payload: data
  } as const),
  setAdditionDialogOpen: (isDialogOpen: boolean) => ({
    type: 'dpo-lk/courses/SET_ADDITION_DIALOG_OPEN',
    payload: isDialogOpen
  } as const),
  removeListenerFromList: (userID: number) => ({
    type: 'dpo-lk/courses/REMOVE_LISTENER_FROM_LIST',
    payload: { userID }
  } as const),
  clearAdditionListeners: () => ({
    type: 'dpo-lk/courses/CLEAR_ADDITION_LISTENERS'
  } as const),
  ...snackbarActions,
  ...loaderActions
}
