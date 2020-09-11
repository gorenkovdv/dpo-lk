import * as moment from 'moment'

const initialState = {
  list: {},
  filters: {
    searchString: 'общая физиотерапия',
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
    startDate: moment().add(-60, 'day').format('YYYY-MM-DD'),
    endDate: moment().add(2, 'years').format('YYYY-MM-DD'),
    minStartDate: moment().startOf('year').format('YYYY-MM-DD'),
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
    case 'COURSES_CHANGE_REQUEST_STATUS':
      return {
        ...state,
        list: state.list.map((course, index) => {
          if (course.ID === action.payload.course) {
            return {
              ...course,
              users: action.payload.haveRequest
                ? state.list[index].users.concat(action.payload.users)
                : state.list[index].users.filter(
                    (user) => user.id !== action.payload.uid
                  ),
              haveRequest: action.payload.haveRequest,
            }
          }
          return course
        }),
      }
    case 'COURSES_REQUEST_REMOVED':
      return {
        ...state,
        list: state.list.map((course, index) => {
          if (course.ID === action.payload.courseID) {
            return {
              ...course,
              users: state.list[index].users.filter(
                (user) => user.id !== action.payload.userID
              ),
              haveRequest: action.payload.isUserAuthorized
                ? 0
                : state.list[index].haveRequest,
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

            return {
              id: user.id,
              name: user.fullname,
              isUserAdded,
            }
          }),
        },
      }
    case 'COURSES_ADD_LISTENER_TO_LIST':
      return {
        ...state,
        listenersAddition: {
          ...state.listenersAddition,
          list: state.listenersAddition.list
            .map((user) => {
              return user
            })
            .concat(action.payload),
        },
      }
    default:
      return state
  }
}
