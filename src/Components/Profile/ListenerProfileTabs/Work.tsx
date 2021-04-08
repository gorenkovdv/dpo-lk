import React from 'react'
import { Field, InjectedFormProps, reduxForm } from 'redux-form'
import { useDispatch, useSelector } from 'react-redux'
import {
  IconButton,
  Button,
  InputAdornment,
  Grid,
  Typography,
  MenuItem,
  Tooltip,
} from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import {
  Help as HelpIcon,
  Delete as DeleteIcon,
  Save as SaveIcon,
  PictureAsPdf as PdfIcon,
} from '@material-ui/icons'
import HtmlTooltip from '../../Commons/Tooltips/HtmlTooltip'
import {
  localityTooltip,
  streetTooltip,
} from '../../Commons/Tooltips/AddressTooltips'
import {
  Input,
  MaskedInput,
  Select,
  Textarea,
  DateInput,
  FileInput,
} from '../../Commons/FormsControls/FormsControls'
import LoaderLayout from '../../Commons/Loader/LoaderLayout'
import { loadFileTooltip } from '../../Commons/Tooltips/LoadFileTooltip'
import { SAVE_FILES_DIRECTORY } from '../../../store/const'
import { parseMonth } from '../../../utils/parse'
import { requestListenerData, updateData, workFileDelete } from '../../../store/reducers/listenerData'
import { actions as confirmDialogActions } from '../../../store/reducers/confirmDialog'
import { getWorkData, getSelectedTab } from '../../../store/selectors/listener'
import { getIsLoading } from '../../../store/selectors/loader'
import { IWork } from '../../../types'

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
  inputStartIcon: {
    marginRight: theme.spacing(1.25),
    color: 'gray',
  },
  typography: {
    boxSizing: 'border-box',
    padding: theme.spacing(1, 0),
  },
  link: {
    textAlign: 'center',
    margin: theme.spacing(1, 0),
    textDecoration: 'none',
    color: theme.palette.primary.main,
    '&:hover': {
      color: theme.palette.primary.main,
      textDecoration: 'underline',
    },
  },
}))

const Work: React.FC<{ username: string }> = ({ username }) => {
  const classes = useStyles()
  const dispatch = useDispatch()
  const data = useSelector(getWorkData)
  const selectedTab = useSelector(getSelectedTab)
  const isLoading = useSelector(getIsLoading)
  const defaultFileURL = 'work.pdf'

  React.useEffect(() => {
    dispatch(requestListenerData(selectedTab))
  }, [dispatch, selectedTab])

  const handleSubmit = (values: IWork) => {
    dispatch(updateData(
      {
        ...values,
        newFile: values.newFile ? values.newFile.base64 : null,
        fileURL: values.newFile ? defaultFileURL : data.fileURL,
      },
      selectedTab
    )
    )
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
          Сведения о работе
        </Typography>
        <HtmlTooltip
          title={
            <>
              <span>
                Раздел заполняется на основании трудовой книжки Для лиц, не
                работающих на момент заполнения заявки на цикл, в строке{' '}
                <u>Занимаемая должность</u> нужно записать «не работаю».
                <br />В строке <u>Тип должности</u> нужно выбрать «лица по
                направлению службы занятости», если Вы имеете официальный статус
                безработного и направление Службы Занятости на обучение. В
                противном случае нужно выбрать «другие».
              </span>
            </>
          }
        >
          <IconButton
            size="small"
            className={classes.iconTitle}
            aria-label="delete"
          >
            <HelpIcon />
          </IconButton>
        </HtmlTooltip>
      </Grid>
      <WorkDataReduxForm
        onSubmit={handleSubmit}
        initialValues={data}
        username={username}
        positionTypes={data.positionTypes}
        fileURL={data && data.fileURL}
      />
    </>
  )
}

interface IProps {
  username: string
  positionTypes: string[]
  fileURL: string | null
}

const WorkDataForm: React.FC<InjectedFormProps<IWork, IProps> & IProps> = ({ handleSubmit, ...props }) => {
  const classes = useStyles()
  const dispatch = useDispatch()

  const handleFileDelete = () => {
    dispatch(
      confirmDialogActions.confirmDialogShow({
        title: `Удалить файл`,
        text: `Вы действительно хотите удалить файл?`,
        onApprove: () => onFileDelete(),
      })
    )
  }

  const onFileDelete = () => {
    dispatch(confirmDialogActions.confirmDialogClose())
    dispatch(workFileDelete())
  }

  return (
    <form onSubmit={handleSubmit}>
      <Field
        name="organization"
        label="Полное наименование организации"
        component={Textarea}
        adornment={
          <InputAdornment position="start">
            <HtmlTooltip
              title={
                <>
                  <span>
                    Необходимо ввести наименование как в регистрационных
                    документах
                  </span>
                </>
              }
            >
              <IconButton
                className={classes.inputStartIcon}
                size="small"
                aria-label="help"
              >
                <HelpIcon />
              </IconButton>
            </HtmlTooltip>
          </InputAdornment>
        }
      />
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
      <Field
        name="listenerPosition"
        label="Должность слушателя"
        component={Input}
      />
      <Field
        name="accessionDate"
        label="Год, месяц вступления в должность"
        format={(value: any) =>
          value ? new Date(value.split('-')[1], value.split('-')[0] - 1) : null
        }
        parse={parseMonth}
        views={['year', 'month']}
        maxDate={new Date()}
        dateformat="MM-YYYY"
        placeholder="мм-гггг"
        component={DateInput}
      />
      <Field name="positionType" label="Тип должности" component={Select}>
        <MenuItem>
          <em>Не указано</em>
        </MenuItem>
        {props.positionTypes &&
          props.positionTypes.map((option, index) => (
            <MenuItem key={index} value={index}>
              {option}
            </MenuItem>
          ))}
      </Field>
      <Grid container direction="row" alignItems="center">
        <Typography className={classes.typography}>
          Копия трудовой книжки
        </Typography>
        {loadFileTooltip}
      </Grid>
      {props.fileURL ? (
        <Grid container direction="row" alignItems="center">
          <a
            className={classes.link}
            href={`${SAVE_FILES_DIRECTORY}${props.username}/${props.fileURL}`}
            rel="noopener noreferrer"
            target="_blank"
          >
            <Grid container direction="row" alignItems="center">
              <PdfIcon style={{ marginRight: 5, color: '#8C1212' }} />
              <span>Скан-копия</span>
            </Grid>
          </a>
          <Tooltip title="Удалить файл">
            <IconButton
              onClick={handleFileDelete}
              style={{ marginLeft: 5 }}
              size="small"
            >
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        </Grid>
      ) : null}
      <Field name="newFile" filetypes={[`.pdf`]} component={FileInput} />
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

const WorkDataReduxForm = reduxForm<IWork, IProps>({
  form: 'workDataForm',
  enableReinitialize: true
})(WorkDataForm)

export default Work
