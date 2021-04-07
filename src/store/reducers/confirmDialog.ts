import { InferActionsType } from './index'

interface IStateParams {
  title: string,
  text: string,
  onApprove?: () => void
}

interface IState extends IStateParams {
  open: boolean,
  disabled: boolean,
}

const initialState: IState = {
  open: false,
  disabled: true,
  title: '',
  text: ''
}

type confirmDialogActionsTypes = InferActionsType<typeof actions>

export const confirmDialogReducer = (state = initialState, action: confirmDialogActionsTypes): IState => {
  switch (action.type) {
    case 'dpo-lk/confirmDialog/SHOW':
      return {
        open: true,
        disabled: false,
        ...action.payload,
      }
    case 'dpo-lk/confirmDialog/CLOSE':
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
    type: 'dpo-lk/confirmDialog/SHOW', payload: params
  } as const),
  confirmDialogClose: () => ({
    type: 'dpo-lk/confirmDialog/CLOSE'
  } as const)
}
