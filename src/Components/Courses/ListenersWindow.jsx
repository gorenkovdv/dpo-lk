import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Grid, Typography, IconButton, Tooltip } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import {
  HowToReg as ListenerInfoIcon,
  Clear as ClearIcon,
} from '@material-ui/icons'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableContainer from '@material-ui/core/TableContainer'
import TableHead from '@material-ui/core/TableHead'
import DialogLayout from '../Commons/Dialog/DialogLayout'
import ListenerInfoWindow from './ListenerInfoWindow'
import TableRow from '@material-ui/core/TableRow'
import Paper from '@material-ui/core/Paper'
import allActions from '../../store/actions'
import styles from '../../styles.js'

const useStyles = makeStyles((theme) => ({
  ...styles(theme),
  modalTableContainer: {
    maxHeight: 550,
  },
  checkGrid: {
    margin: theme.spacing(3, 0),
  },
}))

const ListenerWindowContent = ({ options, onClose }) => {
  const classes = useStyles()
  const dispatch = useDispatch()
  const [listenerInfoWindowOpen, setListenerInfoWindowOpen] = React.useState(
    false
  )
  const [selectedListener, setSelectedListener] = React.useState(null)

  const course = useSelector((state) =>
    state.courses.list.find(
      (item) => item.ID === state.courses.selectedCourse.ID
    )
  )

  const openListenerInfoWindow = (user) => {
    setSelectedListener(user)
    setListenerInfoWindowOpen(true)
  }

  const closeListenerInfoWindow = () => {
    setListenerInfoWindowOpen(false)
  }

  // dialogParams
  const [
    removeRequestDialogParams,
    setRemoveRequestDialogParams,
  ] = React.useState({ open: false, disabled: false })

  //onDialogOpen
  const removeRequestDialogOpen = (user) => {
    setSelectedListener(user)
    setRemoveRequestDialogParams({ open: true, disabled: false })
  }

  // onDialogClose
  const removeRequestDialogClose = () => {
    setRemoveRequestDialogParams({ open: false, disabled: true })
  }

  const removeRequest = () => {
    dispatch(
      allActions.coursesActions.removeCourseRequest(
        course.ID,
        selectedListener.id
      )
    )
    removeRequestDialogClose()
  }

  return (
    <DialogLayout
      largeSize
      options={options}
      onClose={onClose}
      cancelText="Отмена"
      title={`Программа «${course.Name}»`}
    >
      {course.users.length > 0 ? (
        <TableContainer
          className={classes.modalTableContainer}
          component={Paper}
        >
          <Table size="small" stickyHeader className={classes.table}>
            <TableHead>
              <TableRow>
                <TableCell style={{ minWidth: 175 }}>Слушатель</TableCell>
                <TableCell>Допуск до курса</TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {course.users.map((user, index) => {
                const checks = user.checks
                return (
                  <TableRow key={`${index}_${user.id}`}>
                    <TableCell>
                      <Grid container direction="column">
                        <Typography>{user.fullname}</Typography>
                        <small style={{ color: 'blue', fontWeight: 'bold' }}>
                          {user.username}
                        </small>
                        {user.lastUpdate && (
                          <small>Последнее изменение: {user.lastUpdate}</small>
                        )}
                      </Grid>
                    </TableCell>
                    <TableCell>
                      {user.comment && (
                        <Typography gutterBottom>{user.comment}</Typography>
                      )}
                      {checks.cathedra.date && (
                        <Grid
                          container
                          direction="column"
                          className={classes.checkGrid}
                        >
                          {checks.cathedra.comment.length > 0 && (
                            <Typography>{checks.cathedra.comment}</Typography>
                          )}
                          <small>{`${checks.cathedra.date} рецензент от кафедры: ${checks.cathedra.person}`}</small>
                        </Grid>
                      )}
                      {checks.institute.date && (
                        <Grid
                          container
                          direction="column"
                          className={classes.checkGrid}
                        >
                          {checks.institute.comment.length > 0 && (
                            <Typography>{checks.institute.comment}</Typography>
                          )}
                          <small>{`${checks.institute.date} рецензент от института ДПО: ${checks.institute.person}`}</small>
                        </Grid>
                      )}
                    </TableCell>
                    <TableCell style={{ minWidth: 150 }}>
                      <Grid container direction="row" justify="center">
                        <Tooltip title="Информация о слушателе">
                          <IconButton
                            onClick={() => openListenerInfoWindow(user)}
                          >
                            <ListenerInfoIcon fontSize="large" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip
                          title="Удалить заявку"
                          onClick={() => removeRequestDialogOpen(user)}
                        >
                          <IconButton>
                            <ClearIcon fontSize="large" />
                          </IconButton>
                        </Tooltip>
                      </Grid>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <Typography>Список заявок пуст</Typography>
      )}
      {selectedListener && (
        <ListenerInfoWindow
          user={selectedListener}
          options={{ open: listenerInfoWindowOpen }}
          onClose={closeListenerInfoWindow}
        />
      )}
      <DialogLayout
        options={removeRequestDialogParams}
        onClose={removeRequestDialogClose}
        onApprove={removeRequest}
        title="Удалить заявку"
        text={`Вы действительно хотите удалить заявку?`}
      />
    </DialogLayout>
  )
}

export default ListenerWindowContent
