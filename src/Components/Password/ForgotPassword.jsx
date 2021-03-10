import React from 'react'
import { NavLink } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { Field, reduxForm } from 'redux-form'
import { Grid, Button, Typography } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import { Input } from '../Commons/FormsControls/FormsControls'
import HeaderLayout from '../Commons/Header/HeaderLayout'
import { findUser } from '../../store/reducers/auth'
import styles from '../../styles'

const useStyles = makeStyles(theme => ({
  ...styles(theme),
  typography: {
    ...styles(theme).typography,
    width: '50%',
    [theme.breakpoints.down('sm')]: {
      width: '100%',
    },
    maxWidth: '100%',
  },
  info: {
    textAlign: 'center',
    fontSize: 12,
    fontWeight: 200,
    fontStyle: 'italic',
    marginTop: 25,
  },
  error: {
    color: theme.palette.error.main,
  },
}))

const ForgotPassword = () => {
  const classes = useStyles()
  const dispatch = useDispatch()

  const handleSubmit = ({ value }) => {
    dispatch(findUser(value))
  }

  return (
    <Grid container direction="column" justify="center" alignItems="center">
      <Grid container direction="column" justify="center" alignItems="center">
        <HeaderLayout />
        <h3 className={classes.h3}>Восстановление пароля учётной записи</h3>
        <Typography className={classes.typography}>
          Чтобы получить инструкции по смене пароля на электронную почту,
          указанную в данных вашей учетной записи, введите имя пользователя
          (логин) или адрес электронной почты из вашей учетной записи:
        </Typography>
        <ForgotPasswordForm onSubmit={handleSubmit} />
        <NavLink to="/auth" className={classes.link}>
          Перейти на страницу авторизации
        </NavLink>
        <Typography className={`${classes.typography} ${classes.info}`}>
          По техническим вопросам работы с электронными сервисами обращайтесь в
          управление информатизации АГМУ по эл.почте support@agmu.ru
        </Typography>
      </Grid>
    </Grid>
  )
}

let ForgotPasswordForm = props => {
  const classes = useStyles()
  return (
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
          name="value"
          component={Input}
          margin="normal"
          label="Логин или email"
        />
        <Button
          type="submit"
          className={classes.button}
          variant="contained"
          color="primary"
        >
          Получить
        </Button>
      </Grid>
    </form>
  )
}

ForgotPasswordForm = reduxForm({ form: 'forgotPasswordForm' })(ForgotPasswordForm)

export default ForgotPassword
