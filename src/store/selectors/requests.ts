import { AppStateType } from '../reducers'

export const getRequestsList = (state: AppStateType) => {
    return state.requests.list
}

export const getSelectedRequest = (state: AppStateType) => {
    return state.requests.selectedRequest
}