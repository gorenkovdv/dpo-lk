import React, { Fragment, useEffect } from 'react'
import { NavLink, withRouter } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { Field, reduxForm } from 'redux-form'
import {
  Grid,
  Button,
} from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import { PasswordInput } from '../Commons/FormsControls/FormsControls'
import HeaderLayout from '../Commons/Header/HeaderLayout'
import LoaderLayout from '../Commons/Loader/LoaderLayout'
import allActions from '../../store/actions'
import styles from '../../styles.js'

const useStyles = makeStyles(theme => ({ ...styles(theme) }))

const ChangePassword = props => {
  const classes = useStyles()
  const dispatch = useDispatch()
  const params = useSelector(state => state.auth.changePassword)

  useEffect(() => {
    dispatch(allActions.authActions.clearPasswordParams())
  }, [dispatch])

  useEffect(() => {
    const matchParams = props.match.params
    dispatch(allActions.authActions.checkParams(matchParams.id, matchParams.key, 'changePassword'))
  }, [dispatch, props])

  const handleSubmit = values =>{
    dispatch(allActions.authActions.changePassword(
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

  return (
    <Grid container direction="column" justify="center" alignItems="center">
      <HeaderLayout />
      { params && !params.redirect ? (
        <Fragment>
          <h3 className={classes.h3}>{message}</h3>
          <Grid
            container
            direction="column"
            justify="center"
            alignItems="center"
          >
            { params.showForm
            ? <ChangePasswordForm buttonText={buttonText} onSubmit={handleSubmit} />
            : <p className={classes.error}>Неверные параметры смены пароля</p>
            }
          </Grid>
        </Fragment>
      ) : (
        <LoaderLayout />
      )}
      <NavLink to="/auth" className={classes.link}>
        Перейти на страницу авторизации
      </NavLink>
    </Grid>
  )
}

let ChangePasswordForm = props => {
  const classes = useStyles()
  const buttonText = props.buttonText

  return(
    <form
    className={classes.form}
    onSubmit={props.handleSubmit}
    >
      <Grid
        container
        direction="column"
        justify="center"
        alignItems="center"
      >
        <Field
          name="password"
          component={PasswordInput}
          label="Новый пароль"
        />
        <Field
          name="repeatPassword"
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

ChangePasswordForm = reduxForm({ form: 'changePasswordForm' })(ChangePasswordForm)

export default withRouter(ChangePassword)
