import { InferActionsType } from './index'

interface IState {
  isLoading: boolean
}

const initialState: IState = {
  isLoading: false,
}

type loaderActionsTypes = InferActionsType<typeof actions>

export const loaderReducer = (state = initialState, action: loaderActionsTypes): IState => {
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

export const actions = {
  setLoading: () => ({
    type: 'LOADER_REQUEST_LOADING'
  } as const),
  loadingSuccess: () => ({
    type: 'LOADER_LOADING_SUCCESS'
  } as const),
}
