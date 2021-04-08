import React from 'react'
import { NavLink } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { Field, InjectedFormProps, reduxForm } from 'redux-form'
import { Grid, Button, InputAdornment } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import {
  Save as SaveIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
} from '@material-ui/icons'
import HeaderLayout from '../Commons/Header/HeaderLayout'
import {
  Input,
  MaskedInput,
  DateInput,
} from '../Commons/FormsControls/FormsControls'
import {
  isEmailValid,
  isStringContainsUnderscore,
} from '../../utils/validate'
import { parseDate } from '../../utils/parse'
import { addUser } from '../../store/reducers/registration'
import { IProfile } from '../../types'

const useStyles = makeStyles((theme) => ({
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
  inputStartIcon: {
    marginRight: theme.spacing(1.25),
    color: 'gray',
  },
  button: {
    marginTop: 20,
    width: '100%',
  },
}))

const Registration = () => {
  const classes = useStyles()
  const dispatch = useDispatch()

  const handleSubmit = (values: IProfile) => {
    dispatch(addUser(values))
  }

  return (
    <Grid container direction="column" justify="center" alignItems="center">
      <HeaderLayout />
      <h3 className={classes.h3}>Регистрация</h3>
      <RegistrationReduxForm onSubmit={handleSubmit} />
      <NavLink to="/auth" className={classes.link}>
        Перейти на страницу авторизации
      </NavLink>
    </Grid>
  )
}

const RegistrationForm: React.FC<InjectedFormProps<IProfile>> = ({ handleSubmit }) => {
  const classes = useStyles()
  return (
    <form className={classes.form} onSubmit={handleSubmit}>
      <Field
        name="lastname"
        component={Input}
        label="Фамилия"
        required
      />
      <Field
        name="firstname"
        component={Input}
        label="Имя"
        required
      />
      <Field
        name="middlename"
        component={Input}
        label="Отчество"
        required
      />
      <Field
        name="email"
        component={Input}
        validate={[isEmailValid]}
        label="Электронная почта (email)"
        placeholder="Электронная почта"
        adornment={
          <InputAdornment position="start">
            <EmailIcon className={classes.inputStartIcon} />
          </InputAdornment>
        }
        required
      />
      <Field
        name="phone"
        component={MaskedInput}
        mask={`8(999)-999-99-99`}
        validate={[isStringContainsUnderscore]}
        label="Телефон"
        placeholder="Телефон"
        adornment={
          <InputAdornment position="start">
            <PhoneIcon className={classes.inputStartIcon} />
          </InputAdornment>
        }
      />
      <Field
        name="snils"
        component={MaskedInput}
        mask={`999-999-999-99`}
        validate={[isStringContainsUnderscore]}
        label="СНИЛС"
      />
      <Field
        name="birthdate"
        component={DateInput}
        parse={parseDate}
        views={['year', 'date']}
        maxDate={new Date()}
        dateformat="DD-MM-YYYY"
        placeholder="дд-мм-гггг"
        label="Дата рождения"
      />
      <Button
        type="submit"
        className={classes.button}
        variant="contained"
        color="primary"
        startIcon={<SaveIcon />}
      >
        Сохранить
      </Button>
    </form>
  )
}

const RegistrationReduxForm = reduxForm<IProfile>({
  form: 'registrationForm'
})(RegistrationForm)

export default Registration
