import { ThunkAction } from 'redux-thunk'
import { AppStateType, InferActionsType } from './index'
import { actions as snackbarActions } from './snackbar'
import { actions as loaderActions } from './loader'
import { authAPI } from '../../services/api'
import { PASSWORD_LENGTH } from '../../store/const'
import history from '../../history'

interface IConfirm {
  reset: boolean,
  showForm: boolean
}

interface IState {
  confirm: IConfirm | null
  changePassword: any
}

const initialState: IState = {
  confirm: null,
  changePassword: null,
}

type authActionsTypes = InferActionsType<typeof actions>

export const authReducer = (state = initialState, action: authActionsTypes): IState => {
  switch (action.type) {
    case 'SET_CONFIRM_PARAMS':
      return {
        ...state,
        confirm: action.payload,
      }
    case 'SET_PASSWORD_PARAMS':
      return {
        ...state,
        changePassword: action.payload,
      }
    case 'CLEAR_CONFIRM_PARAMS':
      return {
        ...state,
        confirm: null,
      }
    case 'CLEAR_PASSWORD_PARAMS':
      return {
        ...state,
        changePassword: null,
      }
    default:
      return state
  }
}

export const actions = {
  setConfirmParams: (params: any) => ({
    type: 'SET_CONFIRM_PARAMS',
    payload: params
  } as const),
  setPasswordParams: (params: any) => ({
    type: 'SET_PASSWORD_PARAMS',
    payload: params
  } as const),
  clearConfirmParams: () => ({
    type: 'CLEAR_CONFIRM_PARAMS'
  } as const),
  clearPasswordParams: () => ({
    type: 'CLEAR_PASSWORD_PARAMS'
  } as const),
  ...snackbarActions,
  ...loaderActions
}

export const checkParams = (id: number, key: string, type: string): ThunkAction<Promise<void>, AppStateType, unknown, authActionsTypes> => {
  return async (dispatch) => {
    dispatch(loaderActions.setLoading())
    let params = {}
    const response = await authAPI.checkParams(id, key)

    console.log(response.data)

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

export const changePassword = (id: number, key: string, password: string, repeat: string): ThunkAction<Promise<void>, AppStateType, unknown, authActionsTypes> => {
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

export const findUser = (value: string): ThunkAction<Promise<void>, AppStateType, unknown, authActionsTypes> => {
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

export const login = (username: string, password: string): ThunkAction<Promise<void>, AppStateType, unknown, authActionsTypes> => {
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

export const logout = (): ThunkAction<Promise<void>, AppStateType, unknown, authActionsTypes> => {
  return async () => {
    await authAPI.logout()

    authAPI.clearData()
    history.push('/auth')
  }
}
