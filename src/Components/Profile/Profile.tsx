import React, { useEffect } from 'react'
import { withRouter } from 'react-router-dom'
import { compose } from 'redux'
import { Field, InjectedFormProps, reduxForm } from 'redux-form'
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
import { getIsLoading } from '../../store/selectors/loader'
import { getProfile } from '../../store/selectors/profile'

const useStyles = makeStyles((theme) => ({
  button: {
    marginTop: 20,
    width: '100%',
    maxWidth: 250,
  },
  h6: {
    margin: theme.spacing(1.25, 0),
  },
  textField: {
    boxSizing: 'border-box',
    width: '100%',
  },
  inputStartIcon: {
    marginRight: theme.spacing(1.25),
    color: 'gray',
  },
}))

interface IProps {
  pagesType: string
}

const Profile: React.FC<IProps> = ({ pagesType }) => {
  const classes = useStyles()
  const dispatch = useDispatch()
  const isLoading = useSelector(getIsLoading)
  const data = useSelector(getProfile)

  const title =
    pagesType === 'listener'
      ? 'Регистрационные данные слушателя'
      : 'Регистрационные данные представителя юридического лица'

  useEffect(() => {
    dispatch(requestProfile())
  }, [dispatch])

  const handleSubmit = (values: IValues) => {
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
        value={data.lastname}
        className={classes.textField}
      />
      <TextField
        margin="dense"
        autoComplete="off"
        variant="outlined"
        label="Имя"
        value={data.firstname}
        className={classes.textField}
      />
      <TextField
        margin="dense"
        autoComplete="off"
        variant="outlined"
        label="Отчество"
        value={data.middlename}
        className={classes.textField}
      />
      <ProfileReduxForm onSubmit={handleSubmit} initialValues={data} />
    </>
  )
}

interface IValues {
  email: string
  phone: string
  snils: string
  birthdate: string
}

const ProfileForm: React.FC<InjectedFormProps<IValues>> = ({ handleSubmit }) => {
  const classes = useStyles()
  return (
    <form onSubmit={handleSubmit}>
      <>
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
          validate={[isStringContainsUnderscore]}
          mask={`8(999)9999999`}
          label="Телефон"
          placeholder="Телефон"
          adornment={
            <InputAdornment position="start">
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

const ProfileReduxForm = reduxForm<IValues>({
  form: 'profileForm',
  enableReinitialize: true
})(ProfileForm)

export default compose(withAuth, withRouter, MainLayout)(Profile)
