import { ThunkAction } from 'redux-thunk'
import { AppStateType, InferActionsType } from './index'
import { actions as loaderActions } from './loader'
import { actions as snackbarActions } from './snackbar'
import { profileAPI } from '../../services/api'

interface IState {
  list: IProfileStateList
}

interface IProfileStateList {
  lastname: string
  firstname: string
  middlename: string
  birthdate: string
  snils: string
  phone: string
  email: string
}

const initialState: IState = {
  list: {
    lastname: '',
    firstname: '',
    middlename: '',
    birthdate: '',
    snils: '',
    phone: '',
    email: ''
  },
}

type profileActionsTypes = InferActionsType<typeof actions>

export const profileReducer = (state = initialState, action: profileActionsTypes): IState => {
  switch (action.type) {
    case 'PROFILE_INFO_UPDATE_SUCCESS':
      return {
        ...state,
        list: action.payload,
      }
    default:
      return state
  }
}

export const requestProfile = (): ThunkAction<Promise<void>, AppStateType, unknown, profileActionsTypes> => {
  return async (dispatch) => {
    dispatch(loaderActions.setLoading())
    const response = await profileAPI.getProfile()

    //console.log(response.data)

    if (response.data.response) {
      dispatch(actions.updatingSuccess(response.data.profile))
      dispatch(loaderActions.loadingSuccess())
    } else dispatch(snackbarActions.showError(response.data.error))
  }
}

export const updateProfile = (data: IProfileStateList): ThunkAction<Promise<void>, AppStateType, unknown, profileActionsTypes> => {
  return async (dispatch) => {
    const response = await profileAPI.setProfile(data)

    //console.log(response.data)

    if (response.data.response) {
      dispatch(actions.updatingSuccess(data))
      dispatch(snackbarActions.showSuccess('Данные успешно обновлены'))
    } else dispatch(snackbarActions.showError(response.data.error))
  }
}

export const actions = {
  updatingSuccess: (data: IProfileStateList) => ({
    type: 'PROFILE_INFO_UPDATE_SUCCESS',
    payload: data
  } as const),
  ...loaderActions,
  ...snackbarActions
}
