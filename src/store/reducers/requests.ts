import { ISelectedRequest, IRequest } from '../../types'
import { BaseThunkType, InferActionsType } from './index'
import { requestsAPI } from '../../services/api'
import { actions as snackbarActions } from './snackbar'
import { actions as loaderActions } from './loader'
interface IState {
  list: Array<IRequest>
  selectedRequest: ISelectedRequest | null
}

type requestsActionsTypes = InferActionsType<typeof actions>
type ThunkType = BaseThunkType<requestsActionsTypes>

const initialState: IState = {
  list: [],
  selectedRequest: null,
}

export const requestsReducer = (state = initialState, action: requestsActionsTypes): IState => {
  switch (action.type) {
    case 'dpo-lk/requests/CANCELED':
      return {
        ...state,
        list: state.list.filter(
          (request) => request.requestID !== action.payload
        ),
      }
    case 'dpo-lk/requests/LOADING_SUCCESS':
      return {
        ...state,
        list: action.payload,
      }
    case 'dpo-lk/requests/CME_REQUEST_UPDATE':
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
    case 'dpo-lk/requests/SET_SELECTED_REQUEST':
      console.log(action)
      return {
        ...state,
        selectedRequest: action.payload,
      }
    case 'dpo-lk/requests/DOCUMENTS_APPROVE':
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

export const getRequests = (): ThunkType => {
  return async (dispatch) => {
    dispatch(actions.setLoading())

    const response = await requestsAPI.getRequests()

    if (response.data.response) {
      dispatch(actions.requestsLoadingSuccess(response.data.requests))
      dispatch(actions.loadingSuccess())
    } else dispatch(snackbarActions.showMessageAction(response.data.error, 'error'))
  }
}

export const cancelRequest = (request: ISelectedRequest): ThunkType => {
  return async (dispatch) => {
    dispatch(actions.setLoading())

    const response = await requestsAPI.cancelRequest(request.ID)

    if (response.data.response) {
      dispatch(actions.requestCanceled(request.ID))
      dispatch(
        snackbarActions.showMessageAction(
          `Заявка на обучение по программе «${request.courseName}» отменена`,
          `success`
        )
      )
      dispatch(loaderActions.loadingSuccess())
    } else dispatch(snackbarActions.showMessageAction(response.data.error, 'error'))
  }
}

export const updateCMERequest = (data: { speciality: string, number: string, rowID: number }): ThunkType => {
  return async (dispatch) => {
    const response = await requestsAPI.updateCMERequest(data)

    if (response.data.response) dispatch(actions.CMERequestUpdated(data))
    else dispatch(actions.showMessageAction(response.data.error, 'error'))
  }
}

export const setDocumentsApprove = (requestID: number, status: number): ThunkType => {
  return async (dispatch) => {
    dispatch(loaderActions.setLoading())
    const response = await requestsAPI.setDocumentsApprove(requestID, status)

    if (response.data.response) {
      dispatch(actions.documentsApprove({ requestID, status }))
      dispatch(actions.loadingSuccess())
    } else dispatch(actions.showMessageAction(response.data.error, 'error'))
  }
}

export const actions = {
  requestsLoadingSuccess: (data: Array<IRequest>) => ({
    type: 'dpo-lk/requests/LOADING_SUCCESS',
    payload: data
  } as const),
  requestCanceled: (courseID: number) => ({
    type: 'dpo-lk/requests/CANCELED',
    payload: courseID
  } as const),
  CMERequestUpdated: (data: { speciality: string, number: string, rowID: number }) => ({
    type: 'dpo-lk/requests/CME_REQUEST_UPDATE',
    payload: data
  } as const),
  setSelectedRequest: (request: ISelectedRequest) => ({
    type: 'dpo-lk/requests/SET_SELECTED_REQUEST',
    payload: request
  } as const),
  documentsApprove: (data: { requestID: number, status: number }) => ({
    type: 'dpo-lk/requests/DOCUMENTS_APPROVE',
    payload: data
  } as const),
  ...loaderActions,
  ...snackbarActions
}
