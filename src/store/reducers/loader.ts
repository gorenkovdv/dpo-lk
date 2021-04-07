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
    case 'dpo-lk/loader/REQUEST_LOADING':
      return {
        ...state,
        isLoading: true,
      }
    case 'dpo-lk/loader/LOADING_SUCCESS':
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
    type: 'dpo-lk/loader/REQUEST_LOADING'
  } as const),
  loadingSuccess: () => ({
    type: 'dpo-lk/loader/LOADING_SUCCESS'
  } as const),
}
