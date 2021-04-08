import { AppStateType } from '../reducers'

export const getFactAddress = (state: AppStateType) => state.listenerData.list.fact

export const getRegAddress = (state: AppStateType) => state.listenerData.list.registration

export const getEducationData = (state: AppStateType) => state.listenerData.list.education

export const getEducationTypes = (state: AppStateType) => state.listenerData.list.educationTypes

export const getOtherData = (state: AppStateType) => state.listenerData.list.others

export const getPassportData = (state: AppStateType) => state.listenerData.list.passport

export const getWorkData = (state: AppStateType) => state.listenerData.list.work

export const getSertificates = (state: AppStateType) => state.listenerData.list.sertificates

export const getSelectedTab = (state: AppStateType) => state.listenerData.selectedTab

export const getSelectedDocumentsTab = (state: AppStateType) => state.listenerData.documentsTab