const initialState = {
  list: {},
  selectedRequest: null,
}

export function requestsReducer(state = initialState, action) {
  switch (action.type) {
    case 'REQUEST_CANCELED':
      return {
        ...state,
        list: state.list.filter(
          (request) => request.requestID !== action.payload
        ),
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
    case 'REQUESTS_SET_SELECTED_REQUEST':
      return {
        ...state,
        selectedRequest: action.payload,
      }
    case 'REQUESTS_DOCUMENTS_APPROVE':
      return {
        ...state,
        list: state.list.map((request) => {
          if (
            parseInt(request.requestID) === parseInt(action.payload.requestID)
          )
            return { ...request, DocumentsApproved: action.payload.status }
          return request
        }),
      }
    default:
      return state
  }
}
