import React from 'react'
import { Field, InjectedFormProps, reduxForm } from 'redux-form'
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
import { makeStyles } from '@material-ui/core/styles'
import { SAVE_FILES_DIRECTORY } from '../../../store/const'
import { parseDate } from '../../../utils/parse'
import { loadFileTooltip } from '../../Commons/Tooltips/LoadFileTooltip'
import LoaderLayout from '../../Commons/Loader/LoaderLayout'
import HtmlTooltip from '../../Commons/Tooltips/HtmlTooltip'
import {
  updateData,
  requestListenerData,
  createNewDocumentAction,
  selectDocumentAction,
  dropNewSertificateAction,
  documentDeleteAction,
  fileDeleteAction
} from '../../../store/reducers/listenerData'
import { actions as confirmDialogActions } from '../../../store/reducers/confirmDialog'
import { getSertificates, getSelectedDocumentsTab } from '../../../store/selectors/listener'
import { getIsLoading } from '../../../store/selectors/loader'
import { IDocument } from '../../../types'

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
  link: {
    textAlign: 'center',
    margin: theme.spacing(1, 0),
    textDecoration: 'none',
    color: theme.palette.primary.main,
    '&:hover': {
      color: theme.palette.primary.main,
      textDecoration: 'underline',
    }
  },
  typography: {
    boxSizing: 'border-box',
    padding: theme.spacing(1, 0),
  }
}))

const Sertificates: React.FC<{ username: string }> = ({ username }) => {
  const classes = useStyles()
  const dispatch = useDispatch()
  const data = useSelector(getSertificates)
  const selectedTab = useSelector(getSelectedDocumentsTab)
  const isLoading = useSelector(getIsLoading)
  const index = data.currentDocument || 0
  const currentData = data.documents
  const currentDocument = currentData ? currentData[index] : null
  const isDocumentNew = currentDocument ? currentDocument.isDocumentNew : false
  const defaultFileURL = `sertificate${index}.pdf`

  React.useEffect(() => {
    dispatch(requestListenerData(selectedTab))
  }, [dispatch, selectedTab])

  const handleNewDocument = () => {

    let newDoc: IDocument = {
      id: 0,
      name: '',
      comment: '',
      organization: '',
      speciality: '',
      firstDate: null,
      firstDateName: '',
      secondDate: null,
      secondDateName: '',
      serial: '',
      newFile: null,
      fileURL: null,
      isDocumentNew: true,
    }

    dispatch(createNewDocumentAction(newDoc, selectedTab))
  }

  const goToDocument = (index: number) => {
    dispatch(selectDocumentAction(index, selectedTab))
  }

  const confirmTransition = (value: number) => {
    dispatch(
      confirmDialogActions.confirmDialogShow({
        title: `Выбрать документ`,
        text: `Новый документ не был сохранён. Вы действительно хотите перейти к другому документу?`,
        onApprove: () => handleDocumentRedirect(value),
      })
    )
  }

  const selectDocument = (event: React.ChangeEvent<HTMLInputElement>) => {
    let currentValue = parseInt(event.target.value)
    if (currentValue !== index) {
      if (isDocumentNew) confirmTransition(currentValue)
      else goToDocument(currentValue)
    }
  }

  const handleDocumentRedirect = (value: number) => {
    dispatch(confirmDialogActions.confirmDialogClose())
    dispatch(dropNewSertificateAction())
  }

  const handleSubmit = (values: IDocument) => {
    dispatch(updateData(
      {
        ...values,
        document: index,
        newDocument: isDocumentNew,
        newFile: values.newFile ? values.newFile.base64 : null,
        fileURL: values.newFile ? defaultFileURL : currentDocument && currentDocument.fileURL,
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
                {`Сертификат ${index + 1} ${currentData[index].isDocumentNew ? ' (новый)' : ''
                  }`}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
      ) : (
        <Typography>Нет документов</Typography>
      )}
      {currentDocument && (
        <SertificatesDataReduxForm
          onSubmit={handleSubmit}
          initialValues={currentDocument}
          index={index}
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
  index: number
  documentId: number
  fileURL: string | null
  isDocumentNew?: boolean
  username: string
}

const SertificatesDataForm: React.FC<InjectedFormProps<IDocument, IProps> & IProps> = (props) => {
  const classes = useStyles()
  const dispatch = useDispatch()
  const selectedTab = useSelector(getSelectedDocumentsTab)
  const username = props.username

  const confirmCancel = () => {
    dispatch(
      confirmDialogActions.confirmDialogShow({
        title: `Отмена`,
        text: `Изменения не будут сохранены. Продолжить?`,
        onApprove: () => cancelNewDocument(),
      })
    )
  }

  const cancelNewDocument = () => {
    dispatch(dropNewSertificateAction())
    dispatch(confirmDialogActions.confirmDialogClose())
  }

  // onDialogOpen
  const deleteDocumentDialogShow = () => {
    dispatch(
      confirmDialogActions.confirmDialogShow({
        title: `Удалить документ`,
        text: `Вы действительно хотите удалить документ?`,
        onApprove: () => deleteDocument(),
      })
    )
  }

  const deleteFileDialogShow = () => {
    dispatch(
      confirmDialogActions.confirmDialogShow({
        title: `Удалить файл`,
        text: `Вы действительно хотите удалить файл?`,
        onApprove: () => deleteFile(),
      })
    )
  }

  // onDialogApprove
  const deleteDocument = () => {
    dispatch(confirmDialogActions.confirmDialogClose())
    dispatch(documentDeleteAction(props.documentId, selectedTab))
  }

  const deleteFile = () => {
    dispatch(confirmDialogActions.confirmDialogClose())
    dispatch(fileDeleteAction(props.documentId, selectedTab))
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
      <Field
        name="serial"
        label="Номер документа"
        component={Input}
      />
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
      <Field
        name="newFile"
        filetypes={[`.pdf`]}
        component={FileInput}
      />
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
          onClick={confirmCancel}
        >
          Отмена
        </Button>
      )}
    </form>
  )
}

const SertificatesDataReduxForm = reduxForm<IDocument, IProps>({
  form: 'sertificatesDataForm',
  enableReinitialize: true,
})(SertificatesDataForm)

export default Sertificates
