import { AppStateType } from '../reducers'

export const getListenersAddition = (state: AppStateType) => {
    return state.courses.listenersAddition
}

export const getSelectedCourse = (state: AppStateType) => {
    return state.courses.selectedCourse
}