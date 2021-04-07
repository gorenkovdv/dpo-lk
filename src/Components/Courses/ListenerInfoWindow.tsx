import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Field, InjectedFormProps, reduxForm, submit } from 'redux-form'
import DialogLayout from '../Commons/Dialog/DialogLayout'
import { getListenerInfo, saveCheckData } from '../../store/reducers/courses'
import {
  Grid,
  TableContainer,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Paper,
  FormGroup,
  Collapse,
  Box,
  IconButton,
} from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import {
  Textarea,
  Switcher,
  RadioGroupContainer,
} from '../Commons/FormsControls/FormsControls'
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown'
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp'
import ListenerInfoDocument from './ListenerInfoDocument'
import { SAVE_FILES_DIRECTORY } from '../../store/const'
import { getCoursesRoots, getSelectedListenerInfo } from '../../store/selectors/courses'
import { userAPI } from '../../services/api'
import { ICourseUser, IDocument } from '../../types'

const useStyles = makeStyles((theme) => ({
  typography: {
    padding: theme.spacing(2, 0),
  },
  pointer: {
    cursor: 'pointer',
  },
  startIcon: {
    marginRight: theme.spacing(1),
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

interface IProps {
  user: ICourseUser,
  options: { open: boolean },
  onClose: () => void
}

interface IValues {
  documents?: IDocument[]
  comment: string
  work: any
  workCheck?: number
  requestCME: string | null
  cathedraAllow: boolean
  cathedraComment: string
  cathedraLabel: string
  instituteAllow: boolean
  instituteComment: string
  instituteLabel: string
}

const ListenerInfo: React.FC<IProps> = ({ user, options, onClose }) => {
  const dispatch = useDispatch()
  const data = useSelector(getSelectedListenerInfo)
  const roots = useSelector(getCoursesRoots)
  const rootsGroup = roots.group
  const cathedraRoots = rootsGroup === 3
  const instituteRoots = rootsGroup === 1 || rootsGroup === 2

  React.useEffect(() => {
    dispatch(getListenerInfo(user.id))
  }, [dispatch, user.id])

  const initialValues: IValues = {
    documents: data.documents,
    comment: user.comment,
    work: data.work,
    workCheck: data.workCheck,
    requestCME: user.requestCME,
    cathedraAllow: false,
    cathedraComment: '',
    cathedraLabel: '',
    instituteAllow: false,
    instituteComment: '',
    instituteLabel: ''
  }

  if (cathedraRoots || instituteRoots) {
    initialValues.cathedraAllow = Boolean(user.cathedraAllow)
    if (user.checks.cathedra.comment && user.checks.cathedra.comment.length > 0) {
      if (user.checks.cathedra.comment) initialValues.cathedraComment = user.checks.cathedra.comment
      if (user.checks.cathedra.label) initialValues.cathedraLabel = user.checks.cathedra.label
    }
  }

  if (instituteRoots) {
    initialValues.instituteAllow = Boolean(user.instituteAllow)
    if (user.checks.institute.comment && user.checks.institute.comment.length > 0) {
      initialValues.instituteComment = user.checks.institute.comment
      if (user.checks.institute.label) initialValues.instituteLabel = user.checks.institute.label
    }
  }

  const handleSubmit = (values: any) => {
    console.log(values)
    dispatch(
      saveCheckData(user.id, user.rowID, values)
    )
  }

  if (data.isListenerInfoLoading) return null

  return (
    <DialogLayout
      largeSize
      options={options}
      approveText="Сохранить изменения"
      cancelText="Отмена"
      onApprove={() => dispatch(submit('listenerInfoForm'))}
      onClose={onClose}
      title={`Слушатель «${user.fullname}»`}
    >
      <>
        <TableContainer component={Paper}>
          <Table size="small">
            <TableBody>
              <TableRow>
                <TableCell style={{ width: '30%' }} align="right">
                  ФИО
                </TableCell>
                <TableCell align="left">{`${data.fullname}`}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell align="right">Дата рождения</TableCell>
                <TableCell align="left">{`${data.birthdate}`}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell align="right">Телефон</TableCell>
                <TableCell align="left">{`${data.phone}`}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell align="right">E-mail</TableCell>
                <TableCell align="left">{`${data.email}`}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
        <ListenerInfoReduxForm
          onSubmit={handleSubmit}
          initialValues={initialValues}
        />
      </>
    </DialogLayout>
  )
}

const ListenerInfoForm: React.FC<InjectedFormProps<IValues>> = ({ handleSubmit, initialValues }) => {
  const classes = useStyles()
  const [workInfoOpen, setWorkInfoOpen] = React.useState(false)
  const [requestCMEInfoOpen, setRequestCMEInfoOpen] = React.useState(false)

  let work = null
  if (initialValues.work) work = JSON.parse(initialValues.work)

  let requestCME = null
  if (initialValues.requestCME) requestCME = JSON.parse(initialValues.requestCME)

  const radioButtons = [
    { value: '0', label: 'Не верно' },
    { value: '1', label: 'Верно' },
  ]

  const username = userAPI.getUserName().toLowerCase()

  return (
    <form onSubmit={handleSubmit}>
      <Typography className={classes.typography}>Допуск к курсу</Typography>
      <FormGroup row>
        {initialValues.cathedraAllow && (
          <Field name="cathedraAllow" component={Switcher} label="Кафедра" />
        )}
        {initialValues.instituteAllow && (
          <Field
            name="instituteAllow"
            component={Switcher}
            label="Институт ДПО"
          />
        )}
      </FormGroup>
      <Typography className={classes.typography}>Рецензии</Typography>
      <Field
        name="comment"
        component={Textarea}
        label="Примечание (видно только рецензентам!)"
      />
      <Field
        name="cathedraComment"
        component={Textarea}
        label={`Рецензия от кафедры${initialValues.cathedraLabel}`}
      />
      <Field
        name="instituteComment"
        component={Textarea}
        label={`Рецензия от института ДПО${initialValues.instituteLabel}`}
      />
      {requestCME && (
        <>
          <Grid
            container
            alignItems="center"
            onClick={() => setRequestCMEInfoOpen(!requestCMEInfoOpen)}
            className={classes.pointer}
            direction="row"
            style={{ margin: '4px 0' }}
          >
            <Grid item>
              <IconButton size="small" className={classes.startIcon}>
                {requestCMEInfoOpen ? (
                  <KeyboardArrowUpIcon />
                ) : (
                  <KeyboardArrowDownIcon />
                )}
              </IconButton>
            </Grid>
            <Grid item>
              <Typography>Заявка с портала НМО</Typography>
            </Grid>
          </Grid>
          <Collapse in={requestCMEInfoOpen} timeout="auto" unmountOnExit>
            <Box margin={0.5}>
              <TableContainer component={Paper}>
                <Table size="small">
                  <TableBody>
                    <TableRow>
                      <TableCell style={{ width: '25%' }} align="right">
                        Специальность
                      </TableCell>
                      <TableCell align="left">{requestCME[0]}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell align="right">Номер документа</TableCell>
                      <TableCell align="left">{requestCME[1]}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          </Collapse>
        </>
      )}
      {work && (
        <>
          <Grid
            container
            alignItems="center"
            onClick={() => setWorkInfoOpen(!workInfoOpen)}
            className={classes.pointer}
            direction="row"
            style={{ margin: '4px 0' }}
          >
            <Grid item>
              <IconButton size="small" className={classes.startIcon}>
                {workInfoOpen ? (
                  <KeyboardArrowUpIcon />
                ) : (
                  <KeyboardArrowDownIcon />
                )}
              </IconButton>
            </Grid>
            <Grid item>
              <Typography>Трудовая деятельность</Typography>
            </Grid>
          </Grid>
          <Collapse in={workInfoOpen} timeout="auto" unmountOnExit>
            <Box margin={0.5}>
              {work.fileURL ? (
                <Grid container direction="row" alignItems="center">
                  <a
                    className={classes.link}
                    href={`${SAVE_FILES_DIRECTORY}${username}/${work.fileURL}`}
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    <span>Скан-копия трудовой книжки</span>
                  </a>
                </Grid>
              ) : null}
              <Field
                name="workCheck"
                direction="row"
                component={RadioGroupContainer}
                radios={radioButtons}
              />
              <TableContainer component={Paper}>
                <Table size="small">
                  <TableBody>
                    <TableRow>
                      <TableCell style={{ width: '25%' }} align="right">
                        Место работы
                      </TableCell>
                      <TableCell align="left">{work.organization}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell align="right">Должность</TableCell>
                      <TableCell align="left">
                        {work.listenerPosition}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell align="right">
                        Год вступления в должность
                      </TableCell>
                      <TableCell align="left">
                        {work.accessionDate.split('-')[1]}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          </Collapse>
        </>
      )}
      <Typography className={classes.typography}>Документы</Typography>
      {initialValues.documents && initialValues.documents.length > 0 ? (
        initialValues.documents.map((document, index) => {
          return (
            <ListenerInfoDocument
              key={document.id}
              document={document}
              index={index}
            />
          )
        })
      ) : (
        <Typography>Нет документов</Typography>
      )}
    </form>
  )
}

const ListenerInfoReduxForm = reduxForm<IValues>({
  form: 'listenerInfoForm',
  enableReinitialize: true,
})(ListenerInfoForm)

export default ListenerInfo
