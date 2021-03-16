import { ThunkAction } from 'redux-thunk'
import { AppStateType, InferActionsType } from './index'
import { actions as snackbarActions } from './snackbar'
import { authAPI } from '../../services/api'
import { IProfile } from '../../types'
import { reset } from 'redux-form'

type profileActionsTypes = InferActionsType<typeof actions>

export const addUser = (data: IProfile): ThunkAction<Promise<void>, AppStateType, unknown, profileActionsTypes> => {
    return async (dispatch) => {
        const response = await authAPI.addUser(data)

        if (response.data.response) {
            dispatch(reset('registrationForm'))
            dispatch(
                snackbarActions.showSuccess(
                    `Ссылка для активации учётной записи выслана на электронную почту ${data.email}`
                )
            )
        } else dispatch(snackbarActions.showError(response.data.error))
    }
}

const actions = snackbarActions