import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { compose } from 'redux'
import {
  Grid,
  Typography,
  IconButton,
  TextField,
  MenuItem,
  Button,
  Checkbox,
  FormGroup,
  CircularProgress,
  FormControlLabel,
  Box,
  Collapse,
  Paper,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableCell,
  TableRow,
  useMediaQuery,
} from '@material-ui/core'
import Pagination from '@material-ui/lab/Pagination'
import Autocomplete from '@material-ui/lab/Autocomplete'
import { Check as CheckIcon } from '@material-ui/icons/'
import { makeStyles, useTheme } from '@material-ui/core/styles'
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown'
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp'
import MainLayout from '../Main/MainLayout'
import { DateInput } from '../Commons/FormsControls/FormsControls'
import ListenersWindow from './ListenersWindow'
import AddListenersWindow from './AddListenersWindow'
import withAuth from '../Authorization/withAuth'
import { requestCourses, changeListParams, createRequest, cancelRequest as cancelRequestAction, createListenersRequests, getListenersOptions, actions as coursesActions } from '../../store/reducers/courses'
import styles from '../../styles.js'
import { parseDate, parseCourseDate } from '../../utils/parse.js'
import { userAPI } from '../../services/api'
import Course from './Course'
import CourseMobile from './CourseMobile'
import { actions as confirmDialogActions } from '../../store/reducers/confirmDialog'

const useStyles = makeStyles((theme) => ({
  ...styles(theme),
  inlineDateField: {
    width: 175,
    '&:first-child': {
      marginRight: 10,
    },
  },
  filterPaper: {
    margin: theme.spacing(1, 0, 2, 0),
    padding: theme.spacing(1, 2),
  },
  filterCheckbox: {
    padding: theme.spacing(0.25, 1),
  },
  filterButton: {
    margin: theme.spacing(0.5, 0),
  },
  pageSizeSelect: {
    margin: theme.spacing(0, 1),
  },
  smallSelect: {
    margin: theme.spacing(1, 0.5),
    '& > div > div': {
      padding: theme.spacing(0.5),
    },
  },
}))

const CheckboxInput = ({ checked, onFilterChange, edited, label }) => {
  const classes = useStyles()
  return (
    <FormControlLabel
      control={
        <Checkbox
          checked={checked}
          className={classes.filterCheckbox}
          color="primary"
          size="small"
          onChange={(e) => onFilterChange(edited, e.target.checked)}
        />
      }
      label={label}
    />
  )
}

