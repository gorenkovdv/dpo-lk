import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { makeStyles } from '@material-ui/core/styles'
import {
  Button,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@material-ui/core'
import { Clear as ClearIcon } from '@material-ui/icons/'
import Autocomplete from '../Commons/FormsControls/Autocomplete'
import DialogLayout from '../Commons/Dialog/DialogLayout'
import AddNewListenerWindow from './AddNewListenerWindow'
import { actions as coursesActions, getListenersOptions } from '../../store/reducers/courses'
import { getListenersAddition, getSelectedCourse } from '../../store/selectors/courses'
import { IUserOption } from '../../types'

const useStyles = makeStyles((theme) => ({
  modalTableContainer: {
    maxHeight: 380,
  },
  button: {
    margin: theme.spacing(1),
  },
  table: {
    minWidth: 650,
    borderCollapse: 'collapse',
  },
}))

interface IProps {
  options: { open: boolean },
  onClose: () => void,
  onApprove: (listeners: IUserOption[]) => void
}

const AddListenersWindow: React.FC<IProps> = ({ options, onClose, onApprove }) => {
  const classes = useStyles()
  const dispatch = useDispatch()
  const [inputValue, setInputValue] = React.useState('')
  const [autocompleteOpen, setAutocompleteOpen] = React.useState(false)
  const [autocompleteValue, setAutocompleteValue] = React.useState(null as IUserOption | null)
  const data = useSelector(getListenersAddition)
  const course = useSelector(getSelectedCourse)
  const dialogOpen = data.isDialogOpen
  const loading = data.isLoading

  const onInputChange = (event: React.ChangeEvent<{}>, value: string) => {
    if (value === '') setAutocompleteValue(null)
    setInputValue(value)
    dispatch(getListenersOptions(value))
  }

  const onAddButtonClick = () => {
    setAutocompleteValue(null)

    if (autocompleteValue && autocompleteValue.id > 0) dispatch(coursesActions.addListenerToList(autocompleteValue))
  }

  const removeListener = (userID: number) => {
    dispatch(coursesActions.removeListenerFromList(userID))
  }

  const onDialogOpen = () => {
    dispatch(coursesActions.setAdditionDialogOpen(true))
  }

  const onDialogClose = () => {
    dispatch(coursesActions.setAdditionDialogOpen(false))
  }

  return (
    <DialogLayout
      largeSize
      options={options}
      approveText="Сохранить изменения"
      cancelText="Отмена"
      onApprove={() => onApprove(data.list)}
      onClose={onClose}
      title={course ? `Запись слушателей на курс «${course.Name}»` : ''}
    >
      <Autocomplete
        isOpen={autocompleteOpen}
        onOpen={() => setAutocompleteOpen(true)}
        onClose={() => setAutocompleteOpen(false)}
        options={data.options}
        isLoading={loading}
        value={autocompleteValue}
        setValue={(value: IUserOption) => setAutocompleteValue(value)}
        inputValue={inputValue}
        onInputChange={onInputChange}
      />
      <Button
        className={classes.button}
        type="button"
        component="button"
        variant="contained"
        color="primary"
        onClick={onAddButtonClick}
        disabled={!Boolean(autocompleteValue)}
      >
        Добавить
      </Button>
      <Button
        className={classes.button}
        type="button"
        component="button"
        variant="contained"
        color="primary"
        onClick={onDialogOpen}
      >
        Добавить нового слушателя
      </Button>
      {data.list.length > 0 && (
        <TableContainer
          className={classes.modalTableContainer}
          component={Paper}
        >
          <Table size="small" stickyHeader className={classes.table}>
            <TableHead>
              <TableRow>
                <TableCell>ФИО</TableCell>
                <TableCell>Логин</TableCell>
                <TableCell style={{ width: 25 }}></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.list.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.login}</TableCell>
                  <TableCell>
                    <IconButton onClick={() => removeListener(user.id)}>
                      <ClearIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
      <AddNewListenerWindow
        options={{ open: dialogOpen }}
        onClose={onDialogClose}
      />
    </DialogLayout>
  )
}

export default AddListenersWindow
