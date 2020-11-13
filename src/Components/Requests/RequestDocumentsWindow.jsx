import React from 'react'
import { useSelector } from 'react-redux'
import {
  Grid,
  Typography,
  FormControlLabel,
  Checkbox,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
} from '@material-ui/core'
import DialogLayout from '../Commons/Dialog/DialogLayout'

const RequestDocumentsWindow = ({ open, onApprove, onClose, onCancel }) => {
  const selectedRequest = useSelector((state) => state.requests.selectedRequest)
  const approved = parseInt(selectedRequest.DocumentsApproved)

  const [checked, setChecked] = React.useState(false)
  const [disabled, setDisabled] = React.useState(false)

  const approveText = !approved ? `Подтвердить` : `Отменить условия сделки`
  const approveFunction = !approved ? onApprove : onCancel

  React.useEffect(() => {
    setDisabled(Boolean(!approved))
  }, [approved])

  const checkboxChange = (e) => {
    setChecked(!checked)
    setDisabled(checked)
  }

  return (
    <DialogLayout
      options={{ open, disabled }}
      onApprove={approveFunction}
      onClose={onClose}
      title={`Работа с документами`}
      approveText={approveText}
      cancelText={`Отмена`}
    >
      <Typography>{`Программа: «${selectedRequest.courseName}»`}</Typography>
      {!approved ? (
        <>
          <TableContainer component={Paper}>
            <Table style={{ minWidth: 350 }} size="small">
              <TableBody>
                <TableRow>
                  <TableCell colSpan={2}>Оплата</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Оплата за 1 слушателя</TableCell>
                  <TableCell>{selectedRequest.Price}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Слушателей</TableCell>
                  <TableCell>1 чел.</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Итого</TableCell>
                  <TableCell>{selectedRequest.Price}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
          <Grid style={{ marginTop: 15 }}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={checked}
                  color="primary"
                  size="small"
                  onChange={checkboxChange}
                />
              }
              label={`Данные мной проверены. Перейти к заключению договора`}
            />
          </Grid>
        </>
      ) : (
        <>
          <Typography>Документы подтверждены</Typography>
        </>
      )}
    </DialogLayout>
  )
}

export default RequestDocumentsWindow
