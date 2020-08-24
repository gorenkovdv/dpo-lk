import { authAPI } from '../../services/api'
import snackbarActions from './snackbarActions'
import { PASSWORD_LENGTH } from '../../store/const.js'
import history from '../../history'

const setConfirmParams = (params) => {
  return { type: 'SET_CONFIRM_PARAMS', payload: params }
}
const setPasswordParams = (params) => {
  return { type: 'SET_PASSWORD_PARAMS', payload: params }
}
const clearConfirmParams = () => {
  return { type: 'CLEAR_CONFIRM_PARAMS' }
}
const clearPasswordParams = () => {
  return { type: 'CLEAR_PASSWORD_PARAMS' }
}

const checkParams = (id, key, type) => async (dispatch) => {
  let params = {}
  const response = await authAPI.checkParams(id, key)

  switch (type) {
    case 'confirm':
      params = {
        error: response.data.error,
        response: response.data.response,
        login: response.data.login,
        reset: response.data.reset,
      }

      dispatch(setConfirmParams(params))
      break
    case 'changePassword':
      params = {
        reset: response.data.reset,
        showForm: response.data.response ? true : false,
      }

      dispatch(setPasswordParams(params))
      break
    default:
      break
  }
}

const changePassword = (id, key, password, repeat) => async (dispatch) => {
  if (password.length >= PASSWORD_LENGTH && repeat.length >= PASSWORD_LENGTH) {
    if (password === repeat) {
      const response = await authAPI.changePassword(id, key, password)

      if (response.data.response && sessionStorage.token) {
        authAPI.setToken({
          ...JSON.parse(sessionStorage.token),
          isPasswordSet: 1,
        })

        dispatch(clearPasswordParams())
        history.push('/')
      } else {
        dispatch(setPasswordParams({ reset: 0, showForm: true }))

        if (response.data.response)
          dispatch(snackbarActions.showSuccess('Пароль успешно изменен'))
        else dispatch(snackbarActions.showError(response.data.error))
      }
    } else dispatch(snackbarActions.showError('Пароли должны совпадать'))
  } else
    dispatch(
      snackbarActions.showError(
        `Пароль должен содержать как минимум ${PASSWORD_LENGTH} символов`
      )
    )
}

const findUser = (value) => async (dispatch) => {
  const response = await authAPI.findUser(value)

  if (response.data.response)
    dispatch(
      snackbarActions.showSuccess(
        `Информация выслана на электронную почту ${response.data.email}`
      )
    )
  else dispatch(snackbarActions.showError(response.data.error))
}

const login = (username, password) => async (dispatch) => {
  const response = await authAPI.login(username, password)

  console.log(response.data)

  if (response.data.response) {
    authAPI.setData(response.data)
    if (response.data.token.isPasswordSet) history.replace('/')
    else
      history.replace(
        `/changepassword/${response.data.uid}/${response.data.token.key}`
      )
  } else dispatch(snackbarActions.showError(response.data.error))
}

const logout = () => async () => {
  await authAPI.logout()

  authAPI.clearData()
  history.push('/auth')
}

export default {
  checkParams,
  clearConfirmParams,
  clearPasswordParams,
  changePassword,
  findUser,
  login,
  logout,
  ...snackbarActions,
}
