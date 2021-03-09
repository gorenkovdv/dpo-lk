import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Field, reduxForm, submit } from 'redux-form'
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
import { SAVE_FILES_DIRECTORY } from '../../store/const.js'
import { userAPI } from '../../services/api'
import styles from '../../styles.js'

const useStyles = makeStyles((theme) => ({
  ...styles(theme),
  typography: {
    padding: theme.spacing(2, 0),
  },
  pointer: {
    cursor: 'pointer',
  },
  startIcon: {
    marginRight: theme.spacing(1),
  },
}))

const ListenerInfo = ({ user, options, onClose }) => {
  const dispatch = useDispatch()
  const data = useSelector((state) => state.courses.listenerInfo)
  const roots = useSelector((state) => state.courses.roots)
  const rootsGroup = parseInt(roots.group)
  const cathedraRoots = rootsGroup === 3
  const instituteRoots = [1, 2].includes(rootsGroup)

  React.useEffect(() => {
    dispatch(getListenerInfo(user.id))
  }, [dispatch, user.id])

  const initialValues = {
    documents: data.documents,
    comment: user.comment,
    work: data.work,
    workCheck: data.workCheck,
    requestCME: user.requestCME,
  }

  if (cathedraRoots || instituteRoots) {
    initialValues.cathedraAllow = Boolean(user.cathedraAllow)
    initialValues.cathedraComment = user.checks.cathedra.comment
    initialValues.cathedraLabel = user.checks.cathedra.label
  }

  if (instituteRoots) {
    initialValues.instituteAllow = Boolean(user.instituteAllow)
    initialValues.instituteComment = user.checks.institute.comment
    initialValues.instituteLabel = user.checks.institute.label
  }

  const handleSubmit = (values) => {
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
        <ListenerInfoForm
          onSubmit={handleSubmit}
          initialValues={initialValues}
        />
      </>
    </DialogLayout>
  )
}

let ListenerInfoForm = (props) => {
  const classes = useStyles()
  const values = props.initialValues
  const [workInfoOpen, setWorkInfoOpen] = React.useState(false)
  const [requestCMEInfoOpen, setRequestCMEInfoOpen] = React.useState(false)

  let work = null
  if (values.work) work = JSON.parse(values.work)

  let requestCME = null
  if (values.requestCME) requestCME = JSON.parse(values.requestCME)

  const radioButtons = [
    { value: '0', label: 'Не верно' },
    { value: '1', label: 'Верно' },
  ]

  const username = userAPI.getUserName().toLowerCase()

  return (
    <form onSubmit={props.handleSubmit}>
      <Typography className={classes.typography}>Допуск к курсу</Typography>
      <FormGroup row>
        {props.initialValues.cathedraAllow !== undefined && (
          <Field name="cathedraAllow" component={Switcher} label="Кафедра" />
        )}
        {props.initialValues.instituteAllow !== undefined && (
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
      {props.initialValues.cathedraComment !== undefined && (
        <Field
          name="cathedraComment"
          component={Textarea}
          label={`Рецензия от кафедры${values.cathedraLabel}`}
        />
      )}
      {props.initialValues.instituteComment !== undefined && (
        <Field
          name="instituteComment"
          component={Textarea}
          label={`Рецензия от института ДПО${values.instituteLabel}`}
        />
      )}
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
      {values.documents.length > 0 ? (
        values.documents.map((document, index) => {
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

ListenerInfoForm = reduxForm({
  form: 'listenerInfoForm',
  enableReinitialize: true,
})(ListenerInfoForm)

export default ListenerInfo
