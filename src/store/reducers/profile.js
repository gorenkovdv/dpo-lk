const initialState = {
  list: {},
  isLoading: false,
}

export function profileReducer(state = initialState, action) {
  switch (action.type) {
    case 'PROFILE_INFO_LOAD_REQUEST':
      return {
        ...state,
        isLoading: true,
      }
    case 'PROFILE_INFO_LOAD_SUCCESS':
      return {
        ...state,
        list: action.payload,
        isLoading: false,
      }
    case 'PROFILE_INFO_UPDATE_SUCCESS':
      return{
        ...state,
        list: action.payload,
      }
    default:
      return state
  }
}
