import React from 'react'
import { compose } from 'redux'
import { submit } from 'redux-form'
import { useDispatch, useSelector } from 'react-redux'
import { makeStyles } from '@material-ui/core/styles'
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
import {
  getRequests,
  setDocumentsApprove,
  cancelRequest as cancelRequestAction,
  updateCMERequest,
  actions as requestsActions
} from '../../store/reducers/requests'
import MainLayout from '../Main/MainLayout'
import DialogLayout from '../Commons/Dialog/DialogLayout'
import withAuth from '../Authorization/withAuth'
import { actions as confirmDialogActions } from '../../store/reducers/confirmDialog'
import { getIsLoading } from '../../store/selectors/loader'
import { getRequestsList, getSelectedRequest } from '../../store/selectors/requests'
import { ISelectedRequest, IRequest } from '../../types'
import RequestDocumentsWindow from './RequestDocumentsWindow'
import RequestCMEForm from './RequestCMEForm'
import Request from './Request'
import { IValues } from './RequestCMEForm'

const useStyles = makeStyles((theme) => ({
  table: {
    minWidth: 650,
    borderCollapse: 'collapse',
  },
  h6: {
    margin: theme.spacing(1.25, 0),
  },
}))

const RequestsList = () => {
  const classes = useStyles()
  const dispatch = useDispatch()
  const isLoading = useSelector(getIsLoading)
  const data = useSelector(getRequestsList)
  const selectedRequest = useSelector(getSelectedRequest)

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
  const cancelRequestDialogShow = (request: ISelectedRequest) => {
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

  const requestCMEDialogOpen = (request: ISelectedRequest) => {
    dispatch(requestsActions.setSelectedRequest(request))
    setRequestCMEDialogParams({ open: true, disabled: false })
  }

  const documentsDialogOpen = (request: ISelectedRequest) => {
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
  const cancelRequest = (request: ISelectedRequest) => {
    dispatch(cancelRequestAction(request))
    confirmDialogClose()
  }

  const cancelDocumentsApprove = () => {
    if (selectedRequest) dispatch(setDocumentsApprove(selectedRequest.ID, 0))
    confirmDialogClose()
    documentsDialogClose()
  }

  const documentsDialogApprove = () => {
    if (selectedRequest) dispatch(setDocumentsApprove(selectedRequest.ID, 1))
    documentsDialogClose()
  }

  const handleSubmit = (values: IValues) => {
    if (selectedRequest)
      dispatch(
        updateCMERequest({
          ...values,
          rowID: selectedRequest.rowID,
        })
      )
    requestCMEDialogClose()
  }

  let initialValues = {}
  if (selectedRequest) {
    const selectedRequestConst: IRequest = data.filter(
      (request) => request.rowID.toString() === selectedRequest.rowID.toString()
    )[0]

    if (selectedRequestConst.RequestCME) {
      const parsedCME = JSON.parse(selectedRequestConst.RequestCME)
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
      {data.length ? (
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
              {data.map((row) => (
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
      {selectedRequest && (
        <>
          <DialogLayout
            options={requestCMEDialogParams}
            onClose={requestCMEDialogClose}
            onApprove={() => dispatch(submit('requestCMEForm'))}
            approveText="Подтвердить"
            cancelText="Отмена"
            title="Заявка с портала НМО"
            text={`Программа «${selectedRequest.courseName}»`}
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
