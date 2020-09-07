const initialState = {
  list: {},
}

export function requestsReducer(state = initialState, action) {
  switch (action.type) {
    case 'REQUEST_CANCELED':
      return {
        ...state,
        list: state.list.filter((request) => request.ID !== action.payload),
      }
    case 'REQUESTS_LOADING_SUCCESS':
      return {
        ...state,
        list: action.payload,
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
