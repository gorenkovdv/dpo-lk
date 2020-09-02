import React from 'react'
import { useDispatch } from 'react-redux'
import ReactFileReader from 'react-file-reader'
import InputMask from 'react-input-mask'
import {
  Grid,
  TextField,
  Button,
  InputAdornment,
  IconButton,
  FormControlLabel,
  Switch,
  Radio,
  RadioGroup,
} from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from '@material-ui/pickers'
import MomentUtils from '@date-io/moment'
import {
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  CloudUpload as CloudUploadIcon,
  HighlightOff as DropIcon,
} from '@material-ui/icons'
import actions from '../../../store/actions/snackbarActions'
import { red } from '@material-ui/core/colors'
import * as moment from 'moment'
import 'moment/locale/ru'

const useStyles = makeStyles((theme) => ({
  textField: {
    boxSizing: 'border-box',
    width: '100%',
  },
  button: {
    marginRight: theme.spacing(1),
  },
}))

moment.locale('ru')

export const Input = ({ input, meta: { touched, error }, ...props }) => {
  const hasError = touched && error !== undefined
  const classes = useStyles()
  return (
    <TextField
      {...input}
      {...props}
      className={classes.textField}
      error={hasError}
      helperText={hasError && error}
      margin={props.margin ? props.margin : 'dense'}
      InputProps={props.adornment ? props.adornment : null}
      type={props.type ? props.type : 'text'}
      autoComplete="off"
      variant="outlined"
    />
  )
}

export const Textarea = ({ input, ...props }) => {
  const classes = useStyles()
  return (
    <TextField
      {...input}
      {...props}
      className={classes.textField}
      multiline
      rows={2}
      rowsMax={5}
      InputProps={props.adornment ? props.adornment : null}
      autoComplete="off"
      margin="dense"
      variant="outlined"
    />
  )
}

export const Select = ({ input, children, ...props }) => {
  const classes = useStyles()
  return (
    <TextField
      {...input}
      {...props}
      select
      autoComplete="off"
      variant="outlined"
      margin="dense"
      className={classes.textField}
    >
      {children}
    </TextField>
  )
}

export const MaskedInput = ({ input, meta: { touched, error }, ...props }) => {
  const classes = useStyles()
  const hasError = touched && error !== undefined

  let maskProps = { ...props }
  if (maskProps.inputRef) delete maskProps.inputRef

  return (
    <InputMask {...maskProps} {...input}>
      {() => (
        <TextField
          {...props}
          error={hasError}
          fullWidth={props.fullWidth ? props.fullWidth : false}
          className={classes.textField}
          helperText={hasError && error}
          autoComplete="off"
          margin="dense"
          variant={props.variant ? props.variant : 'outlined'}
          label={props.label}
          InputProps={props.adornment ? props.adornment : null}
        />
      )}
    </InputMask>
  )
}

export const PasswordInput = ({ input, ...props }) => {
  const classes = useStyles()
  const [showPassword, setShowPassword] = React.useState(false)

  const handleShowPassword = () => {
    setShowPassword(!showPassword)
  }

  return (
    <TextField
      {...input}
      {...props}
      className={classes.textField}
      type={showPassword ? 'text' : 'password'}
      autoComplete="off"
      margin="normal"
      variant="outlined"
      label={props.label}
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <IconButton size="small" onClick={handleShowPassword}>
              {showPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
            </IconButton>
          </InputAdornment>
        ),
      }}
    />
  )
}

export const DateInput = ({ input, ...props }) => {
  const maxDate = props.maxDate
    ? `${moment(props.maxDate).format('YYYY-MM-DD')}`
    : '2100-01-01'

  const minDate = props.minDate
    ? `${moment(props.minDate).format('YYYY-MM-DD')}`
    : '1900-01-01'

  const classes = useStyles()
  return (
    <MuiPickersUtilsProvider utils={MomentUtils} locale={`ru`}>
      <KeyboardDatePicker
        {...input}
        {...props}
        autoOk={props.autoOk ? props.autoOk : true}
        variant="inline"
        openTo="year"
        value={input.value || null}
        className={props.classes ? props.classes : classes.textField}
        maskChar={'0'}
        format={props.dateformat}
        invalidDateMessage="Неверный формат даты"
        maxDateMessage={`Дата не должна быть позднее максимальной (${maxDate})`}
        minDateMessage={`Дата не должна быть ранее минимальной (${minDate})`}
        inputVariant="outlined"
        margin={props.margin ? props.margin : 'dense'}
        InputAdornmentProps={{ position: 'start' }}
        KeyboardButtonProps={{ size: 'small' }}
      />
    </MuiPickersUtilsProvider>
  )
}

export const FileInput = ({ input, ...props }) => {
  const classes = useStyles()
  const dispatch = useDispatch()

  const handleFileSelect = (file) => {
    if (
      file.fileList[0].type !== 'application/pdf' ||
      file.fileList[0].size > 5000000
    )
      dispatch(
        actions.showError(
          'Ошибка. Загружаемый файл должен иметь PDF формат и размер не более 5 Мб'
        )
      )
    else
      input.onChange({ fileName: file.fileList[0].name, base64: file.base64 })
  }

  const handleFileDrop = () => {
    input.onChange(null)
  }

  return (
    <Grid
      container
      style={{ marginTop: 10 }}
      direction="row"
      justify="flex-start"
      alignItems="center"
    >
      <ReactFileReader
        fileTypes={props.filetypes}
        base64={true}
        multipleFiles={false}
        handleFiles={handleFileSelect}
      >
        <Button
          className={classes.button}
          variant="contained"
          color="primary"
          startIcon={<CloudUploadIcon />}
        >
          Загрузить файл
        </Button>
      </ReactFileReader>
      <Grid
        container
        style={{ width: 'auto' }}
        direction="row"
        justify="center"
        alignItems="center"
      >
        {input.value ? (
          <>
            <span className={classes.fileLabel}>{input.value.fileName}</span>
            <IconButton size="small" onClick={handleFileDrop}>
              <DropIcon style={{ color: red.A700 }} />
            </IconButton>
          </>
        ) : (
          <span className={classes.fileLabel}>Файл не загружен</span>
        )}
      </Grid>
    </Grid>
  )
}

export const Switcher = ({ input, ...props }) => {
  return (
    <FormControlLabel
      control={<Switch {...input} checked={input.value} color="primary" />}
      label={props.label}
    />
  )
}

export const RadioGroupContainer = ({ input, children, ...props }) => {
  return (
    <RadioGroup {...input}>
      <Grid container direction={props.direction ? props.direction : 'column'}>
        {props.radios.map((radio, index) => {
          return (
            <Grid item key={index}>
              <FormControlLabel
                value={radio.value}
                control={<Radio color="primary" />}
                label={radio.label}
              />
            </Grid>
          )
        })}
      </Grid>
    </RadioGroup>
  )
}
