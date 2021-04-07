import { InferActionsType } from './index'
import { SeverityType } from '../../types'
interface IState {
  isOpen: boolean
  message: string
  severity: SeverityType
}

const initialState: IState = {
  isOpen: false,
  message: '',
  severity: 'success'
}

type SnackbarActionsTypes = InferActionsType<typeof actions>

export const snackbarReducer = (state = initialState, action: SnackbarActionsTypes): IState => {
  switch (action.type) {
    case 'dpo-lk/snackbar/SHOW_MESSAGE':
      return {
        ...state,
        isOpen: true,
        message: action.payload.message,
        severity: action.payload.severity
      }
    case 'dpo-lk/snackbar/CLOSE_MESSAGE':
      return {
        ...state,
        isOpen: false,
      }
    default:
      return state
  }
}

export const actions = {
  showMessageAction: (message: string, severity: SeverityType) => ({
    type: 'dpo-lk/snackbar/SHOW_MESSAGE',
    payload: { message, severity }
  } as const),
  closeMessageAction: () => ({
    type: 'dpo-lk/snackbar/CLOSE_MESSAGE'
  } as const)
}