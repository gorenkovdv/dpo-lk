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
import { useTheme, withStyles } from '@material-ui/core/styles'
import { actions as confirmDialogActions } from '../../../store/reducers/confirmDialog'

const styles = (theme) => ({
  closeButton: {
    position: 'absolute',
    right: 0,
    top: 0,
    color: theme.palette.primary.main,
  },
  title: {
    paddingRight: theme.spacing(3),
  },
})

const DialogTitle = withStyles(styles)((props) => {
  const { children, classes, onClose, ...other } = props
  return (
    <MuiDialogTitle disableTypography className={classes.root} {...other}>
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
})

const DialogLayout = () => {
  const dispatch = useDispatch()
  const params = useSelector((state) => state.confirmDialog)

  const theme = useTheme()
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'))

  const handleClose = () => {
    dispatch(confirmDialogActions.confirmDialogClose())
  }

  return (
    <Dialog
      scroll="paper"
      fullScreen={fullScreen}
      open={params.open}
      onClose={handleClose}
    >
      <DialogTitle onClose={handleClose}>{params.title}</DialogTitle>
      <DialogContent style={{ minWidth: 450 }}>
        <DialogContentText>{params.text}</DialogContentText>
      </DialogContent>

      <DialogActions>
        <Button
          color="primary"
          variant="contained"
          disabled={params.disabled}
          onClick={params.onApprove}
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
