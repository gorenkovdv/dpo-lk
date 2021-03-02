import * as moment from 'moment'

const startDate = moment().add(-60, 'day').format('YYYY-MM-DD')
const minStartDate = moment()
  .startOf('year')
  .add(-1, 'year')
  .format('YYYY-MM-DD')

const initialState = {
  list: {},
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
  volumeList: {},
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

export function coursesReducer(state = initialState, action) {
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
          if (parseInt(course.ID) === parseInt(action.payload.courseID)) {
            return {
              ...course,
              users: action.payload.requestID
                ? state.list[index].users.filter(
                  (user) =>
                    parseInt(user.requestID) !==
                    parseInt(action.payload.requestID)
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
          if (parseInt(course.ID) === parseInt(action.payload.courseID)) {
            return {
              ...course,
              users: state.list[index].users.filter(
                (user) =>
                  parseInt(user.rowID) !== parseInt(action.payload.rowID)
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
                course.ID !== state.selectedCourse.ID ||
                user.rowID !== action.payload.rowID
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

            if (state.selectedCourse)
              state.list
                .find((item) => item.ID === state.selectedCourse.ID)
                .users.map((addedUser) => {
                  if (addedUser.id === user.id) isUserAdded = true
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
