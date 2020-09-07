const initialState = {
  isLoading: false,
}

export function loaderReducer(state = initialState, action) {
  switch (action.type) {
    case 'LOADER_REQUEST_LOADING':
      return {
        ...state,
        isLoading: true,
      }
    case 'LOADER_LOADING_SUCCESS':
      return {
        ...state,
        isLoading: false,
      }
    default:
      return state
  }
}
