import { profileAPI } from '../../services/api'
import snackbarActions from './snackbarActions'
import loaderActions from './loaderActions'

const updatingSuccess = (data) => {
  return { type: 'PROFILE_INFO_UPDATE_SUCCESS', payload: data }
}

const requestProfile = () => async (dispatch) => {
  dispatch(loaderActions.setLoading())
  const response = await profileAPI.getProfile()

  if (response.data.response) {
    dispatch(updatingSuccess(response.data.profile))
    dispatch(loaderActions.loadingSuccess())
  } else dispatch(snackbarActions.showError(response.data.error))
}

const updateProfile = (data) => async (dispatch) => {
  const response = await profileAPI.setProfile(data)

  if (response.data.response) {
    dispatch(updatingSuccess(data))
    dispatch(snackbarActions.showSuccess('Данные успешно обновлены'))
  } else dispatch(snackbarActions.showError(response.data.error))
}

export default {
  requestProfile,
  updateProfile,
  ...snackbarActions,
}
