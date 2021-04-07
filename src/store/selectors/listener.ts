import { AppStateType } from '../reducers'

export const getFactAddress = (state: AppStateType) => state.listenerData.list.fact

export const getRegAddress = (state: AppStateType) => state.listenerData.list.registration

export const getEducationData = (state: AppStateType) => state.listenerData.list.education

export const getEducationTypes = (state: AppStateType) => state.listenerData.list.educationTypes

export const getOtherData = (state: AppStateType) => state.listenerData.list.others

export const getSelectedTab = (state: AppStateType) => state.listenerData.selectedTab