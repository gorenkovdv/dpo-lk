import { AppStateType } from '../reducers'

export const getSnackbarParams = (state: AppStateType) => {
    return state.snackbar
}

export const getConfirmDialogParams = (state: AppStateType) => {
    return state.confirmDialog
}