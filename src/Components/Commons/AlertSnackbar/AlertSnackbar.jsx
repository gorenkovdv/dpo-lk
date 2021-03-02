import React from 'react'
import { useDispatch, useSelector } from "react-redux"
import { Snackbar } from '@material-ui/core'
import MuiAlert from '@material-ui/lab/Alert'
import { actions } from '../../../store/reducers/snackbar'

const Alert = (props) => {
    return <MuiAlert elevation={6} variant="filled" {...props} />
}

const GlobalSnackbar = () => {
    const dispatch = useDispatch()
    const params = useSelector(state => state.snackbar)

    const handleClose = (e, reason) => {
        if (reason === 'clickaway') {
            return
        }

        dispatch(actions.clearSnackbar())
    }

    return (
        <Snackbar open={params.open} autoHideDuration={5000} onClose={handleClose}>
            <Alert onClose={handleClose} severity={params.severity}>
                {params.message}
            </Alert>
        </Snackbar>
    )
}

export default GlobalSnackbar
