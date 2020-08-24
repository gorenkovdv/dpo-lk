import React from 'react'
import { Field, reduxForm } from 'redux-form'
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
import allActions from '../../../store/actions'
import { parseDate } from '../../../utils/parse.js'
import styles from '../../../styles.js'

const useStyles = makeStyles((theme) => ({
  ...styles(theme),
  button: { ...styles(theme).documentButton },
}))

const Passport = () => {
  const classes = useStyles()
  const dispatch = useDispatch()
  const data = useSelector((state) => state.listenerData)
  const actions = allActions.listenerDataActions

  React.useEffect(() => {
    dispatch(actions.requestListenerData(data.selectedTab))
  }, [dispatch, actions, data.selectedTab])

  const handleSubmit = (values) => {
    dispatch(
      allActions.listenerDataActions.updateData(values, data.selectedTab)
    )
  }

  if (data.isLoading)
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
      <PassportDataForm
        onSubmit={handleSubmit}
        initialValues={data.list.passport}
      />
    </>
  )
}

let PassportDataForm = (props) => {
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

PassportDataForm = reduxForm({
  form: 'passportDataForm',
  enableReinitialize: true,
})(PassportDataForm)

export default Passport
