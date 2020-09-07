import React, { useState } from 'react'
import { Field, reduxForm } from 'redux-form'
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
import DialogLayout from '../../Commons/Dialog/DialogLayout'
import { SAVE_FILES_DIRECTORY } from '../../../store/const.js'
import { parseDate } from '../../../utils/parse.js'
import allActions from '../../../store/actions'
import styles from '../../../styles.js'

const useStyles = makeStyles((theme) => ({
  ...styles(theme),
  button: { ...styles(theme).documentButton },
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

const Education = ({ username }) => {
  const classes = useStyles()
  const dispatch = useDispatch()
  const isLoading = useSelector((state) => state.loader.isLoading)
  const allData = useSelector((state) => state.listenerData)
  const data = allData.list
  const level = data.education.currentLevel || 0
  const index = data.education.currentDocument || 0
  const currentData = data.education.levels
  const currentDocument =
    currentData && currentData[level] ? currentData[level][index] : null
  const isDocumentNew = currentDocument ? currentDocument.isDocumentNew : false
  const defaultFileURL = `education${level}${index}.pdf`
  const actions = allActions.listenerDataActions

  const [documentsDialogParams, setDocumentsDialogParams] = useState({
    open: false,
    disabled: true,
    redirect: { value: 0, type: 'document' },
  })

  React.useEffect(() => {
    dispatch(actions.requestListenerData(4))
  }, [dispatch, actions])

  const handleLevelChange = (e) => {
    if (e.target.value !== level) {
      if (isDocumentNew) {
        setDocumentsDialogParams({
          open: true,
          disabled: false,
          redirect: { value: e.target.value, type: 'level' },
        })
      } else {
        goToLevel(e.target.value)
      }
    }
  }

  const handleNewDocument = () => {
    let newDoc = {
      organization: '',
      speciality: '',
      fullName: level < 4 ? data.education.fullName : null,
      firstDate: null,
      secondDate: null,
      serial: '',
      hours: level > 3 ? 0 : null,
      newFile: null,
      fileURL: null,
      isDocumentNew: true,
    }

    dispatch(actions.createNewDocument(newDoc, 4))
  }

  const goToLevel = (level) => {
    dispatch(actions.selectEducationLevel(level))
  }

  const goToDocument = (index) => {
    dispatch(actions.selectDocument(index, 4))
  }

  const selectDocument = (e) => {
    if (e.target.value !== index) {
      if (isDocumentNew) {
        setDocumentsDialogParams({
          open: true,
          disabled: false,
          redirect: { value: e.target.value, type: 'document' },
        })
      } else {
        goToDocument(e.target.value)
      }
    }
  }

  const handleDocumentsDialogClose = () => {
    setDocumentsDialogParams({ open: false, disabled: true, redirect: null })
  }

  const handleDocumentRedirect = () => {
    handleDocumentsDialogClose()

    if (documentsDialogParams.redirect.type === 'document')
      goToDocument(documentsDialogParams.redirect.value)

    if (documentsDialogParams.redirect.type === 'level')
      goToLevel(documentsDialogParams.redirect.value)

    dispatch(actions.dropNewEducationDocument())
  }

  const handleSubmit = (values) => {
    dispatch(
      actions.updateData(
        {
          ...values,
          level: level,
          document: index,
          newDocument: isDocumentNew,
          newFile: values.newFile ? values.newFile.base64 : null,
          fileURL: values.newFile ? defaultFileURL : currentDocument.fileURL,
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
        {data.educationTypes && (
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
            {data.educationTypes.map((option, index) => (
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
                {`${data.educationTypes[level].name} ${index + 1} ${
                  currentData[level][index].isDocumentNew ? ' (новый)' : ''
                }`}
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
        <EducationDataForm
          onSubmit={handleSubmit}
          initialValues={currentDocument}
          educationTypes={data.educationTypes}
          index={index}
          level={level}
          documentId={currentDocument.id ? currentDocument.id : null}
          fileURL={currentDocument.fileURL}
          isDocumentNew={isDocumentNew}
          username={username}
        />
      )}
      <DialogLayout
        options={documentsDialogParams}
        onClose={handleDocumentsDialogClose}
        onApprove={handleDocumentRedirect}
        id="go-to-document-dialog-title"
        title="Выбрать документ"
        text="Новый документ не был сохранён. Вы действительно хотите перейти к другому документу?"
      />
    </>
  )
}

let EducationDataForm = (props) => {
  const classes = useStyles()
  const dispatch = useDispatch()
  const actions = allActions.listenerDataActions
  const level = props.level
  const username = props.username

  const [deleteDocumentDialogParams, setDeleteDocumentDialogParams] = useState({
    open: false,
    disabled: true,
  })
  const [deleteFileDialogParams, setDeleteFileDialogParams] = useState({
    open: false,
    disabled: true,
  })

  const cancelNewDocument = () => {
    dispatch(actions.selectDocument(0, 4))
    dispatch(actions.dropNewEducationDocument())
  }

  // onDialogOpen
  const deleteDocumentDialogShow = (e) => {
    setDeleteDocumentDialogParams({ open: true, disabled: false })
  }

  const deleteFileDialogShow = (e) => {
    setDeleteFileDialogParams({ open: true, disabled: false })
  }

  // onDialogClose
  const deleteDocumentDialogClose = () => {
    setDeleteDocumentDialogParams({ open: false, disabled: true })
  }

  const deleteFileDialogClose = () => {
    setDeleteFileDialogParams({ open: false, disabled: true })
  }

  // onDialogApprove
  const deleteDocument = (e) => {
    deleteDocumentDialogClose()

    dispatch(actions.requestDocumentDelete(props.documentId, 4))
  }

  const deleteFile = (e) => {
    deleteFileDialogClose()
    dispatch(actions.requestFileDelete(props.documentId, 4))
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
              <PdfIcon className={classes.iconColor} />
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
      <DialogLayout
        options={deleteFileDialogParams}
        onClose={deleteFileDialogClose}
        onApprove={deleteFile}
        title="Удалить файл"
        text="Вы действительно хотите удалить файл?"
      />
      <DialogLayout
        options={deleteDocumentDialogParams}
        onClose={deleteDocumentDialogClose}
        onApprove={deleteDocument}
        title="Удалить документ"
        text="Вы действительно хотите удалить документ?"
      />
    </form>
  )
}

EducationDataForm = reduxForm({
  form: 'educationDataForm',
  enableReinitialize: true,
})(EducationDataForm)

export default Education
