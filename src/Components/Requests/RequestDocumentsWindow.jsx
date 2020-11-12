import React from 'react'
import { useSelector } from 'react-redux'
import {
  Grid,
  Button,
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

const RequestDocumentsWindow = ({
  options,
  onApprove,
  onClose,
  onCheck,
  onCancel,
}) => {
  const [checked, setChecked] = React.useState(false)
  const selectedRequest = useSelector((state) => state.requests.selectedRequest)

  const checkboxChange = (e) => {
    setChecked(!checked)
    onCheck(!checked)
  }

  return (
    <DialogLayout
      options={options}
      onApprove={onApprove}
      onClose={onClose}
      title={`Работа с документами`}
      approveText={`Сохранить`}
      cancelText={`Отмена`}
    >
      <Typography>{`Программа: «${selectedRequest.courseName}»`}</Typography>
      {!parseInt(selectedRequest.documentsApproved) ? (
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
          <Button
            type="button"
            size="small"
            variant={'contained'}
            color="primary"
            onClick={onCancel}
          >
            Отменить условия сделки
          </Button>
        </>
      )}
    </DialogLayout>
  )
}

export default RequestDocumentsWindow
