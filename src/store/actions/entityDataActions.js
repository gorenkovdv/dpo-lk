import { entityAPI } from '../../services/api'
import { actions as snackbarActions } from '../reducers/snackbar'
import { actions as loaderActions } from '../reducers/loader'
import history from '../../history'

const loadingSuccess = (data) => {
  return { type: 'ENTITY_DATA_LOAD_SUCCESS', payload: data }
}
const updatingSuccess = (data) => {
  return { type: 'ENTITY_DATA_UPDATE_SUCCESS', payload: data }
}
const entityRootsConfirmed = (data) => {
  return { type: 'ENTITY_ROOTS_CONFIRMED', payload: data }
}

const addEntityRepresentative = (ITN) => async (dispatch) => {
  const response = await entityAPI.addEntityRepresentative(ITN)

  if (response.data.response) history.push('/profile')
  else dispatch(snackbarActions.showError(response.data.error))
}

const checkEntityRoots = () => async (dispatch) => {
  const response = await entityAPI.checkEntityRoots()

  dispatch(entityRootsConfirmed(response.data.entities))
}

const requestEntityData = () => async (dispatch) => {
  dispatch(loaderActions.setLoading())
  const response = await entityAPI.getEntityData()

  if (response.data.response) {
    dispatch(
      loadingSuccess({ ...response.data.entity, roots: response.data.roots })
    )
    dispatch(loaderActions.loadingSuccess())
  } else dispatch(snackbarActions.showError(response.data.error))
}

const updateEntityData = (data) => async (dispatch) => {
  const response = await entityAPI.setEntityData(data)

  if (response.data.response) {
    dispatch(updatingSuccess(data))
    dispatch(snackbarActions.showSuccess('Данные успешно обновлены'))
  } else dispatch(snackbarActions.showError(response.data.error))
}

export default {
  requestEntityData,
  updateEntityData,
  checkEntityRoots,
  addEntityRepresentative,
}
