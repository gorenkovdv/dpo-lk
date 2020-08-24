import { entityAPI } from '../../services/api'
import snackbarActions from './snackbarActions'
import history from '../../history'

const setLoading = () => {
  return { type: 'ENTITY_DATA_LOAD_REQUEST' }
}
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

  //console.log(response.data)

  if (response.data.response) history.push('/profile')
  else dispatch(snackbarActions.showError(response.data.error))
}

const checkEntityRoots = () => async (dispatch) => {
  const response = await entityAPI.checkEntityRoots()

  console.log(response.data)
  dispatch(entityRootsConfirmed(response.data.entities))
}

const requestEntityData = () => async (dispatch) => {
  dispatch(setLoading())
  const response = await entityAPI.getEntityData()
  console.log(response.data)
  if (response.data.response)
    dispatch(
      loadingSuccess({ ...response.data.entity, roots: response.data.roots })
    )
  else dispatch(snackbarActions.showError(response.data.error))
}

const updateEntityData = (data) => async (dispatch) => {
  const response = await entityAPI.setEntityData(data)

  console.log(response.data)
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
