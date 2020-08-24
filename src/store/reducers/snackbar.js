const initialState = {
    open: false,
    message: '',
    severity: 'error'
}

export function snackbarReducer(state = initialState, action) {
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
        return{
          ...state,
          open: true,
          message: action.payload,
          severity: 'error'
        }
      default:
        return state
    }
  }