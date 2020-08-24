import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Field, reduxForm, submit } from 'redux-form'
import DialogLayout from '../Commons/Dialog/DialogLayout'
import LoaderLayout from '../Commons/Loader/LoaderLayout'
import allActions from '../../store/actions'
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

const ListenerInfo = ({ userID, rowID, options, onClose }) => {
  const dispatch = useDispatch()

  const data = useSelector((state) => state.courses.listenerInfo)

  const selectedCourseID = useSelector(
    (state) => state.courses.selectedCourse.ID
  )

  React.useEffect(() => {
    dispatch(allActions.coursesActions.getListenerInfo(userID, rowID))
  }, [dispatch, userID, rowID])

  const initialValues = data.fullname
    ? {
        cathedraAllow: Boolean(data.cathedraAllow),
        instituteAllow: Boolean(data.instituteAllow),
        documents: data.documents,
        comment: data.comment,
        cathedraComment: data.checks.cathedra.comment,
        cathedraLabel: data.checks ? data.checks.cathedra.label : null,
        instituteComment: data.checks ? data.checks.institute.comment : null,
        instituteLabel: data.checks ? data.checks.institute.label : null,
        work: data.work,
        workCheck: data.workCheck,
      }
    : {}

  const handleSubmit = (values) => {
    dispatch(
      allActions.coursesActions.saveCheckData(
        userID,
        rowID,
        values,
        selectedCourseID
      )
    )
  }

  return (
    <DialogLayout
      largeSize
      options={options}
      approveText="Сохранить изменения"
      cancelText="Отмена"
      onApprove={() => dispatch(submit('listenerInfoForm'))}
      onClose={onClose}
      title={`Слушатель «${data.fullname}»`}
    >
      {data.isListenerInfoLoading ? (
        <Grid container direction="row" justify="center">
          <LoaderLayout />
        </Grid>
      ) : (
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
      )}
    </DialogLayout>
  )
}

let ListenerInfoForm = (props) => {
  const classes = useStyles()
  const values = props.initialValues

  let work = null
  if (values.work) work = JSON.parse(values.work)

  const radioButtons = [
    { value: '0', label: 'Не верно' },
    { value: '1', label: 'Верно' },
  ]

  const username = userAPI.getUserName().toLowerCase()
  const [workInfoOpen, setWorkInfoOpen] = React.useState(false)

  return (
    <form onSubmit={props.handleSubmit}>
      <Typography className={classes.typography}>Допуск к курсу</Typography>
      <FormGroup row>
        <Field name="cathedraAllow" component={Switcher} label="Кафедра" />
        <Field
          name="instituteAllow"
          component={Switcher}
          label="Институт ДПО"
        />
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
        label={`Рецензия от кафедры${values.cathedraLabel}`}
      />
      <Field
        name="instituteComment"
        component={Textarea}
        label={`Рецензия от института ДПО${values.instituteLabel}`}
      />
      <Typography className={classes.typography}>Документы</Typography>
      {values.documents.map((document, index) => {
        return (
          <ListenerInfoDocument
            key={document.id}
            document={document}
            index={index}
          />
        )
      })}
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
    </form>
  )
}

ListenerInfoForm = reduxForm({
  form: 'listenerInfoForm',
  enableReinitialize: true,
})(ListenerInfoForm)

export default ListenerInfo
