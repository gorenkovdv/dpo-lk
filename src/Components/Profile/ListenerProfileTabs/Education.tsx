import React from 'react'
import { Field, InjectedFormProps, reduxForm } from 'redux-form'
import { useDispatch, useSelector } from 'react-redux'
import {
  Grid,
  Typography,
  IconButton,
  Button,
  TextField,
  MenuItem,
  Tooltip,
} from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import {
  Help as HelpIcon,
  Delete as DeleteIcon,
  Save as SaveIcon,
  PostAdd as AddIcon,
  PictureAsPdf as PdfIcon,
} from '@material-ui/icons'
import {
  Input,
  Textarea,
  DateInput,
  FileInput,
} from '../../Commons/FormsControls/FormsControls'
import { loadFileTooltip } from '../../Commons/Tooltips/LoadFileTooltip'
import HtmlTooltip from '../../Commons/Tooltips/HtmlTooltip'
import { SAVE_FILES_DIRECTORY } from '../../../store/const'
import { parseDate } from '../../../utils/parse'
import {
  updateData,
  requestListenerData,
  createNewDocumentAction,
  selectEducationLevelAction,
  selectDocumentAction,
  dropNewEducationDocumentAction,
  documentDeleteAction,
  fileDeleteAction
} from '../../../store/reducers/listenerData'
import { actions as confirmDialogActions } from '../../../store/reducers/confirmDialog'
import { getIsLoading } from '../../../store/selectors/loader'
import { getEducationData, getEducationTypes } from '../../../store/selectors/listener'
import { IDocument, IEducationType } from '../../../types'

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
  textField: {
    boxSizing: 'border-box',
    width: '100%',
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

const tooltips = [
  <>
    <span>
      Раздел заполняется на основании диплома о высшем или среднем
      профессиональном образовании.
      <br />
      Серия и номер диплома располагаются в документе сразу после его названия
      <br />
    </span>
  </>,
  <>
    <span>
      Дата начала обучения и Дата окончания обучения указываются цифровым
      способом, например, 06-06-2017.
      <br />
      При отсутствии документа об обучении в интернатуре эти сведения
      заполняются на основе записи в трудовой книжке.
      <br />
      Серия, номер документа об обучении в интернатуре записываются при их
      наличии, а при их отсутствии нужно написать слово «нет».
      <br />
    </span>
  </>,
  <>
    <span>
      Раздел заполняется при наличии.
      <br />
      Дата начала обучения и Дата окончания обучения указываются цифровым
      способом, например, 06-06-2017.
      <br />
      При отсутствии документа об обучении в ординатуре эти сведения заполняются
      на основе записи в трудовой книжке.
      <br />
      Серия, номер документа об обучении в ординатуре записываются при их
      наличии, а при их отсутствии нужно написать слово «нет».
      <br />
    </span>
  </>,
  <>
    <span>
      Раздел заполняется при наличии, для окончивших ВУЗ после 2016 года.
    </span>
  </>,
  <>
    <span>
      Для прохождения цикла ПК сведения о ПП и ПК указываются только по
      специальности, по которой планируется предстоящее обучение.
      <br />
      Для прохождения ПП указываются сведения о наличии ПП, необходимой для
      планируемой профессиональной деятельности.
    </span>
  </>,
]
tooltips[5] = tooltips[4]

const Education: React.FC<{ username: string }> = ({ username }) => {
  const classes = useStyles()
  const dispatch = useDispatch()
  const isLoading = useSelector(getIsLoading)
  const data = useSelector(getEducationData)
  const educationTypes = useSelector(getEducationTypes)
  const level = data.currentLevel || 0
  const index = data.currentDocument || 0
  const currentData = data.levels
  const currentDocument = currentData[level] ? currentData[level][index] : null
  const isDocumentNew = currentDocument ? currentDocument.isDocumentNew : false
  const defaultFileURL = `education${level}${index}.pdf`

  React.useEffect(() => {
    dispatch(requestListenerData(4))
  }, [dispatch])

  const handleNewDocument = () => {
    let newDoc: IDocument = {
      id: 0,
      name: '',
      comment: '',
      organization: '',
      speciality: '',
      fullName: level < 4 ? data.fullName : null,
      firstDate: null,
      firstDateName: '',
      secondDate: null,
      secondDateName: '',
      serial: '',
      hours: level > 3 ? "0" : null,
      newFile: null,
      fileURL: null,
      isDocumentNew: true,
    }

    dispatch(createNewDocumentAction(newDoc, 4))
  }

  const confirmTransition = (value: number, type: string) => {
    const typeText = type === `level` ? `уровню образования` : `документу`
    dispatch(
      confirmDialogActions.confirmDialogShow({
        title: `Выбрать документ`,
        text: `Новый документ не был сохранён. Вы действительно хотите перейти к другому ${typeText}?`,
        onApprove: () => handleDocumentRedirect(value, type),
      })
    )
  }

  const handleLevelChange = (e: any) => {
    if (e.target.value !== level) {
      if (isDocumentNew) confirmTransition(e.target.value, 'level')
      else goToLevel(e.target.value)
    }
  }

  const goToLevel = (level: number) => {
    dispatch(selectEducationLevelAction(level))
  }

  const goToDocument = (index: number) => {
    dispatch(selectDocumentAction(index, 4))
  }

  const selectDocument = (e: any) => {
    if (e.target.value !== index) {
      if (isDocumentNew) confirmTransition(e.target.value, 'document')
      else goToDocument(e.target.value)
    }
  }

  const handleDocumentRedirect = (value: number, type: string) => {
    dispatch(confirmDialogActions.confirmDialogClose())

    if (type === 'document') goToDocument(value)
    if (type === 'level') goToLevel(value)

    dispatch(dropNewEducationDocumentAction())
  }

  const handleSubmit = (values: IValues) => {
    dispatch(updateData(
      {
        ...values,
        level: level,
        document: index,
        newDocument: isDocumentNew,
        newFile: values.newFile ? values.newFile.base64 : null,
        fileURL: values.newFile ? defaultFileURL : currentDocument && currentDocument.fileURL,
      },
      4
    )
    )
  }

  if (isLoading) return null

  return (
    <>
      <Grid container direction="row" alignItems="center">
        <Typography className={classes.h6} variant="h6">
          Образование
        </Typography>
        <HtmlTooltip title={tooltips[level]}>
          <IconButton
            className={classes.iconTitle}
            size="small"
            aria-label="delete"
          >
            <HelpIcon />
          </IconButton>
        </HtmlTooltip>
        {educationTypes && educationTypes.length > 0 && (
          <TextField
            select
            autoComplete="off"
            variant="outlined"
            margin="dense"
            className={classes.textField}
            label="Вид образования"
            value={level}
            onChange={handleLevelChange}
          >
            {educationTypes.map((option, index) => (
              <MenuItem key={index} value={index}>
                {option.name}
              </MenuItem>
            ))}
          </TextField>
        )}
        {!(
          level === 3 &&
          currentData &&
          currentData[level] &&
          currentData[level].length > 0
        ) ? (
          <Grid container>
            <Button
              style={{ marginTop: 10, marginBottom: 10 }}
              type="button"
              disabled={isDocumentNew}
              className={classes.button}
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              onClick={handleNewDocument}
            >
              Добавить документ
            </Button>
          </Grid>
        ) : null}
      </Grid>
      {currentData && currentData[level] && currentData[level].length > 0 ? (
        <Grid container direction="column" alignItems="flex-start">
          <Typography>Документы ({currentData[level].length})</Typography>
          <TextField
            select
            autoComplete="off"
            variant="outlined"
            margin="dense"
            className={classes.textField}
            label="Выбрать документ"
            value={index}
            onChange={selectDocument}
          >
            {currentData[level].map((option, index) => (
              <MenuItem key={index} value={index}>
                {`${educationTypes[level].name} ${index + 1} ${currentData[level][index].isDocumentNew ? ' (новый)' : ''}`}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
      ) : (
        <>
          <Typography>Нет документов</Typography>
          <br />
        </>
      )}
      {currentDocument && (
        <EducationDataReduxForm
          onSubmit={handleSubmit}
          initialValues={currentDocument}
          educationTypes={educationTypes}
          index={index}
          level={level}
          documentId={currentDocument.id ? currentDocument.id : 0}
          fileURL={currentDocument.fileURL}
          isDocumentNew={isDocumentNew}
          username={username}
        />
      )}
    </>
  )
}

interface IProps {
  educationTypes: IEducationType[]
  index: number
  level: number
  documentId: number
  fileURL: string | null
  isDocumentNew?: boolean
  username: string
}

interface IValues {
  organization: string
  speciality: string
  fullName?: string | null
  firstDate: string | null
  secondDate: string | null
  hours?: string | null
  serial: string
  newFile: any
}

const EducationDataForm: React.FC<InjectedFormProps<IValues, IProps> & IProps> = (props) => {
  const classes = useStyles()
  const dispatch = useDispatch()
  const level = props.level
  const username = props.username

  const cancelNewDocument = () => {
    dispatch(selectDocumentAction(0, 4))
    dispatch(dropNewEducationDocumentAction())
  }

  // onDialogOpen
  const deleteFileDialogShow = () => {
    dispatch(
      confirmDialogActions.confirmDialogShow({
        title: `Удалить файл`,
        text: `Вы действительно хотите удалить файл?`,
        onApprove: () => deleteFile(),
      })
    )
  }

  const deleteDocumentDialogShow = () => {
    dispatch(
      confirmDialogActions.confirmDialogShow({
        title: `Удалить документ`,
        text: `Вы действительно хотите удалить документ?`,
        onApprove: () => deleteDocument(),
      })
    )
  }

  // onDialogApprove
  const deleteDocument = () => {
    dispatch(documentDeleteAction(props.documentId, 4))
    dispatch(confirmDialogActions.confirmDialogClose())
  }

  const deleteFile = () => {
    dispatch(fileDeleteAction(props.documentId, 4))
    dispatch(confirmDialogActions.confirmDialogClose())
  }

  return (
    <form onSubmit={props.handleSubmit}>
      <Field
        name="organization"
        label="Полное наименование организации"
        required
        component={Textarea}
      />
      <Field
        name="speciality"
        required
        label="Специальность"
        component={Input}
      />
      {level < 4 && (
        <Field name="fullName" label="ФИО в документе" component={Input} />
      )}
      <Field
        name="firstDate"
        component={DateInput}
        parse={parseDate}
        views={['year', 'date']}
        maxDate={new Date()}
        dateformat="DD-MM-YYYY"
        placeholder="дд-мм-гггг"
        label={props.educationTypes[level].firstDateName}
      />
      <Field
        name="secondDate"
        component={DateInput}
        parse={parseDate}
        views={['year', 'date']}
        maxDate={new Date()}
        dateformat="DD-MM-YYYY"
        placeholder="дд-мм-гггг"
        label={props.educationTypes[level].secondDateName}
      />
      {level > 3 && (
        <Field
          name="hours"
          type="number"
          label={'Количество часов'}
          component={Input}
        />
      )}
      <Field name="serial" label="Серия, номер документа" component={Input} />
      <Grid container direction="row" alignItems="center">
        <Typography className={classes.typography}>
          Скан-копия документа
        </Typography>
        {loadFileTooltip}
      </Grid>
      {props.fileURL ? (
        <Grid container direction="row" alignItems="center">
          <a
            className={classes.link}
            href={`${SAVE_FILES_DIRECTORY}${username}/${props.fileURL}`}
            rel="noopener noreferrer"
            target="_blank"
          >
            <Grid container direction="row" alignItems="center">
              <PdfIcon />
              <Typography style={{ marginLeft: 5, marginRight: 5 }}>
                Скан-копия
              </Typography>
            </Grid>
          </a>
          <Tooltip title="Удалить файл">
            <IconButton onClick={deleteFileDialogShow} size="small">
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        </Grid>
      ) : null}
      <Field name="newFile" filetypes={[`.pdf`]} component={FileInput} />
      <Button
        type="submit"
        style={{ marginRight: 10 }}
        className={classes.button}
        variant="contained"
        color="primary"
        startIcon={<SaveIcon />}
      >
        Сохранить данные
      </Button>
      {!props.isDocumentNew ? (
        <Button
          type="button"
          className={classes.button}
          variant="contained"
          color="primary"
          startIcon={<DeleteIcon />}
          onClick={deleteDocumentDialogShow}
        >
          Удалить документ
        </Button>
      ) : (
        <Button
          type="button"
          className={classes.button}
          variant="contained"
          color="primary"
          onClick={cancelNewDocument}
        >
          Отмена
        </Button>
      )}
    </form>
  )
}

const EducationDataReduxForm = reduxForm<IValues, IProps>({
  form: 'educationDataForm',
  enableReinitialize: true,
})(EducationDataForm)

export default Education
