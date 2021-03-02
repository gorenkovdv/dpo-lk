import { combineReducers } from 'redux'
import { profileReducer } from './profile'
import { snackbarReducer } from './snackbar'
import { confirmDialogReducer } from './confirmDialog'
import { loaderReducer } from './loader'
import { authReducer } from './auth'
import { entityDataReducer } from './entityData'
import { listenerDataReducer } from './listenerData'
import { coursesReducer } from './courses'
import { requestsReducer } from './requests'
import { reducer as formReducer } from 'redux-form'

const appReducer = combineReducers({
  profile: profileReducer,
  snackbar: snackbarReducer,
  confirmDialog: confirmDialogReducer,
  loader: loaderReducer,
  auth: authReducer,
  entityData: entityDataReducer,
  listenerData: listenerDataReducer,
  courses: coursesReducer,
  requests: requestsReducer,
  form: formReducer,
})

export const rootReducer = (state: any, action: any) => {
  appReducer(state, action)
  return appReducer(state, action)
}

type RootReducerType = typeof rootReducer
export type AppStateType = ReturnType<RootReducerType>

type PropertiesType<T> = T extends { [key: string]: infer U } ? U : never
export type InferActionsType<T extends { [key: string]: (...args: any[]) => any }> = ReturnType<PropertiesType<T>>