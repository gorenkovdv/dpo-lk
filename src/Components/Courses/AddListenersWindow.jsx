import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Typography, Button } from '@material-ui/core'
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
import { Check as CheckIcon } from '@material-ui/icons/'
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

const AddListenersWindow = ({ options, onClose }) => {
  const classes = useStyles()
  const dispatch = useDispatch()
  const [open, setOpen] = React.useState(false)
  const [currentValue, setCurrentValue] = React.useState(null)
  const data = useSelector((state) => state.courses.listenersAddition)
  const course = useSelector((state) => state.courses.selectedCourse.ID)
  const loading = data.isLoading

  const getOptions = (value) => {
    dispatch(allActions.coursesActions.getListenersOptions(value))
  }

  return (
    <DialogLayout
      largeSize
      options={options}
      approveText="Сохранить изменения"
      cancelText="Отмена"
      onApprove={onClose}
      onClose={onClose}
      title={`Запись слушателей на курс`}
    >
      <Typography className={classes.bold}>{course.Name}</Typography>
      <Autocomplete
        open={open}
        onOpen={() => setOpen(true)}
        onClose={() => setOpen(false)}
        noOptionsText="Список пуст"
        getOptionSelected={(option, value) => option.name === value.name}
        getOptionDisabled={(option) => option.isUserAdded}
        getOptionLabel={(option) => option.name}
        onInputChange={(e, value) => {
          getOptions(value)
        }}
        onChange={(e, value) => {
          setCurrentValue(value)
        }}
        options={data.options}
        loading={loading}
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
        onClick={() => {
          dispatch(allActions.coursesActions.addListenerToList(currentValue))
          setCurrentValue('')
        }}
        disabled={!Boolean(currentValue)}
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
                <TableCell></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.list.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.name}</TableCell>
                  <TableCell></TableCell>
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
