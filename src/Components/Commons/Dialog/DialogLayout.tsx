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
import { useTheme, Theme, makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme: Theme) => ({
  closeButton: {
    position: 'absolute',
    right: 0,
    top: 0,
    color: theme.palette.primary.main,
  },
  title: {
    paddingRight: theme.spacing(3),
  },
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

const DialogTitle: React.FC<{ onClose: () => void }> = ({ children, onClose, ...other }): JSX.Element => {
  const classes = useStyles()
  return (
    <MuiDialogTitle disableTypography {...other}>
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
}

const DialogLayout: React.FC<any> = ({
  options,
  largeSize,
  title,
  text,
  onApprove,
  onClose,
  approveText,
  cancelText,
  children,
}): JSX.Element => {
  const theme = useTheme()
  const classes = useStyles()
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'))

  return (
    <Dialog
      scroll="paper"
      fullScreen={fullScreen}
      open={options.open}
      onClose={onClose}
      classes={largeSize && !fullScreen ? { paper: classes.paper } : null as any}
    >
      <DialogTitle onClose={onClose}>{title}</DialogTitle>
      <DialogContent style={{ minWidth: 450 }}>
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
