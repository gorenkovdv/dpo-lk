import React from 'react'
import { Field, InjectedFormProps, reduxForm } from 'redux-form'
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
import { getRegAddress, getSelectedTab } from '../../../store/selectors/listener'
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

const RegAddress: React.FC = () => {
  const classes = useStyles()
  const dispatch = useDispatch()
  const data = useSelector(getRegAddress)
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
      <RegAddressReduxForm
        onSubmit={handleSubmit}
        initialValues={data}
      />
    </>
  )
}

const RegAddressForm: React.FC<InjectedFormProps<IAddress>> = ({ handleSubmit }) => {
  const classes = useStyles()
  return (
    <form onSubmit={handleSubmit}>
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
          mask={`999999`}
          label="Почтовый индекс"
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

const RegAddressReduxForm = reduxForm<IAddress>({
  form: 'regAddressForm',
  enableReinitialize: true,
})(RegAddressForm)

export default RegAddress
