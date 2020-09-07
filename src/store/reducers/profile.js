const initialState = {
  list: {},
}

export function profileReducer(state = initialState, action) {
  switch (action.type) {
    case 'PROFILE_INFO_LOAD_REQUEST':
      return {
        ...state,
      }
    case 'PROFILE_INFO_UPDATE_SUCCESS':
      return {
        ...state,
        list: action.payload,
      }
    default:
      return state
  }
}
