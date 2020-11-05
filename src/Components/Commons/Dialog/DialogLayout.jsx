import React from 'react'
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
import { useTheme, withStyles, makeStyles } from '@material-ui/core/styles'

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

const useStyles = makeStyles((theme) => ({
  paper: {
    minWidth: 1200,
    maxHeight: 750,
    minHeight: 700,
    [theme.breakpoints.down('sm')]: {
      minWidth: 'auto',
      minHeight: 'auto',
    },
  },
}))

const DialogTitle = withStyles(styles)((props) => {
  const { children, classes, onClose, ...other } = props
  return (
    <MuiDialogTitle disableTypography className={classes.root} {...other}>
      <Typography className={classes.title} variant="h6">
        {children}
      </Typography>
      {onClose ? (
        <IconButton
          aria-label="close"
          className={classes.closeButton}
          onClick={onClose}
        >
          <CloseIcon fontSize="large" />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  )
})

const DialogLayout = ({
  options,
  largeSize,
  title,
  text,
  onApprove,
  onClose,
  approveText,
  cancelText,
  children,
}) => {
  const theme = useTheme()
  const classes = useStyles()
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'))

  return (
    <Dialog
      scroll="paper"
      fullScreen={fullScreen}
      open={options.open}
      onClose={onClose}
      classes={largeSize && !fullScreen ? { paper: classes.paper } : null}
    >
      <DialogTitle onClose={onClose}>{title}</DialogTitle>
      <DialogContent>
        {text && <DialogContentText>{text}</DialogContentText>}
        {children}
      </DialogContent>

      <DialogActions>
        <>
          {onApprove && (
            <Button
              color="primary"
              variant="contained"
              disabled={options.disabled ? options.disabled : false}
              onClick={onApprove}
              autoFocus
            >
              {approveText ? approveText : 'Да'}
            </Button>
          )}
          {onClose && (
            <Button onClick={onClose} color="primary" variant="contained">
              {cancelText ? cancelText : 'Нет'}
            </Button>
          )}
        </>
      </DialogActions>
    </Dialog>
  )
}

export default DialogLayout
