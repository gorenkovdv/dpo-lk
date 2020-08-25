import * as moment from 'moment'

const initialState = {
  list: {},
  filters: {
    searchString: '',
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
  },
  volumeList: {},
  isLoading: false,
  isPageLoading: false,
  totalCount: 0,
  pageSize: 5,
  currentPage: 1,
  rootGroup: null,
  rootCathedra: null,
  listenerInfo: {},
  isListenerInfoLoading: false,
  selectedCourse: null,
}

export function coursesReducer(state = initialState, action) {
  switch (action.type) {
    case 'COURSES_SET_LOADING':
      return {
        ...state,
        isLoading: true,
      }
    case 'COURSES_SET_PAGE_LOADING':
      return {
        ...state,
        isPageLoading: true,
      }
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
    case 'COURSE_CHANGE_REQUEST_STATUS':
      return {
        ...state,
        isPageLoading: false,
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
    case 'COURSE_REQUEST_REMOVED':
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
        rootGroup: action.payload.rootGroup,
        rootCathedra: action.payload.rootCathedra,
        isLoading: false,
        isPageLoading: false,
      }
    case 'COURSE_SET_LISTENER_INFO':
      return {
        ...state,
        listenerInfo: {
          ...action.payload,
          isListenerInfoLoading: false,
        },
      }
    case 'COURSE_CHECK_DATA_SAVED':
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
    default:
      return state
  }
}
