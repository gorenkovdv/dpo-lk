import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import MuiDialogTitle from '@material-ui/core/DialogTitle'
import {
  Typography,
  IconButton,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  useMediaQuery,
} from '@material-ui/core'
import CloseIcon from '@material-ui/icons/Close'
import { makeStyles, useTheme } from '@material-ui/core/styles'
import { actions as confirmDialogActions } from '../../../store/reducers/confirmDialog'
import { getConfirmDialogParams } from '../../../store/selectors/common'


const useStyles = makeStyles((theme) => ({
  closeButton: {
    position: 'absolute',
    right: 0,
    top: 0,
    color: theme.palette.primary.main,
  },
  title: {
    paddingRight: theme.spacing(3),
  },
}))


const DialogTitle: React.FC<{ onClose: () => void }> = ({ children, onClose, ...other }): JSX.Element => {
  const classes = useStyles()
  return (
    <MuiDialogTitle disableTypography {...other}>
      <Typography className={classes.title} variant="h6">
        {children}
      </Typography>
      <IconButton
        aria-label="close"
        className={classes.closeButton}
        onClick={onClose}
      >
        <CloseIcon fontSize="large" />
      </IconButton>
    </MuiDialogTitle>
  )
}

const DialogLayout: React.FC = (): JSX.Element => {
  const dispatch = useDispatch()
  const { open, disabled, title, text, onApprove } = useSelector(getConfirmDialogParams)

  const theme = useTheme()
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'))

  const handleClose = () => {
    dispatch(confirmDialogActions.confirmDialogClose())
  }

  return (
    <Dialog
      scroll="paper"
      fullScreen={fullScreen}
      open={open}
      onClose={handleClose}
    >
      <DialogTitle onClose={handleClose}>{title}</DialogTitle>
      <DialogContent style={{ minWidth: 450 }}>
        <DialogContentText>{text}</DialogContentText>
      </DialogContent>

      <DialogActions>
        <Button
          color="primary"
          component="button"
          variant="contained"
          disabled={disabled}
          onClick={onApprove}
          autoFocus
        >
          Да
        </Button>
        <Button onClick={handleClose} color="primary" variant="contained">
          Нет
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default DialogLayout
