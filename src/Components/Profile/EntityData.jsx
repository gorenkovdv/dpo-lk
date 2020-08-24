import React, { useEffect } from 'react'
import { Redirect, withRouter } from 'react-router-dom'
import { compose } from 'redux'
import { Field, reduxForm } from 'redux-form'
import { useDispatch, useSelector } from 'react-redux'
import {
  Grid,
  Typography,
  InputAdornment,
  MenuItem,
  Button,
} from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import { Save as SaveIcon } from '@material-ui/icons'
import {
  Input,
  MaskedInput,
  Textarea,
  Select,
} from '../Commons/FormsControls/FormsControls'
import {
  localityTooltip,
  streetTooltip,
} from '../Commons/Tooltips/AddressTooltips'
import LoaderLayout from '../Commons/Loader/LoaderLayout'
import MainLayout from '../Main/MainLayout'
import withAuth from '../Authorization/withAuth'
import allActions from '../../store/actions'
import styles from '../../styles.js'

const useStyles = makeStyles((theme) => ({
  ...styles(theme),
  button: { ...styles(theme).documentButton },
}))

const EntityData = (props) => {
  const dispatch = useDispatch()
  const data = useSelector((state) => state.entityData)
  const actions = allActions.entityDataActions

  useEffect(() => {
    dispatch(actions.requestEntityData())
  }, [dispatch, actions])

  const handleSubmit = (values) => {
    dispatch(actions.updateEntityData(values))
  }

  if (props.pagesType === 'listener') return <Redirect to="/listener/data" />

  if (data.isLoading)
    return (
      <Grid container direction="row" justify="center">
        <LoaderLayout />
      </Grid>
    )

  return data.list.roots ? (
    <EntityDataForm onSubmit={handleSubmit} initialValues={data.list} />
  ) : (
    <Typography>У Вас нет прав на редактирование данной формы</Typography>
  )
}

let EntityDataForm = (props) => {
  const classes = useStyles()
  return (
    <form onSubmit={props.handleSubmit}>
      <Field
        name="position"
        label="Должность представителя"
        component={Input}
      />
      <Typography className={classes.h6} variant="h6">
        Реквизиты юридического лица
      </Typography>
      <Field
        name="organization"
        label="Полное наименование организации"
        component={Textarea}
      />
      <Field
        name="CTMU"
        label="Код ОКТМО"
        mask={`99999999999`}
        component={MaskedInput}
      />
      <Field
        name="ITN"
        label="ИНН"
        mask={`99999999999`}
        component={MaskedInput}
      />
      <Field
        name="IEC"
        label="КПП"
        mask={`9999999999`}
        component={MaskedInput}
      />
      <Typography className={classes.h6} variant="h6">
        Юридический адрес
      </Typography>
      <Field name="country" label="Страна" component={Input} />
      <Field name="region" label="Регион (область, край)" component={Input} />
      <Field
        name="locality"
        label="Населённый пункт"
        component={Input}
        adornment={{
          startAdornment: <InputAdornment>{localityTooltip}</InputAdornment>,
        }}
      />
      <Field
        name="localityType"
        label="Тип населённого пункта"
        component={Select}
      >
        <MenuItem value="">
          <em>Не указано</em>
        </MenuItem>
        <MenuItem value="0">Город</MenuItem>
        <MenuItem value="1">Село</MenuItem>
      </Field>
      <Field
        name="postcode"
        label="Почтовый индекс"
        mask={`999999`}
        component={MaskedInput}
      />
      <Field
        name="street"
        label="Улица"
        component={Input}
        adornment={{
          startAdornment: <InputAdornment>{streetTooltip}</InputAdornment>,
        }}
      />
      <Field name="house" label="Номер дома" component={Input} />
      <Field
        name="workPhone"
        label="Рабочий телефон"
        mask={`8(999)9999999`}
        component={MaskedInput}
      />
      <Field
        name="hrPhone"
        label="Телефон отдела кадров"
        mask={`8(999)9999999`}
        component={MaskedInput}
      />
      <Typography className={classes.h6} variant="h6">
        Банк
      </Typography>
      <Field name="bank" label="Наименование" component={Textarea} />
      <Field
        name="BIC"
        label="БИК"
        mask={`999999999`}
        component={MaskedInput}
      />
      <Field
        name="checkAcc"
        label="Счёт"
        mask={`99999999999999999999`}
        component={MaskedInput}
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

EntityDataForm = reduxForm({ form: 'entityDataForm' })(EntityDataForm)

export default compose(withAuth, withRouter, MainLayout)(EntityData)
