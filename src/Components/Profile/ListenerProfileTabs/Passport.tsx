import React from 'react'
import { Field, InjectedFormProps, reduxForm } from 'redux-form'
import { useDispatch, useSelector } from 'react-redux'
import { Grid, Button, Typography } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import { Save as SaveIcon } from '@material-ui/icons'
import {
  Textarea,
  MaskedInput,
  DateInput,
} from '../../Commons/FormsControls/FormsControls'
import LoaderLayout from '../../Commons/Loader/LoaderLayout'
import { requestListenerData, updateData } from '../../../store/reducers/listenerData'
import { getPassportData, getSelectedTab } from '../../../store/selectors/listener'
import { getIsLoading } from '../../../store/selectors/loader'
import { parseDate } from '../../../utils/parse'
import { IPassport } from '../../../types'

const useStyles = makeStyles((theme) => ({
  button: {
    marginTop: 20,
    width: '100%',
    maxWidth: 250,
    [theme.breakpoints.down('xs')]: {
      maxWidth: '100%',
    },
  },
  h6: {
    margin: theme.spacing(1.25, 0),
  },
}))

const Passport: React.FC = () => {
  const classes = useStyles()
  const dispatch = useDispatch()
  const data = useSelector(getPassportData)
  const selectedTab = useSelector(getSelectedTab)
  const isLoading = useSelector(getIsLoading)

  React.useEffect(() => {
    dispatch(requestListenerData(selectedTab))
  }, [dispatch, selectedTab])

  const handleSubmit = (values: any) => {
    dispatch(updateData(values, selectedTab))
  }

  if (isLoading)
    return (
      <Grid container direction="row" justify="center">
        <LoaderLayout />
      </Grid>
    )

  return (
    <>
      <Typography className={classes.h6} variant="h6">
        Паспорт
      </Typography>
      <PassportDataReduxForm
        onSubmit={handleSubmit}
        initialValues={data}
      />
    </>
  )
}

const PassportDataForm: React.FC<InjectedFormProps<IPassport>> = (props) => {
  const classes = useStyles()

  return (
    <form onSubmit={props.handleSubmit}>
      <Field
        name="series"
        label="Серия"
        mask={`9999`}
        component={MaskedInput}
      />
      <Field
        name="number"
        label="Номер"
        mask={`999999`}
        component={MaskedInput}
      />
      <Field name="issuedBy" label="Выдан" component={Textarea} />
      <Field
        name="unitCode"
        label="Код подразделения"
        mask={`999-999`}
        component={MaskedInput}
      />
      <Field
        name="issuedDate"
        label="Дата выдачи"
        parse={parseDate}
        views={['year', 'date']}
        maxDate={new Date()}
        dateformat="DD-MM-YYYY"
        placeholder="дд-мм-гггг"
        component={DateInput}
      />
      <Field name="birthPlace" label="Место рождения" component={Textarea} />
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

const PassportDataReduxForm = reduxForm<IPassport>({
  form: 'passportDataForm',
  enableReinitialize: true,
})(PassportDataForm)

export default Passport
