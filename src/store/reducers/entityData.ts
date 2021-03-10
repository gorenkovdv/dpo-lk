import { ThunkAction } from 'redux-thunk'
import { entityAPI } from '../../services/api'
import { actions as snackbarActions } from './snackbar'
import { actions as loaderActions } from './loader'
import { AppStateType, InferActionsType } from './index'
import history from '../../history'

interface IStateList {
  BIC: string
  CTMU: string
  IEC: string
  ITN: string
  bank: string
  checkAcc: string
  country: string
  house: string
  hrPhone: string
  id: number | null
  locality: string
  localityType: number | null
  organization: string
  postcode: string
  region: string
  roots: number
  street: string
  workPhone: string
}

interface IState {
  list: IStateList,
  entities?: Array<number>
}

const initialState: IState = {
  list: {
    BIC: '',
    CTMU: '',
    IEC: '',
    ITN: '',
    bank: '',
    checkAcc: '',
    country: '',
    house: '',
    hrPhone: '',
    id: null,
    locality: '',
    localityType: null,
    organization: '',
    postcode: '',
    region: '',
    roots: 0,
    street: '',
    workPhone: '',
  },
}

type entityDataActionsTypes = InferActionsType<typeof actions>

export const entityDataReducer = (state = initialState, action: entityDataActionsTypes): IState => {
  switch (action.type) {
    case 'ENTITY_DATA_LOAD_SUCCESS':
      return {
        ...state,
        list: action.payload,
      }
    case 'ENTITY_DATA_UPDATE_SUCCESS':
      return {
        ...state,
        list: action.payload,
      }
    case 'ENTITY_ROOTS_CONFIRMED':
      return {
        ...state,
        entities: action.payload,
      }
    default:
      return state
  }
}

export const addEntityRepresentative = (ITN: string): ThunkAction<Promise<void>, AppStateType, unknown, entityDataActionsTypes> => {
  return async (dispatch) => {
    const response = await entityAPI.addEntityRepresentative(ITN)

    if (response.data.response) history.push('/profile')
    else dispatch(actions.showError(response.data.error))
  }
}

export const checkEntityRoots = (): ThunkAction<Promise<void>, AppStateType, unknown, entityDataActionsTypes> => {
  return async (dispatch) => {
    const response = await entityAPI.checkEntityRoots()

    dispatch(actions.entityRootsConfirmed(response.data.entities))
  }
}

export const requestEntityData = (): ThunkAction<Promise<void>, AppStateType, unknown, entityDataActionsTypes> => {
  return async (dispatch) => {
    dispatch(actions.setLoading())
    const response = await entityAPI.getEntityData()

    if (response.data.response) {
      dispatch(
        actions.entityDataLoadingSuccess({ ...response.data.entity, roots: response.data.roots })
      )
      dispatch(actions.loadingSuccess())
    } else dispatch(actions.showError(response.data.error))
  }
}

export const updateEntityData = (data: any): ThunkAction<Promise<void>, AppStateType, unknown, entityDataActionsTypes> => {
  return async (dispatch) => {
    const response = await entityAPI.setEntityData(data)

    if (response.data.response) {
      dispatch(actions.updatingSuccess(data))
      dispatch(actions.showSuccess('Данные успешно обновлены'))
    } else dispatch(actions.showError(response.data.error))
  }
}

const actions = {
  entityDataLoadingSuccess: (data: any) => ({
    type: 'ENTITY_DATA_LOAD_SUCCESS',
    payload: data
  } as const),
  updatingSuccess: (data: any) => ({
    type: 'ENTITY_DATA_UPDATE_SUCCESS',
    payload: data
  } as const),
  entityRootsConfirmed: (data: any) => ({
    type: 'ENTITY_ROOTS_CONFIRMED',
    payload: data
  } as const),
  ...snackbarActions,
  ...loaderActions
}
