import { ThunkAction } from 'redux-thunk'
import { ICourseBasic } from '../../types'
import { AppStateType, InferActionsType } from './index'
import { requestsAPI } from '../../services/api'
import { actions as snackbarActions } from './snackbar'
import { actions as loaderActions } from './loader'

interface IRequest extends ICourseBasic {
  DocumentsApproved: number
  RequestCreateDate: string
  RequestCME: string | null
  requestID: number
  rowID: number
}

interface IState {
  list: Array<IRequest>
  selectedRequest: ISelectedRequest | null
}

interface ISelectedRequest {
  ID: number,
  Price: number,
  rowID: number,
  DocumentsApproved: number,
  courseName: string
}

type requestsActionsTypes = InferActionsType<typeof actions>

const initialState: IState = {
  list: [],
  selectedRequest: null,
}

export const requestsReducer = (state = initialState, action: requestsActionsTypes): IState => {
  switch (action.type) {
    case 'REQUEST_CANCELED':
      return {
        ...state,
        list: state.list.filter(
          (request) => request.requestID !== action.payload
        ),
      }
    case 'REQUESTS_LOADING_SUCCESS':
      return {
        ...state,
        list: action.payload,
      }
    case 'REQUESTS_CME_REQUEST_UPDATE':
      console.log(action)
      return {
        ...state,
        list: state.list.map((request) => {
          if (request.rowID !== action.payload.rowID) return request

          return {
            ...request,
            RequestCME: JSON.stringify([
              action.payload.speciality,
              action.payload.number,
            ]),
          }
        }),
      }
    case 'REQUESTS_SET_SELECTED_REQUEST':
      console.log(action)
      return {
        ...state,
        selectedRequest: action.payload,
      }
    case 'REQUESTS_DOCUMENTS_APPROVE':
      console.log(action)
      return {
        ...state,
        list: state.list.map((request) => {
          if (
            request.requestID === action.payload.requestID
          )
            return { ...request, DocumentsApproved: action.payload.status }
          return request
        }),
      }
    default:
      return state
  }
}

export const getRequests = (): ThunkAction<Promise<void>, AppStateType, unknown, requestsActionsTypes> => {
  return async (dispatch) => {
    dispatch(actions.setLoading())

    const response = await requestsAPI.getRequests()

    if (response.data.response) {
      dispatch(actions.requestsLoadingSuccess(response.data.requests))
      dispatch(actions.loadingSuccess())
    } else dispatch(snackbarActions.showError(response.data.error))
  }
}

export const cancelRequest = (request: ISelectedRequest): ThunkAction<Promise<void>, AppStateType, unknown, requestsActionsTypes> => {
  return async (dispatch) => {
    dispatch(actions.setLoading())

    const response = await requestsAPI.cancelRequest(request.ID)

    if (response.data.response) {
      dispatch(actions.requestCanceled(request.ID))
      dispatch(
        snackbarActions.showSuccess(
          `Заявка на обучение по программе «${request.courseName}» отменена`
        )
      )
      dispatch(loaderActions.loadingSuccess())
    } else dispatch(snackbarActions.showError(response.data.error))
  }
}

export const updateCMERequest = (data: { speciality: string, number: string, rowID: number }): ThunkAction<Promise<void>, AppStateType, unknown, requestsActionsTypes> => {
  return async (dispatch) => {
    const response = await requestsAPI.updateCMERequest(data)

    if (response.data.response) dispatch(actions.CMERequestUpdated(data))
    else dispatch(actions.showError(response.data.error))
  }
}

export const setDocumentsApprove = (requestID: number, status: number): ThunkAction<Promise<void>, AppStateType, unknown, requestsActionsTypes> => {
  return async (dispatch) => {
    dispatch(loaderActions.setLoading())
    const response = await requestsAPI.setDocumentsApprove(requestID, status)

    if (response.data.response) {
      dispatch(actions.documentsApprove({ requestID, status }))
      dispatch(actions.loadingSuccess())
    } else dispatch(actions.showError(response.data.error))
  }
}

export const actions = {
  requestsLoadingSuccess: (data: Array<IRequest>) => ({
    type: 'REQUESTS_LOADING_SUCCESS',
    payload: data
  } as const),
  requestCanceled: (courseID: number) => ({
    type: 'REQUEST_CANCELED',
    payload: courseID
  } as const),
  CMERequestUpdated: (data: { speciality: string, number: string, rowID: number }) => ({
    type: 'REQUESTS_CME_REQUEST_UPDATE',
    payload: data
  } as const),
  setSelectedRequest: (request: ISelectedRequest) => ({
    type: 'REQUESTS_SET_SELECTED_REQUEST',
    payload: request
  } as const),
  documentsApprove: (data: { requestID: number, status: number }) => ({
    type: 'REQUESTS_DOCUMENTS_APPROVE',
    payload: data
  } as const),
  ...loaderActions,
  ...snackbarActions
}
