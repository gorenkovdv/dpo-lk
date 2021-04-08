import { BaseThunkType, InferActionsType } from './index'
import { actions as snackbarActions } from './snackbar'
import { actions as loaderActions } from './loader'
import { authAPI } from '../../services/api'
import { PASSWORD_LENGTH } from '../../store/const'
import history from '../../history'

interface IChangePassword {
  showForm: boolean
  reset: boolean
}

interface IConfirm {
  error: string
  response: number
  login: string | null
  reset: boolean
}
interface IState {
  confirm: IConfirm | null
  changePassword: IChangePassword | null
}

const initialState: IState = {
  confirm: null,
  changePassword: null,
}

type authActionsTypes = InferActionsType<typeof actions>
type ThunkType = BaseThunkType<authActionsTypes>

export const authReducer = (state = initialState, action: authActionsTypes): IState => {
  switch (action.type) {
    case 'dpo-lk/auth/SET_CONFIRM_PARAMS':
      return {
        ...state,
        confirm: action.payload,
      }
    case 'dpo-lk/auth/SET_PASSWORD_PARAMS':
      return {
        ...state,
        changePassword: action.payload,
      }
    case 'dpo-lk/auth/CLEAR_CONFIRM_PARAMS':
      return {
        ...state,
        confirm: null,
      }
    case 'dpo-lk/auth/CLEAR_PASSWORD_PARAMS':
      return {
        ...state,
        changePassword: null,
      }
    default:
      return state
  }
}

export const actions = {
  setConfirmParams: (params: IConfirm) => ({
    type: 'dpo-lk/auth/SET_CONFIRM_PARAMS',
    payload: params
  } as const),
  setPasswordParams: (params: IChangePassword) => ({
    type: 'dpo-lk/auth/SET_PASSWORD_PARAMS',
    payload: params
  } as const),
  clearConfirmParams: () => ({
    type: 'dpo-lk/auth/CLEAR_CONFIRM_PARAMS'
  } as const),
  clearPasswordParams: () => ({
    type: 'dpo-lk/auth/CLEAR_PASSWORD_PARAMS'
  } as const),
  ...snackbarActions,
  ...loaderActions
}

export const checkParams = (id: string, key: string, type: string): ThunkType => {
  return async (dispatch) => {
    dispatch(loaderActions.setLoading())
    let params = null
    const response = await authAPI.checkParams(id, key)

    if (response.data.response) dispatch(loaderActions.loadingSuccess())

    switch (type) {
      case 'confirm':
        params = {
          error: response.data.error,
          response: response.data.response,
          login: response.data.login,
          reset: response.data.reset ? true : false,
        }

        dispatch(actions.setConfirmParams(params))
        break
      case 'changePassword':
        params = {
          reset: response.data.reset ? true : false,
          showForm: response.data.response ? true : false,
        }

        dispatch(actions.setPasswordParams(params))
        break
      default:
        break
    }
  }
}

export const changePassword = (id: string, key: string, password: string, repeat: string): ThunkType => {
  return async (dispatch) => {
    if (password.length >= PASSWORD_LENGTH && repeat.length >= PASSWORD_LENGTH) {
      if (password === repeat) {
        const response = await authAPI.changePassword(id, key, password)

        if (response.data.response && sessionStorage.token) {
          authAPI.setToken({
            ...JSON.parse(sessionStorage.token),
            isPasswordSet: true,
          })

          dispatch(actions.clearPasswordParams())
          history.push('/')
        } else {
          dispatch(actions.setPasswordParams({ reset: false, showForm: true }))

          if (response.data.response)
            dispatch(snackbarActions.showMessageAction('Пароль успешно изменен', 'success'))
          else dispatch(snackbarActions.showMessageAction(response.data.error, 'error'))
        }
      } else dispatch(snackbarActions.showMessageAction('Пароли должны совпадать', 'error'))
    } else
      dispatch(
        snackbarActions.showMessageAction(
          `Пароль должен содержать как минимум ${PASSWORD_LENGTH} символов`,
          `error`
        )
      )
  }
}

export const findUser = (value: string): ThunkType => {
  return async (dispatch) => {
    const response = await authAPI.findUser(value)

    if (response.data.response)
      dispatch(
        snackbarActions.showMessageAction(
          `Информация выслана на электронную почту ${response.data.email}`,
          `success`
        )
      )
    else dispatch(snackbarActions.showMessageAction(response.data.error, 'error'))
  }
}

export const login = (username: string, password: string): ThunkType => {
  return async (dispatch) => {
    const response = await authAPI.login(username, password)

    if (response.data.response) {
      authAPI.setData(response.data)
      if (response.data.token.isPasswordSet) history.replace('/')
      else
        history.replace(
          `/changepassword/${response.data.uid}/${response.data.token.key}`
        )
    } else dispatch(snackbarActions.showMessageAction(response.data.error, 'error'))
  }
}

export const logout = (): ThunkType => {
  return async () => {
    await authAPI.logout()

    authAPI.clearData()
    history.push('/auth')
  }
}
