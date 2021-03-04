import { InferActionsType } from './index'

interface IStateParams {
  title: string,
  text: string,
  onApprove: (() => (params: any) => void) | null
}

interface IState extends IStateParams {
  open: boolean,
  disabled: boolean,
}

const initialState: IState = {
  open: false,
  disabled: true,
  title: '',
  text: '',
  onApprove: null,
}

type confirmDialogActionsTypes = InferActionsType<typeof actions>

export const confirmDialogReducer = (state = initialState, action: confirmDialogActionsTypes): IState => {
  switch (action.type) {
    case 'CONFIRM_DIALOG_SHOW':
      return {
        open: true,
        disabled: false,
        ...action.payload,
      }
    case 'CONFIRM_DIALOG_CLOSE':
      return {
        ...state,
        open: false,
        disabled: true,
      }
    default:
      return state
  }
}

export const actions = {
  confirmDialogShow: (params: IStateParams) => ({
    type: 'CONFIRM_DIALOG_SHOW', payload: params
  } as const),
  confirmDialogClose: () => ({
    type: 'CONFIRM_DIALOG_CLOSE'
  } as const)
}
