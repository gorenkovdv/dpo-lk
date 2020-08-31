const initialState = {
  list: {},
  isLoading: false,
}

export function requestsReducer(state = initialState, action) {
  switch (action.type) {
    case 'REQUESTS_SET_LOADING':
      return {
        ...state,
        isLoading: true,
      }
    case 'REQUEST_CANCELED':
      return {
        ...state,
        list: state.list.filter((request) => request.ID !== action.payload),
        isLoading: false,
      }
    case 'REQUESTS_LOADING_SUCCESS':
      return {
        ...state,
        list: action.payload,
        isLoading: false,
      }
    case 'REQUESTS_CME_REQUEST_UPDATE':
      return {
        ...state,
        list: state.list.map((request) => {
          if (request.rowID !== action.payload.rowID) return request

          return {
            ...request,
            RequestCME: JSON.stringify([
              action.payload.speciality,
              action.payload.number,
            ]),
          }
        }),
      }
    default:
      return state
  }
}
