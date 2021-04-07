import { AppStateType } from '../reducers'

export const getConfirm = (state: AppStateType) => state.auth.confirm

export const getChangePasswordParams = (state: AppStateType) => state.auth.changePassword