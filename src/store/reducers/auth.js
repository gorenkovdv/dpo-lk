const initialState = {
  confirm: null,
  changePassword: null,
}

export function authReducer(state = initialState, action) {
  switch (action.type) {
    case 'SET_CONFIRM_PARAMS':
      return {
        ...state,
        confirm: action.payload,
      }
    case 'SET_PASSWORD_PARAMS':
      return {
        ...state,
        changePassword: action.payload,
      }
    case 'CLEAR_CONFIRM_PARAMS':
      return {
        ...state,
        confirm: null,
      }
    case 'CLEAR_PASSWORD_PARAMS':
      return {
        ...state,
        changePassword: null,
      }
    default:
      return state
  }
}
