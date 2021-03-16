import React, { useEffect } from 'react'
import { NavLink, Redirect } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { Field, reduxForm, InjectedFormProps } from 'redux-form'
import { Grid, Button, InputAdornment } from '@material-ui/core'
import { makeStyles, Theme } from '@material-ui/core/styles'
import { Input, PasswordInput } from '../Commons/FormsControls/FormsControls'
import { VpnKey as KeyIcon, Person as PersonIcon } from '@material-ui/icons'
import HeaderLayout from '../Commons/Header/HeaderLayout'
import { authAPI } from '../../services/api'
import { login } from '../../store/reducers/auth'

const useStyles = makeStyles((theme: Theme) => ({
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
  form: {
    boxSizing: 'border-box',
    padding: theme.spacing(1),
    width: 400,
    maxWidth: '100%',
  },
  inputEndIcon: {
    marginLeft: theme.spacing(1),
    padding: 3,
    color: 'gray',
  },
  button: {
    marginTop: 20,
    width: '100%',
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
}))

interface IAuthData {
  username: string,
  password: string
}

const Authorization: React.FC = (): JSX.Element => {
  const classes = useStyles()
  const dispatch = useDispatch()

  useEffect(() => {
    if (sessionStorage.token) {
      let isPasswordSet = JSON.parse(sessionStorage.token).isPasswordSet
      if (!isPasswordSet) authAPI.clearData()
    }
  })

  const handleSubmit = (values: IAuthData) => {
    dispatch(
      login(values.username, values.password || '')
    )
  }

  if (authAPI.loggedIn()) return <Redirect to="/" />

  return (
    <div>
      <Grid container direction="column" justify="center" alignItems="center">
        <HeaderLayout />
        <h3 className={classes.h3}>
          Личный кабинет слушателя курсов ДПО / НМО
        </h3>
        <AuthReduxForm onSubmit={handleSubmit} />
      </Grid>
    </div>
  )
}

const AuthForm: React.FC<InjectedFormProps<IAuthData>> = ({ handleSubmit }) => {
  const classes = useStyles()

  const [showPassword, setShowPassword] = React.useState(false)

  const handleShowPassword = () => {
    setShowPassword(!showPassword)
  }

  return (
    <form className={classes.form} onSubmit={handleSubmit}>
      <Grid container direction="column" justify="center" alignItems="center">
        <Field
          name="username"
          component={Input}
          margin="normal"
          label="Логин"
          endadornment={
            <InputAdornment position="start">
              <PersonIcon className={classes.inputEndIcon} />
            </InputAdornment>}
        />
        <Field
          name="password"
          showpassword={showPassword}
          showhandle={handleShowPassword}
          component={PasswordInput}
          margin="normal"
          label="Пароль"
        />
        <Button
          type="submit"
          className={classes.button}
          variant="contained"
          color="primary"
          startIcon={<KeyIcon />}
        >
          Авторизоваться
        </Button>

        <NavLink to="/forgotpassword" className={classes.link}>
          Забыли пароль?
        </NavLink>
        <NavLink to="/reg" className={classes.link}>
          Регистрация
        </NavLink>
      </Grid>
    </form>
  )
}

const AuthReduxForm = reduxForm<IAuthData>({ form: 'authForm' })(AuthForm)

export default Authorization
