import React from 'react'
import { useDispatch, useSelector } from "react-redux"
import { Snackbar } from '@material-ui/core'
import MuiAlert from '@material-ui/lab/Alert'
import { actions } from '../../../store/reducers/snackbar'
import { getSnackbarParams } from '../../../store/selectors/common'

const Alert = (props: any) => {
    return <MuiAlert elevation={6} variant="filled" {...props} />
}

const AlertSnackbar: React.FC = (): JSX.Element => {
    const dispatch = useDispatch()
    const { isOpen, severity, message } = useSelector(getSnackbarParams)
    const handleClose = () => {
        dispatch(actions.closeMessageAction())
    }
    return (
        <Snackbar open={isOpen} autoHideDuration={5000} onClose={handleClose}>
            <Alert onClose={handleClose} severity={severity}>
                {message}
            </Alert>
        </Snackbar>
    )
}

export default AlertSnackbar
