import { entityAPI } from '../../services/api'
import { actions as snackbarActions } from './snackbar'
import { actions as loaderActions } from './loader'
import { BaseThunkType, InferActionsType } from './index'
import history from '../../history'

export interface IEntityDataList {
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
  list: IEntityDataList,
  entities: Array<number>
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
  entities: []
}

type entityDataActionsTypes = InferActionsType<typeof actions>
type ThunkType = BaseThunkType<entityDataActionsTypes>

export const entityDataReducer = (state = initialState, action: entityDataActionsTypes): IState => {
  switch (action.type) {
    case 'dpo-lk/entity/LOAD_SUCCESS':
      return {
        ...state,
        list: action.payload,
      }
    case 'dpo-lk/entity/UPDATE_SUCCESS':
      return {
        ...state,
        list: action.payload,
      }
    case 'dpo-lk/entity/ROOTS_CONFIRMED':
      return {
        ...state,
        entities: action.payload,
      }
    default:
      return state
  }
}

export const addEntityRepresentative = (ITN: string): ThunkType => {
  return async (dispatch) => {
    const response = await entityAPI.addEntityRepresentative(ITN)

    if (response.data.response) history.push('/profile')
    else dispatch(actions.showMessageAction(response.data.error, 'error'))
  }
}

export const checkEntityRoots = (): ThunkType => {
  return async (dispatch) => {
    const response = await entityAPI.checkEntityRoots()

    dispatch(actions.entityRootsConfirmed(response.data.entities))
  }
}

export const requestEntityData = (): ThunkType => {
  return async (dispatch) => {
    dispatch(actions.setLoading())
    const response = await entityAPI.getEntityData()

    if (response.data.response) {
      dispatch(
        actions.entityDataLoadingSuccess({ ...response.data.entity, roots: response.data.roots })
      )
      dispatch(actions.loadingSuccess())
    } else dispatch(actions.showMessageAction(response.data.error, 'error'))
  }
}

export const updateEntityData = (data: any): ThunkType => {
  return async (dispatch) => {
    const response = await entityAPI.setEntityData(data)

    if (response.data.response) {
      dispatch(actions.updatingSuccess(data))
      dispatch(actions.showMessageAction('Данные успешно обновлены', 'success'))
    } else dispatch(actions.showMessageAction(response.data.error, 'error'))
  }
}

const actions = {
  entityDataLoadingSuccess: (data: any) => ({
    type: 'dpo-lk/entity/LOAD_SUCCESS',
    payload: data
  } as const),
  updatingSuccess: (data: any) => ({
    type: 'dpo-lk/entity/UPDATE_SUCCESS',
    payload: data
  } as const),
  entityRootsConfirmed: (data: any) => ({
    type: 'dpo-lk/entity/ROOTS_CONFIRMED',
    payload: data
  } as const),
  ...snackbarActions,
  ...loaderActions
}
