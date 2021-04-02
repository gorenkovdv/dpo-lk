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
  GridDirection,
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
import { actions } from '../../../store/reducers/snackbar'
import { red } from '@material-ui/core/colors'
import moment from 'moment'
import 'moment/locale/ru'
import { WrappedFieldProps } from 'redux-form'

const useStyles = makeStyles((theme) => ({
  textField: {
    boxSizing: 'border-box',
    width: '100%',
  },
  button: {
    marginRight: theme.spacing(1),
  },
  fileLabel: {
    margin: theme.spacing(0, 0.75, 0, 1.25),
    display: 'inline-block',
    fontSize: '0.75em',
    color: 'rgba(0, 0, 0, 0.87)',
  },
}))

moment.locale('ru')

type MarginType = 'dense' | 'none' | 'normal'

interface IInputProps {
  margin?: MarginType,
  adornment?: JSX.Element,
  endadornment?: JSX.Element,
  readOnly?: boolean,
  type?: string
}

export const Input: React.FC<WrappedFieldProps & IInputProps> = ({ input, meta: { touched, error }, ...props }): JSX.Element => {
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
      InputProps={{
        startAdornment: props.adornment ? props.adornment : null,
        endAdornment: props.endadornment ? props.endadornment : null,
        readOnly: props.readOnly ? props.readOnly : false
      }}
      type={props.type ? props.type : 'text'}
      autoComplete="off"
      variant="outlined"
    />
  )
}

interface ITextareaProps {
  adornment?: JSX.Element
}

export const Textarea: React.FC<WrappedFieldProps & ITextareaProps> = ({ input, ...props }): JSX.Element => {
  const classes = useStyles()
  return (
    <TextField
      {...input}
      {...props}
      className={classes.textField}
      multiline
      rows={2}
      rowsMax={5}
      InputProps={{
        startAdornment: props.adornment ? props.adornment : null
      }}
      autoComplete="off"
      margin="dense"
      variant="outlined"
    />
  )
}

export const Select: React.FC<WrappedFieldProps> = ({ input, children, ...props }): JSX.Element => {
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

interface IMaskedInputProps {
  fullWidth?: boolean
  variant?: any
  label: string
  adornment?: JSX.Element
  inputRef?: any
  mask: string
}

export const MaskedInput: React.FC<WrappedFieldProps & IMaskedInputProps> = ({ input, meta: { touched, error }, mask, ...props }): JSX.Element => {
  const classes = useStyles()
  const hasError = touched && error !== undefined

  let maskProps = { ...props }
  if (maskProps.inputRef) delete maskProps.inputRef

  return (
    <InputMask mask={mask} {...maskProps} {...input}>
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
          InputProps={{
            startAdornment: props.adornment ? props.adornment : null,
          }}
        />
      )}
    </InputMask>
  )
}

interface IPasswordInput {
  label: string
  showpassword?: boolean
  showhandle?: () => void
}

export const PasswordInput: React.FC<WrappedFieldProps & IPasswordInput> = ({ input, ...props }): JSX.Element => {
  const classes = useStyles()

  return (
    <TextField
      {...input}
      label={props.label}
      className={classes.textField}
      type={props.showpassword ? 'text' : 'password'}
      autoComplete="off"
      margin="normal"
      variant="outlined"
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <IconButton size="small" onClick={props.showhandle}>
              {props.showpassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
            </IconButton>
          </InputAdornment>
        ),
      }}
    />
  )
}

interface IDateInputProps {
  maxDate?: string,
  minDate?: string
  autoOk?: boolean,
  classes?: any,
  dateformat: string,
  margin?: MarginType
}

export const DateInput: React.FC<WrappedFieldProps & IDateInputProps> = ({ input, ...props }): JSX.Element => {
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

interface IFileInputProps {
  filetypes?: Array<string>
}

export const FileInput: React.FC<WrappedFieldProps & IFileInputProps> = ({ input, ...props }): JSX.Element => {
  const classes = useStyles()
  const dispatch = useDispatch()

  const handleFileSelect = (file: any) => {
    if (
      file.fileList[0].type !== 'application/pdf' ||
      file.fileList[0].size > 5000000
    )
      dispatch(
        actions.showMessageAction(
          'Ошибка. Загружаемый файл должен иметь PDF формат и размер не более 5 Мб',
          'error'
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

interface ISwitcherProps {
  label: string
}

export const Switcher: React.FC<WrappedFieldProps & ISwitcherProps> = ({ input, ...props }): JSX.Element => {
  return (
    <FormControlLabel
      control={<Switch {...input} checked={input.value} color="primary" />}
      label={props.label}
    />
  )
}

interface IRadioGroupProps {
  direction?: GridDirection
  radios: Array<any>
}

export const RadioGroupContainer: React.FC<WrappedFieldProps & IRadioGroupProps> = ({ input, children, ...props }) => {
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
