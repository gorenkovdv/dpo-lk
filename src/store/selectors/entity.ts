import { AppStateType } from '../reducers'

export const getEntities = (state: AppStateType) => state.entityData.entities

export const getEntityData = (state: AppStateType) => state.entityData.list