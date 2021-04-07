import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Field, InjectedFormProps, reduxForm, submit } from 'redux-form'
import { Grid, Button, Typography } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import HeaderLayout from '../Commons/Header/HeaderLayout'
import DialogLayout from '../Commons/Dialog/DialogLayout'
import { MaskedInput } from '../Commons/FormsControls/FormsControls'
import { required, isStringContainsUnderscore } from '../../utils/validate'
import withAuth from '../Authorization/withAuth'
import { checkEntityRoots, addEntityRepresentative } from '../../store/reducers/entityData'
import { logout } from '../../store/reducers/auth'
import { getEntities } from '../../store/selectors/entity'
import history from '../../history'

const useStyles = makeStyles((theme) => ({
  link: {
    textAlign: 'center',
    margin: theme.spacing(1, 0),
    textDecoration: 'none',
    color: theme.palette.primary.main,
    '&:hover': {
      color: theme.palette.primary.main,
      textDecoration: 'underline',
    }
  },
  button: {
    display: 'block',
    margin: '16px auto 0 auto',
    fontSize: 16,
    width: 750,
    height: 60,
    [theme.breakpoints.down('sm')]: {
      width: '90%',
      fontSize: 14,
    },
  },
  pointer: {
    cursor: "pointer"
  },
  fullWidth: {
    width: '100%',
  },
}))

const ChooseType = () => {
  const classes = useStyles()
  const dispatch = useDispatch()
  const data = useSelector(getEntities)

  const [
    selectEntityDialogParams,
    setSelectEntityDialogParams,
  ] = React.useState({
    open: false,
    disabled: true,
  })

  React.useEffect(() => {
    if (sessionStorage.pagesType) {
      sessionStorage.removeItem('pagesType')
    }
  }, [])

  React.useEffect(() => {
    dispatch(checkEntityRoots())
  }, [dispatch])

  const selectEntityDialogShow = () => {
    setSelectEntityDialogParams({
      open: true,
      disabled: false,
    })
  }

  const selectEntityDialogClose = () => {
    setSelectEntityDialogParams({ open: false, disabled: true })
  }

  const handleLogout = () => {
    dispatch(logout())
  }

  const handleClick = (type: string) => (event: React.MouseEvent) => {
    sessionStorage.pagesType = type
    if (type === 'listener') history.push('/profile')
    else {
      if (!data.length) selectEntityDialogShow()
      else history.push('/profile')
    }
  }

  const handleSubmit = (values: IValues) => {
    selectEntityDialogClose()
    dispatch(addEntityRepresentative(values.ITN))
  }

  return (
    <>
      <HeaderLayout />
      <Grid container direction="row" justify="center" alignItems="center">
        <Grid item className={classes.fullWidth}>
          <Button
            type="button"
            className={classes.button}
            variant="contained"
            color="primary"
            onClick={handleClick('listener')}
          >
            Личный кабинет слушателя курсов ДПО / НМО
          </Button>
        </Grid>
        <Grid item className={classes.fullWidth}>
          <Button
            type="button"
            className={classes.button}
            variant="contained"
            color="secondary"
            onClick={handleClick('entity')}
          >
            Личный кабинет представителя юридического лица
          </Button>
        </Grid>
      </Grid>
      <Typography onClick={handleLogout} className={`${classes.link} ${classes.pointer}`}>
        Выход
      </Typography>
      <DialogLayout
        options={selectEntityDialogParams}
        onClose={selectEntityDialogClose}
        onApprove={() => dispatch(submit('ITNForm'))}
        approveText="Подтвердить"
        cancelText="Отмена"
        title="Вход в личный кабинет"
        text="Для входа в личный кабинет представителя юридического лица необходимо указать ИНН юридического лица"
      >
        <ITNReduxForm onSubmit={handleSubmit} />
      </DialogLayout>
    </>
  )
}

interface IValues {
  ITN: string
}

const ITNForm: React.FC<InjectedFormProps<IValues>> = ({ handleSubmit }) => {
  const ITNFieldRef = React.useRef(null as any)

  React.useEffect(() => {
    ITNFieldRef.current.focus()
  }, [])

  return (
    <form onSubmit={handleSubmit}>
      <Field
        fullWidth
        inputRef={ITNFieldRef}
        name="ITN"
        variant="standard"
        label="Введите ИНН юридического лица"
        mask={`99999999999`}
        component={MaskedInput}
        validate={[required, isStringContainsUnderscore]}
        required
      />
    </form>
  )
}

const ITNReduxForm = reduxForm<IValues>({ form: 'ITNForm' })(ITNForm)

export default withAuth(ChooseType)
