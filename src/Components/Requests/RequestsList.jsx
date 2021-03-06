import React from 'react'
import { compose } from 'redux'
import { submit } from 'redux-form'
import { useDispatch, useSelector } from 'react-redux'
import {
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import MainLayout from '../Main/MainLayout'
import DialogLayout from '../Commons/Dialog/DialogLayout'
import RequestDocumentsWindow from './RequestDocumentsWindow'
import RequestCMEForm from './RequestCMEForm'
import withAuth from '../Authorization/withAuth'
import { actions as confirmDialogActions } from '../../store/reducers/confirmDialog'
import { getRequests, setDocumentsApprove, cancelRequest as cancelRequestAction, updateCMERequest, actions as requestsActions } from '../../store/reducers/requests'
import styles from '../../styles'
import Request from './Request'

const useStyles = makeStyles((theme) => ({ ...styles(theme) }))

const RequestsList = () => {
  const classes = useStyles()
  const dispatch = useDispatch()
  const isLoading = useSelector((state) => state.loader.isLoading)
  const data = useSelector((state) => state.requests)

  React.useEffect(() => {
    dispatch(getRequests())
  }, [dispatch])

  const [isDocumentsDialogOpen, setIsDocumentsDialogOpen] = React.useState(
    false
  )

  const [requestCMEDialogParams, setRequestCMEDialogParams] = React.useState({
    open: false,
    disabled: true,
  })

  // onDialogOpen
  const cancelRequestDialogShow = (request) => {
    dispatch(
      confirmDialogActions.confirmDialogShow({
        title: `Отменить заявку`,
        text: `Отменить заявку на обучение по программе «${request.courseName}»?`,
        onApprove: () => cancelRequest(request),
      })
    )
  }

  const cancelDocumentsApproveDialogShow = () => {
    dispatch(
      confirmDialogActions.confirmDialogShow({
        title: `Отменить условия сделки`,
        text: `Вы уверены, что хотите отменить условия сделки?`,
        onApprove: () => cancelDocumentsApprove(),
      })
    )
  }

  const requestCMEDialogOpen = (request) => {
    dispatch(requestsActions.setSelectedRequest(request))
    setRequestCMEDialogParams({ open: true, disabled: false })
  }

  const documentsDialogOpen = (request) => {
    dispatch(requestsActions.setSelectedRequest(request))
    setIsDocumentsDialogOpen(true)
  }

  // onDialogClose
  const confirmDialogClose = () => {
    dispatch(confirmDialogActions.confirmDialogClose())
  }

  const requestCMEDialogClose = () => {
    setRequestCMEDialogParams({ open: false, disabled: true })
  }

  const documentsDialogClose = () => {
    setIsDocumentsDialogOpen(false)
  }

  // onDialogApprove
  const cancelRequest = (request) => {
    dispatch(cancelRequestAction(request))
    confirmDialogClose()
  }

  const cancelDocumentsApprove = () => {
    dispatch(setDocumentsApprove(data.selectedRequest.ID, 0))
    confirmDialogClose()
    documentsDialogClose()
  }

  const documentsDialogApprove = () => {
    dispatch(setDocumentsApprove(data.selectedRequest.ID, 1))
    documentsDialogClose()
  }

  const handleSubmit = (values) => {
    dispatch(
      updateCMERequest({
        ...values,
        rowID: data.selectedRequest.rowID,
      })
    )
    requestCMEDialogClose()
  }

  let initialValues = {}
  if (data.selectedRequest) {
    const selectedRequest = data.list.find(
      (request) => request.rowID === data.selectedRequest.rowID
    )

    if (selectedRequest.RequestCME) {
      const parsedCME = JSON.parse(selectedRequest.RequestCME)
      initialValues = {
        speciality: parsedCME[0],
        number: parsedCME[1],
      }
    }
  }

  if (isLoading) return null

  return (
    <>
      <Typography className={classes.h6} variant="h6">
        Заявки на обучение по программам повышения квалификации и
        профессиональной переподготовки
      </Typography>
      {data.list.length ? (
        <TableContainer component={Paper}>
          <Table size="small" className={classes.table}>
            <TableHead>
              <TableRow>
                <TableCell>Дата</TableCell>
                <TableCell>Наименование программы</TableCell>
                <TableCell align="center" style={{ maxWidth: 145 }}>
                  Учебные материалы на платформе Moodle
                </TableCell>
                <TableCell align="center">Оформление документов</TableCell>
                <TableCell align="center">Заявка с портала НМО</TableCell>
                <TableCell align="center" style={{ maxWidth: 100 }}>
                  Личная карточка
                </TableCell>
                <TableCell>Информация</TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.list.map((row) => (
                <Request
                  key={row.requestID}
                  onCancelRequest={cancelRequestDialogShow}
                  onDocumentsDialogOpen={documentsDialogOpen}
                  onRequestCMEDialogOpen={requestCMEDialogOpen}
                  row={row}
                />
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <Typography>Нет активных заявок</Typography>
      )}
      {data.selectedRequest && (
        <>
          <DialogLayout
            options={requestCMEDialogParams}
            onClose={requestCMEDialogClose}
            onApprove={() => dispatch(submit('requestCMEForm'))}
            approveText="Подтвердить"
            cancelText="Отмена"
            title="Заявка с портала НМО"
            text={`Программа «${data.selectedRequest.courseName}»`}
          >
            <RequestCMEForm
              onSubmit={handleSubmit}
              initialValues={initialValues}
            />
          </DialogLayout>
          <RequestDocumentsWindow
            open={isDocumentsDialogOpen}
            onApprove={documentsDialogApprove}
            onClose={documentsDialogClose}
            onCancel={cancelDocumentsApproveDialogShow}
          />
        </>
      )}
    </>
  )
}

export default compose(withAuth, MainLayout)(RequestsList)
