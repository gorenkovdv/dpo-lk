import React from 'react'
import { compose } from 'redux'
import { useDispatch, useSelector } from 'react-redux'
import { Field, reduxForm, submit } from 'redux-form'
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
import { MaskedInput, Input } from '../Commons/FormsControls/FormsControls'
import DialogLayout from '../Commons/Dialog/DialogLayout'
import { required, isStringContainsUnderscore } from '../../utils/validate.js'
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

  React.useEffect(() => {
    dispatch(actions.getRequests())
  }, [dispatch, actions])

  const [
    cancelRequestDialogParams,
    setCancelRequestDialogParams,
  ] = React.useState({ open: false, disabled: false })

  const [documentsDialogParams, setDocumentsDialogParams] = React.useState({
    open: false,
    disabled: false,
  })

  const [requestCMEDialogParams, setRequestCMEDialogParams] = React.useState({
    open: false,
    disabled: true,
  })

  // onDialogOpen
  const cancelRequestDialogOpen = (request) => {
    dispatch(actions.setSelectedRequest(request))
    setCancelRequestDialogParams({ open: true, disabled: false })
  }

  const requestCMEDialogOpen = (request) => {
    dispatch(actions.setSelectedRequest(request))
    setRequestCMEDialogParams({ open: true, disabled: false })
  }

  const documentsDialogOpen = (request) => {
    dispatch(actions.setSelectedRequest(request))
    setDocumentsDialogParams({ open: true, disabled: false })
  }

  // onDialogClose
  const cancelRequestDialogClose = () => {
    dispatch(actions.setSelectedRequest(null))
    setCancelRequestDialogParams({ open: false, disabled: true })
  }

  const requestCMEDialogClose = () => {
    setRequestCMEDialogParams({ open: false, disabled: true })
  }

  const documentsDialogClose = () => {
    setDocumentsDialogParams({ open: false, disabled: true })
  }

  // onDialogApprove
  const cancelRequest = () => {
    cancelRequestDialogClose()
    dispatch(actions.cancelRequest(data.selectedRequest))
  }

  const handleSubmit = (values) => {
    dispatch(
      allActions.requestsActions.updateCMERequest({
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

    const parsedCME = JSON.parse(selectedRequest.RequestCME)
    initialValues = {
      speciality: parsedCME[0],
      number: parsedCME[1],
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
        <TableContainer className={classes.tableContainer} component={Paper}>
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
                  onCancelRequest={cancelRequestDialogOpen}
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
            options={cancelRequestDialogParams}
            onClose={cancelRequestDialogClose}
            onApprove={cancelRequest}
            title="Отменить заявку"
            text={`Отменить заявку на обучение по программе «${data.selectedRequest.courseName}»?`}
          />
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
          <DialogLayout
            options={documentsDialogParams}
            onClose={documentsDialogClose}
            title="Работа с документами"
          ></DialogLayout>
        </>
      )}
    </>
  )
}

let RequestCMEForm = (props) => {
  const specialityFieldRef = React.useRef(null)

  React.useEffect(() => {
    specialityFieldRef.current.focus()
  }, [])

  return (
    <form onSubmit={props.handleSubmit}>
      <Field
        inputRef={specialityFieldRef}
        name="speciality"
        component={Input}
        label="Специальность"
        validate={required}
        required
      />
      <Field
        name="number"
        component={MaskedInput}
        mask={`NMO-999999-2099`}
        label="Номер документа"
        validate={[required, isStringContainsUnderscore]}
        required
      />
    </form>
  )
}

RequestCMEForm = reduxForm({ form: 'requestCMEForm' })(RequestCMEForm)

export default compose(withAuth, MainLayout)(RequestsList)
