import { authAPI } from '../../services/api'
import snackbarActions from './snackbarActions'
import { reset } from 'redux-form'

const addUser = data => async(dispatch) => {
  const response = await authAPI.addUser(data)
      
  console.log(response.data)
  if(response.data.response){
      dispatch(reset('registrationForm'))
      dispatch(snackbarActions.showSuccess(`Ссылка для активации учётной записи выслана на электронную почту ${data.email}`))
  }
  else dispatch(snackbarActions.showError(response.data.error))
}

export default {
    addUser,
    ...snackbarActions
}