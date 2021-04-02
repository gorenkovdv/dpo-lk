import { BaseThunkType, InferActionsType } from './index'
import { actions as loaderActions } from './loader'
import { actions as snackbarActions } from './snackbar'
import { profileAPI } from '../../services/api'

export interface IState {
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
type ThunkType = BaseThunkType<profileActionsTypes>

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

export const requestProfile = (): ThunkType => async (dispatch) => {
  dispatch(actions.setLoading())
  const response = await profileAPI.getProfile()

  if (response.data.response) {
    dispatch(actions.updatingSuccess(response.data.profile))
    dispatch(actions.loadingSuccess())
  } else dispatch(actions.showMessageAction(response.data.error, 'error'))
}

export const updateProfile = (data: IProfileStateList): ThunkType => {
  return async (dispatch) => {
    const response = await profileAPI.setProfile(data)

    if (response.data.response) {
      dispatch(actions.updatingSuccess(data))
      dispatch(actions.showMessageAction('Данные успешно обновлены', 'success'))
    } else dispatch(actions.showMessageAction(response.data.error, 'error'))
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
