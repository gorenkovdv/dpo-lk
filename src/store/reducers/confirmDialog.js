const initialState = {
  open: false,
  disabled: true,
}

export function confirmDialogReducer(state = initialState, action) {
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
