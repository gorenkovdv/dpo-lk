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
  InputBaseProps,
} from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import {
  Help as HelpIcon,
  Delete as DeleteIcon,
  Save as SaveIcon,
  PostAdd as AddIcon,
  PictureAsPdf as PdfIcon,
} from '@material-ui/icons'
import { SAVE_FILES_DIRECTORY } from '../../../store/const'
import {
  Input,
  Textarea,
  FileInput,
} from '../../Commons/FormsControls/FormsControls'
import { loadFileTooltip } from '../../Commons/Tooltips/LoadFileTooltip'
import LoaderLayout from '../../Commons/Loader/LoaderLayout'
import HtmlTooltip from '../../Commons/Tooltips/HtmlTooltip'
import {
  updateData,
  requestListenerData,
  createNewDocumentAction,
  selectDocumentAction,
  dropNewOtherDocumentAction,
  documentDeleteAction,
  fileDeleteAction
} from '../../../store/reducers/listenerData'
import { actions as confirmDialogActions } from '../../../store/reducers/confirmDialog'
import { getOtherData } from '../../../store/selectors/listener'
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

const Others: React.FC<{ username: string }> = ({ username }) => {
  const classes = useStyles()
  const dispatch = useDispatch()
  const data = useSelector(getOtherData)
  const isLoading = useSelector(getIsLoading)
  const index = data.currentDocument || 0
  const currentData = data.documents
  const currentDocument = currentData ? currentData[index] : null
  const isDocumentNew = currentDocument ? currentDocument.isDocumentNew : false
  const defaultFileURL = `sertificate${index}.pdf`

  React.useEffect(() => {
    dispatch(requestListenerData(6))
  }, [dispatch])

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

    dispatch(createNewDocumentAction(newDoc, 6))
  }

  const goToDocument = (index: number) => {
    dispatch(selectDocumentAction(index, 6))
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

  const selectDocument = (e: any) => {
    if (e.target.value !== index) {
      if (isDocumentNew) confirmTransition(e.target.value)
      else goToDocument(e.target.value)
    }
  }

  const handleDocumentRedirect = (value: number) => {
    dispatch(confirmDialogActions.confirmDialogClose())
    dispatch(dropNewOtherDocumentAction(value))
  }

  const handleSubmit = (values: any) => {
    dispatch(updateData(
      {
        ...values,
        document: index,
        newDocument: isDocumentNew,
        newFile: values.newFile ? values.newFile.base64 : null,
        fileURL: values.newFile ? defaultFileURL : currentDocument && currentDocument.fileURL,
      },
      6
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
          Иные документы
        </Typography>
        <HtmlTooltip
          title={
            <>
              <span>
                Раздел Иные документы предназначен для заполнения сведений об
                иных документах, таких как свидетельство о браке (при смене
                фамилии) или др.
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
                {`Документ ${index + 1} ${currentData[index].isDocumentNew ? ' (новый)' : ''
                  }`}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
      ) : (
        <Typography>Нет документов</Typography>
      )}
      {currentDocument && (
        <OthersDataReduxForm
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

interface IValues {
  documentName: string
  comment: string
  newFile: string | null
}

let OthersDataForm: React.FC<InjectedFormProps<IValues, IProps> & IProps> = ({ handleSubmit, ...props }) => {
  const classes = useStyles()
  const dispatch = useDispatch()
  const username = props.username

  const cancelNewDocument = () => {
    dispatch(dropNewOtherDocumentAction(0))
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
    dispatch(documentDeleteAction(props.documentId, 6))
  }

  const deleteFile = () => {
    dispatch(confirmDialogActions.confirmDialogClose())
    dispatch(fileDeleteAction(props.documentId, 6))
  }

  return (
    <form onSubmit={handleSubmit}>
      <Field
        name="documentName"
        label="Наименование документа"
        required
        component={Input}
      />
      <Field name="comment" label="Комментарий" component={Textarea} />
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

const OthersDataReduxForm = reduxForm<IValues, IProps>({
  form: 'othersDataForm',
  enableReinitialize: true,
})(OthersDataForm)

export default Others
