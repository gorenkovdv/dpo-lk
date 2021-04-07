import { AppStateType } from '../reducers'

export const getCoursesFilters = (state: AppStateType) => state.courses.filters

export const getListenersAddition = (state: AppStateType) => state.courses.listenersAddition

export const getSelectedCourse = (state: AppStateType) => state.courses.selectedCourse

export const getCurrentPage = (state: AppStateType) => state.courses.currentPage

export const getPageSize = (state: AppStateType) => state.courses.pageSize

export const getTotalCount = (state: AppStateType) => state.courses.totalCount

export const getCoursesList = (state: AppStateType) => state.courses.list

export const getVolumeList = (state: AppStateType) => state.courses.volumeList

export const getCoursesRoots = (state: AppStateType) => state.courses.roots

export const getSelectedListenerInfo = (state: AppStateType) => state.courses.listenerInfo