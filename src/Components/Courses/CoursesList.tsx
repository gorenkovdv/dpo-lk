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
import { makeStyles, useTheme } from '@material-ui/core/styles'
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown'
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp'
import MainLayout from '../Main/MainLayout'
import ListenersWindow from './ListenersWindow'
import AddListenersWindow from './AddListenersWindow'
import Autocomplete from '../Commons/FormsControls/Autocomplete'
import withAuth from '../Authorization/withAuth'
import {
  requestCourses,
  changeListParams,
  createRequest,
  cancelRequest as cancelRequestAction,
  createListenersRequests,
  actions as coursesActions,
  getListenersOptions
} from '../../store/reducers/courses'
import Course from './Course'
import CourseMobile from './CourseMobile'
import { parseDate, parseCourseDate } from '../../utils/parse'
import { userAPI } from '../../services/api'
import { actions as confirmDialogActions } from '../../store/reducers/confirmDialog'
import { getIsLoading } from '../../store/selectors/loader'
import {
  getCoursesFilters,
  getCurrentPage,
  getPageSize,
  getCoursesList,
  getSelectedCourse,
  getListenersAddition,
  getVolumeList,
  getTotalCount,
  getCoursesRoots
} from '../../store/selectors/courses'
import { ICourseFilters, ISelectedCourse, IUserOption } from '../../types'
import * as queryString from 'querystring'
import history from '../../history'
import { KeyboardDatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers'
import { MaterialUiPickersDate } from '@material-ui/pickers/typings/date'
import MomentUtils from '@date-io/moment'

const useStyles = makeStyles((theme) => ({
  inlineDateField: {
    width: 175,
    '&:first-child': {
      marginRight: 10,
    },
  },
  textField: {
    boxSizing: 'border-box',
    width: '100%',
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
  h6: {
    margin: theme.spacing(1.25, 0),
  },
  pointer: {
    cursor: 'pointer',
  },
  startIcon: {
    marginRight: theme.spacing(1),
  },
  fullWidth: {
    width: '100%',
  },
  verticalMargin: {
    margin: theme.spacing(2, 0),
  },
  table: {
    minWidth: 650,
    borderCollapse: 'collapse',
  },
  iconTitle: {
    marginLeft: theme.spacing(1.25),
  },
  mobileTable: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  option: {
    transform: 'translateZ(0)',
  },
}))

type ValueOf<T> = T[keyof T]

interface ICheckboxProps {
  checked: boolean
  onFilterChange: (prop: keyof ICourseFilters, value: ValueOf<ICourseFilters>) => void
  edited: keyof ICourseFilters
  label: string
}

const CheckboxInput: React.FC<ICheckboxProps> = ({ checked, onFilterChange, edited, label }): JSX.Element => {
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

const CoursesList: React.FC = () => {
  const classes = useStyles()
  const dispatch = useDispatch()
  const theme = useTheme()
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'))
  const currentUserID = userAPI.getUID()
  const isLoading = useSelector(getIsLoading)
  const filters = useSelector(getCoursesFilters)
  const currentPage = useSelector(getCurrentPage)
  const pageSize = useSelector(getPageSize)
  const totalCount = useSelector(getTotalCount)
  const selectedCourse = useSelector(getSelectedCourse)
  const coursesList = useSelector(getCoursesList)
  const coursesRoots = useSelector(getCoursesRoots)
  const listenersAddition = useSelector(getListenersAddition)
  const pageCountVariants = [5, 10, 20, 50]

  const [filtersOpen, setFiltersOpen] = useState(false)
  const [startDate, setStartDate] = useState(filters.startDate as string | null)
  const [endDate, setEndDate] = useState(filters.endDate as string | null)
  const [searchString, setSearchString] = useState(filters.searchString)
  const [isListenersWindowOpen, setListenersWindowOpen] = useState(false)
  const [isAddListenersWindowOpen, setAddListenersWindowOpen] = useState(false)
  const [selectedFilter, setSelectedFilter] = React.useState('1')


  const [inputValue, setInputValue] = React.useState('')
  const [autocompleteOpen, setAutocompleteOpen] = React.useState(false)
  const [autocompleteValue, setAutocompleteValue] = React.useState(null as IUserOption | null)

  React.useEffect(() => {
    const parsedSearch = queryString.parse(history.location.search.substr(1))

    if (parsedSearch.search && parsedSearch.search !== selectedFilter)
      setSelectedFilter(parsedSearch.search as string)

    dispatch(requestCourses(currentPage, pageSize, filters))
    // eslint-disable-next-line
  }, [])

  React.useEffect(() => {
    const query: { search: string } = { search: selectedFilter }
    const searchString = queryString.stringify(query)

    if (history.location.search.substr(1) !== searchString)
      history.push({
        pathname: '/courses',
        search: queryString.stringify(query)
      })
  }, [selectedFilter, filters])

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    if (value !== currentPage)
      dispatch(changeListParams(value, pageSize, filters))
  }

  const handlePageSizeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    let curPageSize = parseInt(event.target.value)
    if (curPageSize !== pageSize)
      dispatch(
        changeListParams(currentPage, curPageSize, filters)
      )
  }

  const handleFilterChange = (prop: keyof ICourseFilters, value: ValueOf<ICourseFilters>) => {
    let changes = { [prop]: value }

    switch (prop) {
      case 'CME':
        if (!value && !filters.traditional) changes.traditional = true
        break
      case 'traditional':
        if (!value && !filters.CME) changes.CME = true
        break
      case 'budgetaryOnly':
        if (value && filters.nonBudgetaryOnly)
          changes.nonBudgetaryOnly = false
        break
      case 'nonBudgetaryOnly':
        if (value && filters.budgetaryOnly) changes.budgetaryOnly = false
        break
      case 'retraining':
        if (!value && !filters.skillsDevelopment)
          changes.skillsDevelopment = true
        break
      case 'skillsDevelopment':
        if (!value && !filters.retraining) changes.retraining = true
        break
      case 'forDoctors':
        if (!value && !filters.forNursingStaff)
          changes.forNursingStaff = true
        break
      case 'forNursingStaff':
        if (!value && !filters.forDoctors) changes.forDoctors = true
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
      changeListParams(currentPage, pageSize, {
        ...filters,
        ...changes,
      })
    )
  }

  // onDialogOpen
  const submitRequestDialogOpen = (course: ISelectedCourse) => {
    dispatch(
      confirmDialogActions.confirmDialogShow({
        title: `Записаться на обучение по программе`,
        text: `Вы хотите подать заявку на обучение по программе «${course.Name}»?`,
        onApprove: () => submitRequest(course),
      })
    )
  }

  const cancelRequestDialogOpen = (course: ISelectedCourse) => {
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
  const submitRequest = (course: ISelectedCourse) => {
    dispatch(createRequest(course))
    confirmDialogClose()
  }

  const cancelRequest = (course: ISelectedCourse) => {
    const userRow = coursesList.filter(
      (listCourse) => listCourse.ID === course.ID)[0].users.filter(
        user => user.id.toString() === currentUserID.toString()
      )[0]

    dispatch(cancelRequestAction(course, userRow.requestID))
    confirmDialogClose()
  }

  const openListenersWindow = (course: ISelectedCourse) => {
    dispatch(coursesActions.setSelectedCourse(course))
    setListenersWindowOpen(true)
  }

  const openAddListenersWindow = (course: ISelectedCourse) => {
    dispatch(coursesActions.setSelectedCourse(course))
    setAddListenersWindowOpen(true)
  }

  const approveAddListenersWindow = (listeners: IUserOption[]) => {
    let listenersID = listeners.map((listener) => {
      return listener.id
    })

    if (selectedCourse)
      dispatch(
        createListenersRequests(selectedCourse.ID, listenersID)
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

  const minDateLimits = (value: string | null) => {
    if (value !== null && (value < filters.minStartDate || value > filters.maxEndDate)) return filters.minStartDate
    return value
  }

  const maxDateLimits = (value: string | null) => {
    if (value !== null && (value > filters.maxEndDate || value < filters.minStartDate)) return filters.maxEndDate
    return value
  }

  const approveFilterDate = (value: string | null, minDate: string | null, maxDate: string | null, filter: keyof ICourseFilters) => {
    let currentDate = parseCourseDate(value, minDate, maxDate)
    if (currentDate && currentDate !== filters[filter])
      handleFilterChange(filter, currentDate)
  }

  const onSelectedFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedFilter(event.target.value)
    setSearchString('')
    setAutocompleteValue(null)
  }

  const onInputChange = (event: React.ChangeEvent<{}>, value: string) => {
    if (value === '') setAutocompleteValue(null)
    setInputValue(value)
    dispatch(getListenersOptions(value))
  }

  const volumeList = useSelector(getVolumeList)

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
              {filtersOpen ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
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
                checked={filters.enrolPossible}
                onFilterChange={handleFilterChange}
                edited="enrolPossible"
                label="Только программы, на которые возможна запись"
              />
              <CheckboxInput
                checked={filters.CME}
                onFilterChange={handleFilterChange}
                edited="CME"
                label="Программы непрерывного медицинского образования"
              />
              <CheckboxInput
                checked={filters.traditional}
                onFilterChange={handleFilterChange}
                edited="traditional"
                label="Программы традиционных курсов"
              />
              <CheckboxInput
                checked={filters.budgetaryOnly}
                onFilterChange={handleFilterChange}
                edited="budgetaryOnly"
                label="Только программы бюджетных курсов"
              />
              <CheckboxInput
                checked={filters.nonBudgetaryOnly}
                onFilterChange={handleFilterChange}
                edited="nonBudgetaryOnly"
                label="Только программы не бюджетных курсов"
              />
              <CheckboxInput
                checked={filters.retraining}
                onFilterChange={handleFilterChange}
                edited="retraining"
                label="Программы переподготовки"
              />
              <CheckboxInput
                checked={filters.skillsDevelopment}
                onFilterChange={handleFilterChange}
                edited="skillsDevelopment"
                label="Программы повышения квалификации"
              />
              <CheckboxInput
                checked={filters.forDoctors}
                onFilterChange={handleFilterChange}
                edited="forDoctors"
                label="Программы для врачей"
              />
              <CheckboxInput
                checked={filters.forNursingStaff}
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
                  value={filters.currentVolume}
                  onChange={(e) =>
                    handleFilterChange('currentVolume', e.target.value)
                  }
                >
                  <MenuItem value="0">Все</MenuItem>
                  {volumeList.map((option) => (
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
        <MuiPickersUtilsProvider utils={MomentUtils} locale={`ru`}>
          <Grid container direction="row" alignItems="flex-start">
            <Grid item className={classes.inlineDateField}>
              <KeyboardDatePicker
                autoOk
                value={startDate}
                views={['year', 'date']}
                label="Окончание периода"
                variant="inline"
                maskChar={'0'}
                format="DD-MM-YYYY"
                placeholder="дд-мм-гггг"
                className={classes.textField}
                invalidDateMessage="Неверный формат даты"
                inputVariant="outlined"
                margin="dense"
                InputAdornmentProps={{ position: 'start' }}
                KeyboardButtonProps={{ size: 'small' }}
                onChange={(date: MaterialUiPickersDate) => setStartDate(parseDate(date))}
                onAccept={(date: MaterialUiPickersDate) => {
                  approveFilterDate(
                    String(date),
                    filters.minStartDate,
                    maxDateLimits(endDate),
                    'startDate'
                  )
                }}
                onBlur={(event: React.FocusEvent<HTMLInputElement>) => (endDate !== null) ?
                  approveFilterDate(
                    event.target.value,
                    filters.minStartDate,
                    endDate,
                    'startDate'
                  ) : null}
              />
            </Grid>
            <Grid item className={classes.inlineDateField}>
              <KeyboardDatePicker
                autoOk
                value={endDate}
                views={['year', 'date']}
                label="Окончание периода"
                variant="inline"
                maskChar={'0'}
                format="DD-MM-YYYY"
                placeholder="дд-мм-гггг"
                className={classes.textField}
                invalidDateMessage="Неверный формат даты"
                inputVariant="outlined"
                margin="dense"
                InputAdornmentProps={{ position: 'start' }}
                KeyboardButtonProps={{ size: 'small' }}
                onChange={(date: MaterialUiPickersDate) => setEndDate(parseDate(date))}
                onAccept={(date: MaterialUiPickersDate) => {
                  approveFilterDate(
                    String(date),
                    minDateLimits(startDate),
                    filters.maxEndDate,
                    'endDate'
                  )
                }}
                onBlur={(event: React.FocusEvent<HTMLInputElement>) => startDate !== null ?
                  approveFilterDate(
                    event.target.value,
                    startDate,
                    filters.maxEndDate,
                    'endDate'
                  ) : null}
              />
            </Grid>
          </Grid>
        </MuiPickersUtilsProvider>
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
                onChange={(event) => setSearchString(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter')
                    handleFilterChange('searchString', searchString)
                }}
              />
            </Grid>
          ) : (
            <Grid className={classes.fullWidth}>
              <Autocomplete
                isOpen={autocompleteOpen}
                onOpen={() => setAutocompleteOpen(true)}
                onClose={() => setAutocompleteOpen(false)}
                options={listenersAddition.options}
                isLoading={listenersAddition.isLoading}
                value={autocompleteValue}
                setValue={(value: IUserOption) => setAutocompleteValue(value)}
                inputValue={inputValue}
                onInputChange={onInputChange}
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
                  if (!parseInt(selectedFilter))
                    handleFilterChange('searchString', searchString)
                  else {
                    if (autocompleteValue) {
                      handleFilterChange('searchUser', autocompleteValue.id)
                    }
                  }
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
                  if (!parseInt(selectedFilter)) {
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
      {coursesList.length ? (
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
              value={pageSize}
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
              page={currentPage}
              count={Math.ceil(totalCount / pageSize)}
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
                    {coursesRoots.group ? (
                      <TableCell align="center">
                        Слушатели, подавшие заявки
                      </TableCell>
                    ) : null}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {coursesList.map((course) => (
                    <Course
                      key={course.ID}
                      roots={coursesRoots}
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
                  {coursesList.map((course) => (
                    <CourseMobile
                      key={course.ID}
                      roots={coursesRoots}
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
      {selectedCourse && (
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
