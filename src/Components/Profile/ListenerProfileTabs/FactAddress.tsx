import React from 'react'
import { Field, InjectedFormProps, reduxForm } from 'redux-form'
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
import { getFactAddress, getRegAddress, getSelectedTab } from '../../../store/selectors/listener'
import { getIsLoading } from '../../../store/selectors/loader'
import { IAddress } from '../../../types'

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
  iconTitle: {
    marginLeft: theme.spacing(1.25),
  },
}))

const FactAddress: React.FC = () => {
  const classes = useStyles()
  const dispatch = useDispatch()
  const factAddress = useSelector(getFactAddress)
  const regAddress = useSelector(getRegAddress)
  const selectedTab = useSelector(getSelectedTab)
  const isLoading = useSelector(getIsLoading)
  const [isAddressesEqual, setAddressesEqual] = React.useState(false)

  React.useEffect(() => {
    dispatch(requestListenerData(selectedTab))
  }, [dispatch, selectedTab])

  const handleSwitch = (checked: boolean) => {
    setAddressesEqual(checked)
  }

  const handleSubmit = (values: IAddress) => {
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
      <FactAddressReduxForm
        onSubmit={handleSubmit}
        initialValues={
          !isAddressesEqual ? factAddress : regAddress
        }
        isAddressesEqual={isAddressesEqual}
        handleSwitch={handleSwitch}
      />
    </>
  )
}

interface IProps {
  isAddressesEqual: boolean
  handleSwitch: (checked: boolean) => void
}

const FactAddressForm: React.FC<InjectedFormProps<IAddress, IProps> & IProps> = ({
  handleSubmit,
  handleSwitch,
  isAddressesEqual
}) => {
  const classes = useStyles()

  return (
    <form onSubmit={handleSubmit}>
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
                checked={isAddressesEqual}
                onChange={(e) => handleSwitch(e.target.checked)}
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
          disabled={isAddressesEqual}
        />
        <Field
          name="region"
          label="Регион (область, край)"
          component={Input}
          disabled={isAddressesEqual}
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
          disabled={isAddressesEqual}
        />
        <Field
          name="localityType"
          label="Тип населённого пункта"
          component={Select}
          disabled={isAddressesEqual}
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
          disabled={isAddressesEqual}
        />
        <Field
          name="street"
          label="Улица"
          component={Input}
          disabled={isAddressesEqual}
          adornment={
            <InputAdornment position="start">
              {streetTooltip}
            </InputAdornment>
          }
        />
        <Field
          name="house"
          label="Дом"
          component={Input}
          disabled={isAddressesEqual}
        />
        <Field
          name="room"
          label="Квартира"
          component={Input}
          disabled={isAddressesEqual}
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

const FactAddressReduxForm = reduxForm<IAddress, IProps>({
  form: 'factAddressForm',
  enableReinitialize: true,
})(FactAddressForm)

export default FactAddress
