import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { makeStyles } from '@material-ui/core/styles'
import { compose } from 'redux'
import { Typography } from '@material-ui/core'
import MainLayout from '../Main/MainLayout'
import DialogLayout from '../Commons/Dialog/DialogLayout'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableContainer from '@material-ui/core/TableContainer'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import Paper from '@material-ui/core/Paper'
import withAuth from '../Authorization/withAuth'
import allActions from '../../store/actions'
import styles from '../../styles.js'
import Request from './Request'
import { userAPI } from '../../services/api'

const useStyles = makeStyles((theme) => ({ ...styles(theme) }))

const RequestsList = () => {
  const classes = useStyles()
  const dispatch = useDispatch()
  const isLoading = useSelector((state) => state.loader.isLoading)
  const data = useSelector((state) => state.requests)
  const actions = allActions.requestsActions
  const [selectedCourse, setSelectedCourse] = React.useState(null)
  const selectedCourseName = selectedCourse ? selectedCourse.name : ''

  React.useEffect(() => {
    dispatch(actions.getRequests())
  }, [dispatch, actions])

  const [
    cancelRequestDialogParams,
    setCancelRequestDialogParams,
  ] = React.useState({ open: false, disabled: false })

  const cancelRequestDialogOpen = (course) => {
    setSelectedCourse(course)
    setCancelRequestDialogParams({ open: true, disabled: false })
  }

  const cancelRequestDialogClose = () => {
    setCancelRequestDialogParams({ open: false, disabled: true })
  }

  const cancelRequest = () => {
    cancelRequestDialogClose()
    dispatch(actions.cancelRequest(selectedCourse, userAPI.getUID()))
  }

  if (isLoading) return null

  return (
    <>
      <Typography className={classes.h6} variant="h6">
        Заявки на обучение по программам повышения квалификации и
        профессиональной переподготовки
      </Typography>
      {data.list.length ? (
        <TableContainer className={classes.tableContainer} component={Paper}>
          <Table /*stickyHeader*/ size="small" className={classes.table}>
            <TableHead>
              <TableRow>
                <TableCell>Дата</TableCell>
                <TableCell>Наименование программы</TableCell>
                <TableCell align="center" style={{ maxWidth: 125 }}>
                  Учебные материалы на платформе Moodle
                </TableCell>
                <TableCell align="center">Заявка с портала НМО</TableCell>
                <TableCell align="center" style={{ maxWidth: 100 }}>
                  Личная карточка
                </TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.list.map((row) => (
                <Request
                  key={row.requestID}
                  onCancelRequest={cancelRequestDialogOpen}
                  course={row}
                />
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <Typography>Нет активных заявок</Typography>
      )}
      <DialogLayout
        options={cancelRequestDialogParams}
        onClose={cancelRequestDialogClose}
        onApprove={cancelRequest}
        title="Отменить заявку"
        text={`Отменить заявку на обучение по программе «${selectedCourseName}»?`}
      />
    </>
  )
}

export default compose(withAuth, MainLayout)(RequestsList)
