import React from 'react'
import { Field, reduxForm } from 'redux-form'
import { useDispatch, useSelector } from 'react-redux'
import {
  Grid,
  IconButton,
  Button,
  InputAdornment,
  Typography,
  FormGroup,
  FormControlLabel,
  Switch,
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

const FactAddress = () => {
  const classes = useStyles()
  const dispatch = useDispatch()
  const data = useSelector((state) => state.listenerData)
  const [isAddressesEqual, setAddressesEqual] = React.useState(false)

  React.useEffect(() => {
    dispatch(requestListenerData(data.selectedTab))
  }, [dispatch, data.selectedTab])

  const handleSwitch = (checked) => {
    setAddressesEqual(checked)
  }

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
          Адрес проживания
        </Typography>
        <HtmlTooltip
          title={
            <>
              <span>
                Если адрес проживания совпадает с адресом регистрации, щелкните
                по переключателю "Cовпадает с адресом регистрации", адрес
                проживания автоматически заполнится. Если адрес проживания
                отличается от адреса регистрации, выключите опцию "Cовпадает с
                адресом регистрации", щелкнув мышью (поля ввода станут доступны
                для изменения)
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
      <FactAddressForm
        onSubmit={handleSubmit}
        initialValues={
          !isAddressesEqual ? data.list.fact : data.list.registration
        }
        disableFields={!isAddressesEqual ? 0 : 1}
        isAddressesEqual={isAddressesEqual}
        handleSwitch={handleSwitch}
      />
    </>
  )
}

let FactAddressForm = (props) => {
  const classes = useStyles()
  const disable = props.disableFields ? true : false

  return (
    <form onSubmit={props.handleSubmit}>
      <Grid
        container
        direction="column"
        justify="center"
        alignItems="flex-start"
      >
        <FormGroup row>
          <FormControlLabel
            control={
              <Switch
                checked={props.isAddressesEqual}
                onChange={(e) => props.handleSwitch(e.target.checked)}
                color="primary"
              />
            }
            label="Совпадает с адресом регистрации"
          />
        </FormGroup>
        <Field
          name="country"
          label="Страна"
          component={Input}
          disabled={disable}
        />
        <Field
          name="region"
          label="Регион (область, край)"
          component={Input}
          disabled={disable}
        />
        <Field
          name="locality"
          label="Населённый пункт"
          component={Input}
          adornment={<InputAdornment>{localityTooltip}</InputAdornment>}
          disabled={disable}
        />
        <Field
          name="localityType"
          label="Тип населённого пункта"
          component={Select}
          disabled={disable}
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
          disabled={disable}
        />
        <Field
          name="street"
          label="Улица"
          component={Input}
          disabled={disable}
          adornment={<InputAdornment>{streetTooltip}</InputAdornment>}
        />
        <Field name="house" label="Дом" component={Input} disabled={disable} />
        <Field
          name="room"
          label="Квартира"
          component={Input}
          disabled={disable}
        />
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

FactAddressForm = reduxForm({
  form: 'factAddressForm',
  enableReinitialize: true,
})(FactAddressForm)

export default FactAddress
