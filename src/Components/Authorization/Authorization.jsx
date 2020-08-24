import React, { useEffect } from 'react'
import { NavLink, Redirect } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { Field, reduxForm } from 'redux-form'
import { Grid, Button, InputAdornment } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import { Input, PasswordInput } from '../Commons/FormsControls/FormsControls'
import { VpnKey as KeyIcon, Person as PersonIcon } from '@material-ui/icons'
import HeaderLayout from '../Commons/Header/HeaderLayout'
import { authAPI } from '../../services/api'
import allActions from '../../store/actions'
import styles from '../../styles.js'

const useStyles = makeStyles((theme) => ({ ...styles(theme) }))

const Authorization = () => {
  const classes = useStyles()
  const dispatch = useDispatch()

  useEffect(() => {
    if (sessionStorage.token) {
      let isPasswordSet = JSON.parse(sessionStorage.token).isPasswordSet
      if (!isPasswordSet) authAPI.clearData()
    }
  })

  const handleSubmit = (values) => {
    dispatch(
      allActions.authActions.login(values.username, values.password || '')
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
        <AuthForm onSubmit={handleSubmit} />
      </Grid>
    </div>
  )
}

let AuthForm = (props) => {
  const classes = useStyles()
  return (
    <form className={classes.form} onSubmit={props.handleSubmit}>
      <Grid container direction="column" justify="center" alignItems="center">
        <Field
          name="username"
          component={Input}
          margin="normal"
          label="Логин"
          adornment={{
            endAdornment: (
              <InputAdornment>
                <PersonIcon className={classes.inputEndIcon} />
              </InputAdornment>
            ),
          }}
        />
        <Field
          name="password"
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

AuthForm = reduxForm({ form: 'authForm' })(AuthForm)

export default Authorization
