import React, { useEffect } from 'react'
import { Redirect, withRouter } from 'react-router-dom'
import { compose } from 'redux'
import { Field, InjectedFormProps, reduxForm } from 'redux-form'
import { useDispatch, useSelector } from 'react-redux'
import { Typography, InputAdornment, MenuItem, Button } from '@material-ui/core'
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
import MainLayout from '../Main/MainLayout'
import withAuth from '../Authorization/withAuth'
import { requestEntityData, updateEntityData } from '../../store/reducers/entityData'
import { getIsLoading } from '../../store/selectors/loader'
import { getEntityData } from '../../store/selectors/entity'
import { IEntityDataList } from '../../store/reducers/entityData'

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

const EntityData: React.FC<{ pagesType: string }> = ({ pagesType }) => {
  const dispatch = useDispatch()
  const isLoading = useSelector(getIsLoading)
  const data = useSelector(getEntityData)

  useEffect(() => {
    dispatch(requestEntityData())
  }, [dispatch])

  const handleSubmit = (values: IEntityDataList) => {
    dispatch(updateEntityData(values))
  }

  if (pagesType === 'listener') return <Redirect to="/listener/data" />

  if (isLoading) return null

  return data.roots ? (
    <EntityDataReduxForm onSubmit={handleSubmit} initialValues={data} />
  ) : (
    <Typography>У Вас нет прав на редактирование данной формы</Typography>
  )
}

const EntityDataForm: React.FC<InjectedFormProps<IEntityDataList>> = ({ handleSubmit }) => {
  const classes = useStyles()
  return (
    <form onSubmit={handleSubmit}>
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
      <Field
        name="country"
        label="Страна"
        component={Input}
      />
      <Field
        name="region"
        label="Регион (область, край)"
        component={Input}
      />
      <Field
        name="locality"
        label="Населённый пункт"
        component={Input}
        adornment={
          <InputAdornment position="start">
            {localityTooltip}
          </InputAdornment>
        }
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
        adornment={
          <InputAdornment position="start">
            {streetTooltip}
          </InputAdornment>
        }
      />
      <Field
        name="house"
        label="Номер дома"
        component={Input}
      />
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
      <Field
        name="bank"
        label="Наименование"
        component={Textarea} />
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

const EntityDataReduxForm = reduxForm<IEntityDataList>({
  form: 'entityDataForm'
})(EntityDataForm)

export default compose(withAuth, withRouter, MainLayout)(EntityData)
