import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Button, IconButton } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableContainer from '@material-ui/core/TableContainer'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import Paper from '@material-ui/core/Paper'
import TextField from '@material-ui/core/TextField'
import Autocomplete from '@material-ui/lab/Autocomplete'
import CircularProgress from '@material-ui/core/CircularProgress'
import DialogLayout from '../Commons/Dialog/DialogLayout'
import { Check as CheckIcon, Clear as ClearIcon } from '@material-ui/icons/'
import allActions from '../../store/actions'
import styles from '../../styles.js'

const useStyles = makeStyles((theme) => ({
  ...styles(theme),
  modalTableContainer: {
    maxHeight: 380,
  },
  button: {
    margin: theme.spacing(1, 0),
  },
  option: {
    transform: 'translateZ(0)',
  },
}))

const AddListenersWindow = ({ options, onClose, onApprove }) => {
  const classes = useStyles()
  const dispatch = useDispatch()
  const [open, setOpen] = React.useState(false)
  const [inputValue, setInputValue] = React.useState('')
  const [autocompleteValue, setAutocompleteValue] = React.useState(null)
  const data = useSelector((state) => state.courses.listenersAddition)
  const course = useSelector((state) => state.courses.selectedCourse)
  const actions = allActions.coursesActions
  const loading = data.isLoading

  const onInputChange = (e, value) => {
    setInputValue(value)
    dispatch(actions.getListenersOptions(value))
  }

  const onAddButtonClick = () => {
    setAutocompleteValue(null)
    dispatch(actions.addListenerToList(autocompleteValue))
  }

  const removeListener = (userID) => {
    dispatch(actions.removeListenerFromList(userID))
  }

  return (
    <DialogLayout
      largeSize
      options={options}
      approveText="Сохранить изменения"
      cancelText="Отмена"
      onApprove={() => onApprove(data.list)}
      onClose={onClose}
      title={`Запись слушателей на курс «${course.Name}»`}
    >
      <Autocomplete
        open={open}
        onOpen={() => setOpen(true)}
        onClose={() => setOpen(false)}
        noOptionsText="Список пуст"
        getOptionSelected={(option, value) => option.name === value.name}
        getOptionDisabled={(option) => option.isUserAdded}
        getOptionLabel={(option) => option.name}
        options={data.options}
        loading={loading}
        inputValue={inputValue}
        value={autocompleteValue}
        onInputChange={onInputChange}
        onChange={(e, value) => {
          setAutocompleteValue(value)
        }}
        classes={{
          option: classes.option,
          noOptions: classes.option,
        }}
        renderOption={(option) => (
          <>
            <span>{option.name}</span>
            {option.isUserAdded && <CheckIcon className={classes.iconTitle} />}
          </>
        )}
        renderInput={(params) => (
          <TextField
            {...params}
            variant="outlined"
            label="Поиск слушателя"
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
        margin="dense"
        type="button"
        variant="contained"
        color="primary"
        onClick={onAddButtonClick}
        disabled={!Boolean(autocompleteValue)}
      >
        Добавить
      </Button>
      {data.list.length > 0 && (
        <TableContainer
          className={classes.modalTableContainer}
          component={Paper}
        >
          <Table size="small" stickyHeader className={classes.table}>
            <TableHead>
              <TableRow>
                <TableCell>Фамилия</TableCell>
                <TableCell style={{ width: 25 }}></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.list.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.name}</TableCell>
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
    </DialogLayout>
  )
}

export default AddListenersWindow
