import React, { ChangeEvent } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { makeStyles } from '@material-ui/core/styles'
import {
  Button,
  IconButton,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
} from '@material-ui/core'
import { Check as CheckIcon, Clear as ClearIcon } from '@material-ui/icons/'
import Autocomplete from '@material-ui/lab/Autocomplete'
import DialogLayout from '../Commons/Dialog/DialogLayout'
import AddNewListenerWindow from './AddNewListenerWindow'
import { getListenersOptions, actions as coursesActions } from '../../store/reducers/courses'
import { getListenersAddition, getSelectedCourse } from '../../store/selectors/courses'
import { IUserOption } from '../../types'

const useStyles = makeStyles((theme) => ({
  modalTableContainer: {
    maxHeight: 380,
  },
  button: {
    margin: theme.spacing(1),
  },
  option: {
    transform: 'translateZ(0)',
  },
  iconTitle: {
    marginLeft: theme.spacing(1.25),
  },
  table: {
    minWidth: 650,
    borderCollapse: 'collapse',
  },
}))

interface IProps {
  options: { open: boolean },
  onClose: any,
  onApprove: any
}

const defaultValue = {
  id: 0,
  login: '',
  name: '',
  isUserAdded: false
}

const AddListenersWindow: React.FC<IProps> = ({ options, onClose, onApprove }) => {
  const classes = useStyles()
  const dispatch = useDispatch()
  const [open, setOpen] = React.useState(false)
  const [inputValue, setInputValue] = React.useState("")
  const [autocompleteValue, setAutocompleteValue] = React.useState(defaultValue)
  const data = useSelector(getListenersAddition)
  const course = useSelector(getSelectedCourse)
  const dialogOpen = data.isDialogOpen
  const loading = data.isLoading

  const onInputChange = (event: ChangeEvent<{}>, value: string) => {
    setInputValue(value)
    dispatch(getListenersOptions(value))
  }

  const onAddButtonClick = () => {
    setAutocompleteValue(defaultValue)

    if (autocompleteValue.id > 0) dispatch(coursesActions.addListenerToList(autocompleteValue))
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
        style={{ width: '100%' }}
        open={open}
        onOpen={() => setOpen(true)}
        onClose={() => setOpen(false)}
        noOptionsText="Список пуст"
        getOptionSelected={(option, value) => option.name === value.name}
        getOptionDisabled={(option) => option.isUserAdded}
        getOptionLabel={(option) =>
          `${option.name} (${option.login})`
        }
        options={data.options}
        loading={loading}
        inputValue={inputValue}
        value={autocompleteValue}
        onInputChange={() => onInputChange}
        onChange={(e: ChangeEvent<{}>, value: IUserOption | null) => {
          if (value) setAutocompleteValue(value)
        }}
        classes={{
          option: classes.option,
          noOptions: classes.option,
        }}
        renderOption={(option) => (
          <>
            <span>{`${option.name} (${option.login})`}</span>
            {option.isUserAdded && <CheckIcon className={classes.iconTitle} />}
          </>
        )}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Введите полностью или частично ФИО слушателя"
            InputProps={{
              ...params.InputProps,
              endAdornment: (
                <>
                  {loading ? (
                    <CircularProgress color="inherit" size={20} />
                  ) : null}
                  {params.InputProps.endAdornment}
                </>
              ),
            }}
          />
        )}
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
