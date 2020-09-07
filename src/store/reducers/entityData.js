const initialState = {
  list: {},
}

export function entityDataReducer(state = initialState, action) {
  switch (action.type) {
    case 'ENTITY_DATA_LOAD_SUCCESS':
      return {
        ...state,
        list: action.payload,
      }
    case 'ENTITY_DATA_UPDATE_SUCCESS':
      return {
        ...state,
        list: action.payload,
      }
    case 'ENTITY_ROOTS_CONFIRMED':
      return {
        ...state,
        entities: action.payload,
      }
    default:
      return state
  }
}
