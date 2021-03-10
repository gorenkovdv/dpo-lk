import React from 'react'
import { Field, reduxForm } from 'redux-form'
import { useDispatch, useSelector } from 'react-redux'
import {
  Grid,
  IconButton,
  Button,
  InputAdornment,
  Typography,
  MenuItem,
} from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import { Help as HelpIcon, Save as SaveIcon } from '@material-ui/icons'
import LoaderLayout from '../../Commons/Loader/LoaderLayout'
import HtmlTooltip from '../../Commons/Tooltips/HtmlTooltip'
import {
  Input,
  MaskedInput,
  Select,
} from '../../Commons/FormsControls/FormsControls'
import {
  localityTooltip,
  streetTooltip,
} from '../../Commons/Tooltips/AddressTooltips'
import { requestListenerData, updateData } from '../../../store/reducers/listenerData'
import styles from '../../../styles'

const useStyles = makeStyles((theme) => ({
  ...styles(theme),
  button: { ...styles(theme).documentButton },
}))

const RegAddress = () => {
  const classes = useStyles()
  const dispatch = useDispatch()
  const data = useSelector((state) => state.listenerData)

  React.useEffect(() => {
    dispatch(requestListenerData(data.selectedTab))
  }, [dispatch, data.selectedTab])

  const handleSubmit = (values) => {
    dispatch(updateData(values, data.selectedTab))
  }

  if (data.isLoading)
    return (
      <Grid container direction="row" justify="center">
        <LoaderLayout />
      </Grid>
    )

  return (
    <>
      <Grid container direction="row" alignItems="center">
        <Typography className={classes.h6} variant="h6">
          Адрес регистрации
        </Typography>
        <HtmlTooltip
          title={
            <>
              <span>
                Адрес регистрации заполняется в<br />
                соответствии с отметкой в паспорте или
                <br />
                ином подтверждающем документе
              </span>
            </>
          }
        >
          <IconButton
            className={classes.iconTitle}
            size="small"
            aria-label="delete"
          >
            <HelpIcon />
          </IconButton>
        </HtmlTooltip>
      </Grid>
      <RegAddressForm
        onSubmit={handleSubmit}
        initialValues={data.list.registration}
      />
    </>
  )
}

let RegAddressForm = (props) => {
  const classes = useStyles()
  return (
    <form onSubmit={props.handleSubmit}>
      <Grid
        container
        direction="column"
        justify="center"
        alignItems="flex-start"
      >
        <Field name="country" label="Страна" component={Input} />
        <Field name="region" label="Регион (область, край)" component={Input} />
        <Field
          name="locality"
          label="Населённый пункт"
          component={Input}
          adornment={<InputAdornment>{localityTooltip}</InputAdornment>}
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
          mask={`999999`}
          label="Почтовый индекс"
          component={MaskedInput}
        />
        <Field
          name="street"
          label="Улица"
          component={Input}
          adornment={<InputAdornment>{streetTooltip}</InputAdornment>}
        />
        <Field name="house" label="Дом" component={Input} />
        <Field name="room" label="Квартира" component={Input} />
      </Grid>
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

RegAddressForm = reduxForm({
  form: 'regAddressForm',
  enableReinitialize: true,
})(RegAddressForm)

export default RegAddress
