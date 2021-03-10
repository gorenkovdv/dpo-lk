import React, { useEffect } from 'react'
import { withRouter } from 'react-router-dom'
import { compose } from 'redux'
import { Field, reduxForm } from 'redux-form'
import { useDispatch, useSelector } from 'react-redux'
import {
  Button,
  Typography,
  InputAdornment,
  TextField,
} from '@material-ui/core'
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
  isStringContainsUnderscore
} from '../../utils/validate'
import { parseDate } from '../../utils/parse'
import { requestProfile, updateProfile } from '../../store/reducers/profile'
import styles from '../../styles'

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

  const title =
    props.pagesType === 'listener'
      ? 'Регистрационные данные слушателя'
      : 'Регистрационные данные представителя юридического лица'

  useEffect(() => {
    dispatch(requestProfile())
  }, [dispatch])

  const handleSubmit = (values) => {
    dispatch(updateProfile(values))
  }

  if (isLoading) return null

  return (
    <>
      <Typography className={classes.h6} variant="h6">
        {title}
      </Typography>
      <TextField
        margin="dense"
        autoComplete="off"
        variant="outlined"
        label="Фамилия"
        value={data.list.lastname}
        className={classes.textField}
      />
      <TextField
        margin="dense"
        autoComplete="off"
        variant="outlined"
        label="Имя"
        value={data.list.firstname}
        className={classes.textField}
      />
      <TextField
        margin="dense"
        autoComplete="off"
        variant="outlined"
        label="Отчество"
        value={data.list.middlename}
        className={classes.textField}
      />
      <ProfileForm onSubmit={handleSubmit} initialValues={data.list} />
    </>
  )
}

let ProfileForm = (props) => {
  const classes = useStyles()
  return (
    <form onSubmit={props.handleSubmit}>
      <>
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
          validate={[isStringContainsUnderscore]}
          mask={`8(999)9999999`}
          label="Телефон"
          placeholder="Телефон"
          adornment={
            <InputAdornment>
              <PhoneIcon className={classes.inputStartIcon} />
            </InputAdornment>
          }
          required
        />
        <Field
          name="snils"
          component={MaskedInput}
          validate={[isStringContainsUnderscore]}
          mask={`99999999999`}
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
