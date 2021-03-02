import { InferActionsType } from './index'

interface IState {
  open: Boolean
  message: string
  severity: string
}

const initialState: IState = {
  open: false,
  message: '',
  severity: 'error'
}

type SnackbarActionsTypes = InferActionsType<typeof actions>

export function snackbarReducer(state = initialState, action: SnackbarActionsTypes): IState {
  switch (action.type) {
    case 'SNACKBAR_SHOW_SUCCESS_MESSAGE':
      return {
        ...state,
        open: true,
        message: action.payload,
        severity: 'success'
      }
    case 'SNACKBAR_CLEAR':
      return {
        ...state,
        open: false,
      }
    case 'SNACKBAR_SHOW_ERROR_MESSAGE':
      return {
        ...state,
        open: true,
        message: action.payload,
        severity: 'error'
      }
    default:
      return state
  }
}

export const actions = {
  showSuccess: (message: string) => ({
    type: 'SNACKBAR_SHOW_SUCCESS_MESSAGE',
    payload: message
  } as const),
  showError: (error: string) => ({
    type: 'SNACKBAR_SHOW_ERROR_MESSAGE',
    payload: error
  } as const),
  clearSnackbar: () => ({
    type: 'SNACKBAR_CLEAR'
  } as const)
}