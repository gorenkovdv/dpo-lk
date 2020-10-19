import React from 'react'
import { NavLink } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { Field, reduxForm } from 'redux-form'
import { Grid, Button, InputAdornment } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import { Save as SaveIcon, Email as EmailIcon, Phone as PhoneIcon} from '@material-ui/icons'
import HeaderLayout from '../Commons/Header/HeaderLayout'
import { Input, MaskedInput, DateInput } from '../Commons/FormsControls/FormsControls'
import { isEmailValid, isStringContainsUnderscore } from '../../utils/validate.js'
import { parseDate } from '../../utils/parse.js'
import allActions from '../../store/actions'
import styles from '../../styles.js'

const useStyles = makeStyles(theme => ({ ...styles(theme) }))

const Registration = () => {
  const classes = useStyles()
  const dispatch = useDispatch()
  const actions = allActions.regActions

  const handleSubmit = values => {
    dispatch(actions.addUser(values))
  }

  return (
    <Grid container direction="column" justify="center" alignItems="center">
      <HeaderLayout />
      <h3 className={classes.h3}>Регистрация</h3>
      <RegistrationForm onSubmit={handleSubmit}/>
      <NavLink to="/auth" className={classes.link}>
        Перейти на страницу авторизации
      </NavLink>
    </Grid>
  )
}

let RegistrationForm = props => {
  const classes = useStyles()
  return(
    <form className={classes.form} onSubmit={props.handleSubmit}>
      <Field
        name="lastName"
        component={Input}
        label="Фамилия"
        required
      />
      <Field
        name="firstName"
        component={Input}
        label="Имя"
        required
      />
      <Field
        name="middleName"
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
          <InputAdornment>
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
          <InputAdornment>
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
        name="birthDate"
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

RegistrationForm = reduxForm({ form: 'registrationForm' })(RegistrationForm)

export default Registration
