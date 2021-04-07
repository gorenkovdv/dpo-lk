import React, { useEffect } from 'react'
import { NavLink, RouteComponentProps, withRouter } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { Field, InjectedFormProps, reduxForm } from 'redux-form'
import {
  Grid,
  Button,
} from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import { PasswordInput } from '../Commons/FormsControls/FormsControls'
import LoaderLayout from '../Commons/Loader/LoaderLayout'
import HeaderLayout from '../Commons/Header/HeaderLayout'
import { actions as authActions, checkParams, changePassword } from '../../store/reducers/auth'
import { getChangePasswordParams } from '../../store/selectors/auth'
import { getIsLoading } from '../../store/selectors/loader'

const useStyles = makeStyles(theme => ({
  h3: {
    textAlign: 'center',
    fontWeight: 500,
    marginTop: 15,
    marginBottom: 15,
    fontSize: 26,
    [theme.breakpoints.down('sm')]: {
      fontSize: 20,
    },
  },
  link: {
    textAlign: 'center',
    margin: theme.spacing(1, 0),
    textDecoration: 'none',
    color: theme.palette.primary.main,
    '&:hover': {
      color: theme.palette.primary.main,
      textDecoration: 'underline',
    },
  },
  button: {
    marginTop: 20,
    width: '100%',
  },
  form: {
    boxSizing: 'border-box',
    padding: theme.spacing(1),
    width: 400,
    maxWidth: '100%',
  },
  error: {
    color: theme.palette.error.main
  }
}))

interface RouteParams {
  id: string,
  key: string
}

const ChangePassword: React.FC<RouteComponentProps<RouteParams>> = (props) => {
  const classes = useStyles()
  const dispatch = useDispatch()
  const params = useSelector(getChangePasswordParams)
  const isLoading = useSelector(getIsLoading)

  useEffect(() => {
    dispatch(authActions.clearPasswordParams())
  }, [dispatch])

  useEffect(() => {
    const matchParams = props.match.params
    dispatch(checkParams(matchParams.id, matchParams.key, 'changePassword'))
  }, [dispatch, props])

  const handleSubmit = (values: IValues) => {
    dispatch(changePassword(
      props.match.params.id,
      props.match.params.key,
      values.password,
      values.repeatPassword
    ))
  }

  let message = 'Смена пароля'
  let buttonText = 'Сменить пароль'

  if (params && params.reset) {
    message = 'Активация учётной записи'
    buttonText = 'Установить пароль'
  }

  if (isLoading) return <LoaderLayout />

  return (
    <Grid container direction="column" justify="center" alignItems="center">
      <HeaderLayout />
      { params && (
        <>
          <h3 className={classes.h3}>{message}</h3>
          <Grid
            container
            direction="column"
            justify="center"
            alignItems="center"
          >
            {params.showForm
              ? <ChangePasswordReduxForm buttonText={buttonText} onSubmit={handleSubmit} />
              : <p className={classes.error}>Неверные параметры смены пароля</p>
            }
          </Grid>
        </>
      )}
      <NavLink to="/auth" className={classes.link}>
        Перейти на страницу авторизации
      </NavLink>
    </Grid>
  )
}

interface IValues {
  password: string
  repeatPassword: string
}

interface IProps {
  buttonText: string
}

const ChangePasswordForm: React.FC<InjectedFormProps<IValues, IProps> & IProps> = ({ handleSubmit, buttonText }) => {
  const classes = useStyles()
  const [showPassword, setShowPassword] = React.useState(false)

  const handleShowPassword = () => {
    setShowPassword(!showPassword)
  }

  return (
    <form
      className={classes.form}
      onSubmit={handleSubmit}
    >
      <Grid
        container
        direction="column"
        justify="center"
        alignItems="center"
      >
        <Field
          name="password"
          showpassword={showPassword}
          showhandle={handleShowPassword}
          component={PasswordInput}
          label="Новый пароль"
        />
        <Field
          name="repeatPassword"
          showpassword={showPassword}
          showhandle={handleShowPassword}
          component={PasswordInput}
          label="Повторите пароль"
        />
        <Button
          type="submit"
          className={classes.button}
          variant="contained"
          color="primary"
        >
          {buttonText}
        </Button>
      </Grid>
    </form>
  )
}

const ChangePasswordReduxForm = reduxForm<IValues, IProps>({
  form: 'changePasswordForm'
})(ChangePasswordForm)

export default withRouter(ChangePassword)
