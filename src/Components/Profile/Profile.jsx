import React, { useEffect } from 'react'
import { withRouter } from 'react-router-dom'
import { compose } from 'redux'
import { Field, reduxForm } from 'redux-form'
import { useDispatch, useSelector } from 'react-redux'
import { Button, Typography, InputAdornment } from '@material-ui/core'
import {
  Save as SaveIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
} from '@material-ui/icons'
import { makeStyles } from '@material-ui/core/styles'
import MainLayout from '../Main/MainLayout'
import withAuth from '../Authorization/withAuth'
import {
  Input,
  MaskedInput,
  DateInput,
} from '../Commons/FormsControls/FormsControls'
import {
  isEmailValid,
  isStringContainsUnderscore,
} from '../../utils/validate.js'
import { parseDate } from '../../utils/parse.js'
import allActions from '../../store/actions'
import styles from '../../styles.js'

const useStyles = makeStyles((theme) => ({
  ...styles(theme),
  button: {
    ...styles(theme).button,
    maxWidth: 250,
  },
}))

const Profile = (props) => {
  const classes = useStyles()
  const dispatch = useDispatch()
  const isLoading = useSelector((state) => state.loader.isLoading)
  const data = useSelector((state) => state.profile)
  const actions = allActions.profileActions

  const title =
    props.pagesType === 'listener'
      ? 'Регистрационные данные слушателя'
      : 'Регистрационные данные представителя юридического лица'

  useEffect(() => {
    dispatch(actions.requestProfile())
  }, [dispatch, actions])

  const handleSubmit = (values) => {
    if (
      !(values.lastName && values.lastName.length) &&
      !(values.middleName && values.middleName.length)
    )
      dispatch(actions.showError('Необходимо указать фамилию или отчество'))
    else dispatch(actions.updateProfile(values))
  }

  if (isLoading) return null

  return (
    <>
      <Typography className={classes.h6} variant="h6">
        {title}
      </Typography>
      <ProfileForm onSubmit={handleSubmit} initialValues={data.list} />
    </>
  )
}

let ProfileForm = (props) => {
  const classes = useStyles()
  return (
    <form onSubmit={props.handleSubmit}>
      <>
        <Field name="lastName" component={Input} label="Фамилия" />
        <Field name="firstName" component={Input} label="Имя" required />
        <Field name="middleName" component={Input} label="Отчество" />
        <Field
          name="email"
          component={Input}
          validate={[isEmailValid]}
          label="Электронная почта (email)"
          placeholder="Электронная почта"
          adornment={{
            startAdornment: (
              <InputAdornment>
                <EmailIcon className={classes.inputStartIcon} />
              </InputAdornment>
            ),
          }}
          required
        />
        <Field
          name="phone"
          component={MaskedInput}
          validate={[isStringContainsUnderscore]}
          mask={`8(999)9999999`}
          label="Телефон"
          placeholder="Телефон"
          adornment={{
            startAdornment: (
              <InputAdornment>
                <PhoneIcon className={classes.inputStartIcon} />
              </InputAdornment>
            ),
          }}
          required
        />
        <Field
          name="snils"
          component={MaskedInput}
          validate={[isStringContainsUnderscore]}
          mask={`99999999999`}
          label="СНИЛС"
          required
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
      </>
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

ProfileForm = reduxForm({ form: 'profileForm' })(ProfileForm)

export default compose(withAuth, withRouter, MainLayout)(Profile)
