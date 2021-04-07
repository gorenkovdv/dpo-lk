import { AppStateType } from '../reducers'

export const getSnackbarParams = (state: AppStateType) => state.snackbar

export const getConfirmDialogParams = (state: AppStateType) => state.confirmDialog