const CoursesList = () => {
  const classes = useStyles()
  const theme = useTheme()
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'))
  const dispatch = useDispatch()
  const currentUserID = userAPI.getUID()
  const isLoading = useSelector((state) => state.loader.isLoading)
  const data = useSelector((state) => state.courses)
  const [searchString, setSearchString] = useState(data.filters.searchString)
  const [startDate, setStartDate] = useState(data.filters.startDate)
  const [endDate, setEndDate] = useState(data.filters.endDate)
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [isListenersWindowOpen, setListenersWindowOpen] = React.useState(false)
  const [isAddListenersWindowOpen, setAddListenersWindowOpen] = React.useState(
    false
  )
  const minStartDate = data.filters.minStartDate
  const maxEndDate = data.filters.maxEndDate
  const pageCountVariants = [5, 10, 20, 50]

  React.useEffect(() => {
    const filters = data.filters
    dispatch(requestCourses(data.currentPage, data.pageSize, filters))
    // eslint-disable-next-line
  }, [dispatch])

  const handlePageChange = (e, value) => {
    if (value !== data.currentPage)
      dispatch(changeListParams(value, data.pageSize, data.filters))
  }

  const handlePageSizeChange = (e) => {
    if (e.target.value !== data.pageSize)
      dispatch(
        changeListParams(data.currentPage, e.target.value, data.filters)
      )
  }

  const handleFilterChange = (prop, value) => {
    let changes = { [prop]: value }

    switch (prop) {
      case 'CME':
        if (!value && !data.filters.traditional) changes.traditional = true
        break
      case 'traditional':
        if (!value && !data.filters.CME) changes.CME = true
        break
      case 'budgetaryOnly':
        if (value && data.filters.nonBudgetaryOnly)
          changes.nonBudgetaryOnly = false
        break
      case 'nonBudgetaryOnly':
        if (value && data.filters.budgetaryOnly) changes.budgetaryOnly = false
        break
      case 'retraining':
        if (!value && !data.filters.skillsDevelopment)
          changes.skillsDevelopment = true
        break
      case 'skillsDevelopment':
        if (!value && !data.filters.retraining) changes.retraining = true
        break
      case 'forDoctors':
        if (!value && !data.filters.forNursingStaff)
          changes.forNursingStaff = true
        break
      case 'forNursingStaff':
        if (!value && !data.filters.forDoctors) changes.forDoctors = true
        break
      case 'searchString':
        changes.searchString = value
        changes.searchUser = null
        break
      case 'searchUser':
        changes.searchString = ''
        changes.searchUser = value
        break
      default:
        break
    }

    dispatch(
      changeListParams(data.currentPage, data.pageSize, {
        ...data.filters,
        ...changes,
      })
    )
  }

  // onDialogOpen
  const submitRequestDialogOpen = (course) => {
    dispatch(
      confirmDialogActions.confirmDialogShow({
        title: `Записаться на обучение по программе`,
        text: `Вы хотите подать заявку на обучение по программе «${course.Name}»?`,
        onApprove: () => submitRequest(course),
      })
    )
  }

  const cancelRequestDialogOpen = (course) => {
    dispatch(
      confirmDialogActions.confirmDialogShow({
        title: `Отозвать заявку`,
        text: `Вы хотите отозвать заявку на обучение по программе «${course.Name}»?`,
        onApprove: () => cancelRequest(course),
      })
    )
  }

  // onDialogClose
  const confirmDialogClose = () => {
    dispatch(confirmDialogActions.confirmDialogClose())
  }

  // onDialogApprove
  const submitRequest = (course) => {
    dispatch(createRequest(course))
    confirmDialogClose()
  }

  const cancelRequest = (course) => {
    const userRow = data.list
      .find((listCourse) => parseInt(listCourse.ID) === parseInt(course.ID))
      .users.find((user) => parseInt(user.id) === parseInt(currentUserID))

    dispatch(cancelRequestAction(course, userRow.requestID))
    confirmDialogClose()
  }

  const openListenersWindow = (course) => {
    dispatch(coursesActions.setSelectedCourse(course))
    setListenersWindowOpen(true)
  }

  const openAddListenersWindow = (course) => {
    dispatch(coursesActions.setSelectedCourse(course))
    setAddListenersWindowOpen(true)
  }

  const approveAddListenersWindow = (listeners) => {
    let listenersID = listeners.map((listener) => {
      return parseInt(listener.id)
    })

    dispatch(
      createListenersRequests(data.selectedCourse.ID, listenersID)
    )

    setAddListenersWindowOpen(false)
  }

  const closeListenersWindow = () => {
    dispatch(coursesActions.setSelectedCourse(null))
    setListenersWindowOpen(false)
  }

  const closeAddListenersWindow = () => {
    dispatch(coursesActions.setSelectedCourse(null))
    dispatch(coursesActions.clearAdditionListeners())
    setAddListenersWindowOpen(false)
  }

  const minDateLimits = (value) => {
    if (value < minStartDate || value > maxEndDate) return minStartDate
    return value
  }

  const maxDateLimits = (value) => {
    if (value > maxEndDate || value < minStartDate) return maxEndDate
    return value
  }

  const approveFilterDate = (value, minDate, maxDate, filter) => {
    let currentDate = parseCourseDate(value, minDate, maxDate)
    if (currentDate && currentDate !== data.filters[filter])
      handleFilterChange(filter, currentDate)
  }

  const [autocompleteOpen, setAutocompleteOpen] = React.useState(false)
  const [autocompleteValue, setAutocompleteValue] = React.useState(null)
  const [inputValue, setInputValue] = React.useState('')
  const [selectedFilter, setSelectedFilter] = React.useState('0')
  const currentFilter = parseInt(selectedFilter)
  const loading = data.listenersAddition.isLoading

  const onInputChange = (e, value) => {
    setInputValue(value)
    dispatch(getListenersOptions(value))
  }

  const onSelectedFilterChange = (e) => {
    setSelectedFilter(e.target.value)
    setSearchString('')
    setAutocompleteValue(null)
  }

  if (isLoading) return null

  return (
    <>
      <Typography className={classes.h6} variant="h6">
        Программы повышения квалификации и профессиональной переподготовки
      </Typography>
      <Paper className={classes.filterPaper}>
        <Typography className={classes.h6} variant="h6">
          Фильтр
        </Typography>
        <Grid
          container
          direction="row"
          alignItems="center"
          onClick={() => setFiltersOpen(!filtersOpen)}
          className={classes.pointer}
          style={{ margin: '4px 0' }}
        >
          <Grid item>
            <IconButton size="small" className={classes.startIcon}>
              {filtersOpen ? (
                <KeyboardArrowUpIcon />
              ) : (
                  <KeyboardArrowDownIcon />
                )}
            </IconButton>
          </Grid>
          <Grid>
            <Typography>Расширенный фильтр</Typography>
          </Grid>
        </Grid>
        <Collapse in={filtersOpen} timeout="auto" unmountOnExit>
          <Box margin={0.5}>
            <FormGroup>
              <CheckboxInput
                checked={data.filters.enrolPossible}
                onFilterChange={handleFilterChange}
                edited="enrolPossible"
                label="Только программы, на которые возможна запись"
              />
              <CheckboxInput
                checked={data.filters.CME}
                onFilterChange={handleFilterChange}
                edited="CME"
                label="Программы непрерывного медицинского образования"
              />
              <CheckboxInput
                checked={data.filters.traditional}
                onFilterChange={handleFilterChange}
                edited="traditional"
                label="Программы традиционных курсов"
              />
              <CheckboxInput
                checked={data.filters.budgetaryOnly}
                onFilterChange={handleFilterChange}
                edited="budgetaryOnly"
                label="Только программы бюджетных курсов"
              />
              <CheckboxInput
                checked={data.filters.nonBudgetaryOnly}
                onFilterChange={handleFilterChange}
                edited="nonBudgetaryOnly"
                label="Только программы не бюджетных курсов"
              />
              <CheckboxInput
                checked={data.filters.retraining}
                onFilterChange={handleFilterChange}
                edited="retraining"
                label="Программы переподготовки"
              />
              <CheckboxInput
                checked={data.filters.skillsDevelopment}
                onFilterChange={handleFilterChange}
                edited="skillsDevelopment"
                label="Программы повышения квалификации"
              />
              <CheckboxInput
                checked={data.filters.forDoctors}
                onFilterChange={handleFilterChange}
                edited="forDoctors"
                label="Программы для врачей"
              />
              <CheckboxInput
                checked={data.filters.forNursingStaff}
                onFilterChange={handleFilterChange}
                edited="forNursingStaff"
                label="Программы для среднего медицинского персонала"
              />
            </FormGroup>
            <Grid container direction="row" alignItems="center">
              <Grid item>
                <Typography component="span">
                  Объём программы в часах:
                </Typography>
              </Grid>
              <Grid item>
                <TextField
                  select
                  autoComplete="off"
                  margin="dense"
                  className={classes.smallSelect}
                  InputProps={{ disableUnderline: true }}
                  value={data.filters.currentVolume}
                  onChange={(e) =>
                    handleFilterChange('currentVolume', e.target.value)
                  }
                >
                  <MenuItem value="0">Все</MenuItem>
                  {data.volumeList.length &&
                    data.volumeList.map((option, index) => (
                      <MenuItem key={option} value={option}>
                        {option}
                      </MenuItem>
                    ))}
                </TextField>
              </Grid>
            </Grid>
          </Box>
        </Collapse>
        <Typography>Диапазон даты начала программы курса</Typography>
        <Grid container direction="row" alignItems="flex-start">
          <Grid item className={classes.inlineDateField}>
            <DateInput
              input={{ value: startDate }}
              name="startDate"
              views={['year', 'date']}
              minDate={minStartDate}
              maxDate={maxDateLimits(endDate)}
              dateformat="DD-MM-YYYY"
              placeholder="дд-мм-гггг"
              label="Начало периода"
              onChange={(value) => setStartDate(parseDate(value))}
              onAccept={(value) =>
                approveFilterDate(
                  value,
                  minStartDate,
                  maxDateLimits(endDate),
                  'startDate'
                )
              }
              onBlur={(e) =>
                approveFilterDate(
                  e.target.value,
                  minStartDate,
                  endDate,
                  'startDate'
                )
              }
            />
          </Grid>
          <Grid item className={classes.inlineDateField}>
            <DateInput
              input={{ value: endDate }}
              name="endDate"
              views={['year', 'date']}
              minDate={minDateLimits(startDate)}
              maxDate={maxEndDate}
              dateformat="DD-MM-YYYY"
              placeholder="дд-мм-гггг"
              label="Окончание периода"
              onChange={(value) => setEndDate(parseDate(value))}
              onAccept={(value) =>
                approveFilterDate(
                  value,
                  minDateLimits(startDate),
                  maxEndDate,
                  'endDate'
                )
              }
              onBlur={(e) =>
                approveFilterDate(
                  e.target.value,
                  startDate,
                  maxEndDate,
                  'endDate'
                )
              }
            />
          </Grid>
        </Grid>
        <Grid container direction="column" alignItems="flex-start">
          <Grid container direction="row" alignItems="center">
            <Grid item>
              <Typography>Поиск по </Typography>
            </Grid>
            <Grid item>
              <TextField
                select
                autoComplete="off"
                margin="dense"
                className={classes.smallSelect}
                value={selectedFilter}
                onChange={onSelectedFilterChange}
              >
                <MenuItem value="0">
                  специальности, наименованию программы
                </MenuItem>
                <MenuItem value="1">ФИО слушателя</MenuItem>
              </TextField>
            </Grid>
          </Grid>
          {!parseInt(selectedFilter) ? (
            <Grid item className={classes.fullWidth}>
              <TextField
                name="search"
                className={classes.fullWidth}
                value={searchString}
                placeholder="Введите полностью или частично наименование специальности или программы"
                onChange={(e) => setSearchString(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter')
                    handleFilterChange('searchString', searchString)
                }}
              />
            </Grid>
          ) : (
              <Grid className={classes.fullWidth}>
                <Autocomplete
                  open={autocompleteOpen}
                  onOpen={() => setAutocompleteOpen(true)}
                  onClose={() => setAutocompleteOpen(false)}
                  noOptionsText="Список пуст"
                  getOptionSelected={(option, value) =>
                    option.name === value.name
                  }
                  getOptionDisabled={(option) => option.isUserAdded}
                  getOptionLabel={(option) =>
                    `${option.name}${option.login ? ` (${option.login})` : ``}`
                  }
                  options={data.listenersAddition.options}
                  loading={loading}
                  inputValue={inputValue}
                  value={autocompleteValue}
                  onInputChange={onInputChange}
                  onChange={(e, value) => {
                    setAutocompleteValue(value)
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && autocompleteValue) {
                      handleFilterChange('searchUser', autocompleteValue.id)
                    }
                  }}
                  classes={{
                    option: classes.option,
                    noOptions: classes.option,
                  }}
                  renderOption={(option) => (
                    <>
                      <span>{`${option.name}${option.login ? ` (${option.login})` : ``
                        }`}</span>
                      {option.isUserAdded && (
                        <CheckIcon className={classes.iconTitle} />
                      )}
                    </>
                  )}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      placeholder="Введите полностью или частично ФИО слушателя"
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
              </Grid>
            )}
          <Grid container direction="row" alignItems="center">
            <Grid item>
              <Button
                className={classes.filterButton}
                type="button"
                size="small"
                color="primary"
                onClick={() => {
                  if (!currentFilter)
                    handleFilterChange('searchString', searchString)
                  else if (autocompleteValue)
                    handleFilterChange('searchUser', autocompleteValue.id)
                }}
              >
                Поиск
              </Button>
            </Grid>
            <Grid item>
              <Button
                type="button"
                className={classes.filterButton}
                size="small"
                color="primary"
                onClick={() => {
                  if (!currentFilter) {
                    if (searchString.length) {
                      setSearchString('')
                      handleFilterChange('searchString', '')
                    }
                  } else {
                    if (autocompleteValue) {
                      setAutocompleteValue(null)
                      handleFilterChange('searchUser', null)
                    }
                  }
                }}
              >
                Очистить
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Paper>
      {data.list.length ? (
        <>
          <Grid
            container
            className={classes.verticalMargin}
            direction="row"
            alignItems="center"
          >
            <Typography component="span">На странице:</Typography>
            <TextField
              select
              autoComplete="off"
              margin="dense"
              className={classes.smallSelect}
              InputProps={{ disableUnderline: true }}
              value={data.pageSize}
              onChange={handlePageSizeChange}
            >
              {pageCountVariants.map((count) => (
                <MenuItem key={count} value={count}>
                  {count}
                </MenuItem>
              ))}
            </TextField>
            <Pagination
              color="primary"
              page={data.currentPage}
              count={Math.ceil(data.totalCount / data.pageSize)}
              onChange={handlePageChange}
            />
          </Grid>
          {!fullScreen ? (
            <TableContainer component={Paper}>
              <Table size="small" className={classes.table}>
                <TableHead>
                  <TableRow>
                    <TableCell></TableCell>
                    <TableCell>Программа</TableCell>
                    <TableCell align="left">Специальность</TableCell>
                    <TableCell style={{ minWidth: 115 }} align="center">
                      Дата начала
                    </TableCell>
                    <TableCell align="center">Объём (часов)</TableCell>
                    <TableCell align="center">
                      Стоимость на 1 чел. (руб)
                    </TableCell>
                    <TableCell style={{ minWidth: 185 }} align="center">
                      Подача заявки
                    </TableCell>
                    {data.roots.group ? (
                      <TableCell align="center">
                        Слушатели, подавшие заявки
                      </TableCell>
                    ) : null}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data.list.map((course) => (
                    <Course
                      key={course.ID}
                      roots={data.roots}
                      course={course}
                      onWindowOpen={openListenersWindow}
                      onAddWindowOpen={openAddListenersWindow}
                      onSubmitRequest={submitRequestDialogOpen}
                      onCancelRequest={cancelRequestDialogOpen}
                      currentUserID={currentUserID}
                    />
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
              <TableContainer component={Paper}>
                <Table size="small" className={classes.mobileTable}>
                  <TableBody>
                    {data.list.map((course) => (
                      <CourseMobile
                        key={course.ID}
                        roots={data.roots}
                        course={course}
                        onWindowOpen={openListenersWindow}
                        onAddWindowOpen={openAddListenersWindow}
                        onSubmitRequest={submitRequestDialogOpen}
                        onCancelRequest={cancelRequestDialogOpen}
                        currentUserID={currentUserID}
                      />
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
        </>
      ) : (
          <Typography>Список программ пуст</Typography>
        )}
      {data.selectedCourse && (
        <>
          <ListenersWindow
            options={{ open: isListenersWindowOpen }}
            onClose={closeListenersWindow}
          />
          <AddListenersWindow
            options={{ open: isAddListenersWindowOpen }}
            onClose={closeAddListenersWindow}
            onApprove={approveAddListenersWindow}
          />
        </>
      )}
    </>
  )
}

export default compose(withAuth, MainLayout)(CoursesList)
