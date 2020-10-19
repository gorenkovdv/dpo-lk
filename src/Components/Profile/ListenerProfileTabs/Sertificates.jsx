import React, { useState } from 'react'
import { Field, reduxForm } from 'redux-form'
import { useDispatch, useSelector } from 'react-redux'
import {
  IconButton,
  Button,
  TextField,
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
  PostAdd as AddIcon,
  PictureAsPdf as PdfIcon,
} from '@material-ui/icons'
import DialogLayout from '../../Commons/Dialog/DialogLayout'
import { SAVE_FILES_DIRECTORY } from '../../../store/const.js'
import { parseDate } from '../../../utils/parse.js'
import {
  Input,
  Textarea,
  DateInput,
  FileInput,
} from '../../Commons/FormsControls/FormsControls'
import { loadFileTooltip } from '../../Commons/Tooltips/LoadFileTooltip'
import LoaderLayout from '../../Commons/Loader/LoaderLayout'
import HtmlTooltip from '../../Commons/Tooltips/HtmlTooltip'
import allActions from '../../../store/actions'
import styles from '../../../styles.js'

const useStyles = makeStyles((theme) => ({
  ...styles(theme),
  button: { ...styles(theme).documentButton },
}))

const Sertificates = ({ username }) => {
  const classes = useStyles()
  const dispatch = useDispatch()
  const allData = useSelector((state) => state.listenerData)
  const data = allData.list
  const index = data.sertificates.currentDocument || 0
  const currentData = data.sertificates.documents
  const currentDocument = currentData ? currentData[index] : null
  const isDocumentNew = currentDocument ? currentDocument.isDocumentNew : false
  const defaultFileURL = `sertificate${index}.pdf`
  const actions = allActions.listenerDataActions

  const [documentsDialogParams, setDocumentsDialogParams] = useState({
    open: false,
    disabled: true,
    redirect: 0,
  })

  React.useEffect(() => {
    dispatch(actions.requestListenerData(5))
  }, [dispatch, actions])

  const handleNewDocument = (e) => {
    let newDoc = {
      organization: '',
      speciality: '',
      firstDate: null,
      serial: '',
      newFile: null,
      fileURL: null,
      isDocumentNew: true,
    }

    dispatch(actions.createNewDocument(newDoc, 5))
  }

  const goToDocument = (index) => {
    dispatch(actions.selectDocument(index, 5))
  }

  const selectDocument = (e) => {
    if (e.target.value !== index) {
      if (isDocumentNew) {
        setDocumentsDialogParams({
          open: true,
          disabled: false,
          redirect: e.target.value,
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

    dispatch(actions.dropNewSertificate(documentsDialogParams.redirect))
  }

  const handleSubmit = (values) => {
    dispatch(
      actions.updateData(
        {
          ...values,
          document: index,
          newDocument: isDocumentNew,
          newFile: values.newFile ? values.newFile.base64 : null,
          fileURL: values.newFile ? defaultFileURL : currentDocument.fileURL,
        },
        5
      )
    )
  }

  if (allData.isLoading)
    return (
      <Grid container direction="row" justify="center">
        <LoaderLayout />
      </Grid>
    )

  return (
    <>
      <Grid container direction="row" alignItems="center">
        <Typography className={classes.h6} variant="h6">
          Сертификат специалиста
        </Typography>
        <HtmlTooltip
          title={
            <>
              <span>
                Раздел Сертификат специалиста предназначен для заполнения
                сведений о сертификате специалиста. Данные о сертификате
                специалиста (при его наличии) заполняются на основе последнего
                из имеющихся сертификатов специалиста по той специальности, по
                которой планируется профессиональная деятельность.
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
      {currentData && currentData.length > 0 ? (
        <Grid container direction="column" alignItems="flex-start">
          <Typography>Документы ({currentData.length})</Typography>
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
            {currentData.map((option, index) => (
              <MenuItem key={index} value={index}>
                {`Сертификат ${index + 1} ${
                  currentData[index].isDocumentNew ? ' (новый)' : ''
                }`}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
      ) : (
        <Typography>Нет документов</Typography>
      )}
      {currentDocument && (
        <SertificatesDataForm
          onSubmit={handleSubmit}
          initialValues={currentDocument}
          index={index}
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
        title="Выбрать документ"
        text="Новый документ не был сохранён. Вы действительно хотите перейти к другому документу?"
      />
    </>
  )
}

let SertificatesDataForm = (props) => {
  const classes = useStyles()
  const dispatch = useDispatch()
  const username = props.username
  const actions = allActions.listenerDataActions

  const [deleteDocumentDialogParams, setDeleteDocumentDialogParams] = useState({
    open: false,
    disabled: true,
  })
  const [deleteFileDialogParams, setDeleteFileDialogParams] = useState({
    open: false,
    disabled: true,
  })

  const cancelNewDocument = () => {
    dispatch(actions.dropNewSertificate(0))
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

    dispatch(actions.requestDocumentDelete(props.documentId, 5))
  }

  const deleteFile = (e) => {
    deleteFileDialogClose()
    dispatch(actions.requestFileDelete(props.documentId, 5))
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
        label="Специальность"
        required
        component={Input}
      />
      <Field
        name="firstDate"
        component={DateInput}
        parse={parseDate}
        views={['year', 'date']}
        maxDate={new Date()}
        dateformat="DD-MM-YYYY"
        placeholder="дд-мм-гггг"
        label="Дата комиссии"
      />
      <Field name="serial" label="Номер документа" component={Input} />
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
              <DeleteIcon className={classes.iconColor} />
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

SertificatesDataForm = reduxForm({
  form: 'sertificatesDataForm',
  enableReinitialize: true,
})(SertificatesDataForm)

export default Sertificates
