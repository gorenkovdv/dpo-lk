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

export const rootReducer = combineReducers({
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
