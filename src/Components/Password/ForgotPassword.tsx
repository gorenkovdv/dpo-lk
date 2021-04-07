import React from 'react'
import { NavLink } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { Field, InjectedFormProps, reduxForm } from 'redux-form'
import { Grid, Button, Typography } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import { Input } from '../Commons/FormsControls/FormsControls'
import HeaderLayout from '../Commons/Header/HeaderLayout'
import { findUser } from '../../store/reducers/auth'

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
  typography: {
    boxSizing: 'border-box',
    padding: theme.spacing(1, 0),
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
  form: {
    boxSizing: 'border-box',
    padding: theme.spacing(1),
    width: 400,
    maxWidth: '100%',
  },
  button: {
    marginTop: 20,
    width: '100%',
  },
  error: {
    color: theme.palette.error.main,
  },
}))

const ForgotPassword: React.FC = () => {
  const classes = useStyles()
  const dispatch = useDispatch()

  const handleSubmit = (values: IValues) => {
    dispatch(findUser(values.value))
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
        <ForgotPasswordReduxForm onSubmit={handleSubmit} />
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

interface IValues {
  value: string
}

const ForgotPasswordForm: React.FC<InjectedFormProps<IValues>> = (props) => {
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

const ForgotPasswordReduxForm = reduxForm<IValues>({ form: 'forgotPasswordForm' })(ForgotPasswordForm)

export default ForgotPassword
