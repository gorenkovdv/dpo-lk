import { BaseThunkType, InferActionsType } from './index'
import { actions as snackbarActions } from './snackbar'
import { authAPI } from '../../services/api'
import { IProfile } from '../../types'
import { reset } from 'redux-form'

type profileActionsTypes = InferActionsType<typeof actions>

export const addUser = (data: IProfile): BaseThunkType<profileActionsTypes> => {
    return async (dispatch) => {
        const response = await authAPI.addUser(data)

        if (response.data.response) {
            dispatch(reset('registrationForm'))
            dispatch(
                snackbarActions.showMessageAction(
                    `Ссылка для активации учётной записи выслана на электронную почту ${data.email}`,
                    `success`
                )
            )
        } else dispatch(snackbarActions.showMessageAction(response.data.error, 'error'))
    }
}

const actions = snackbarActions