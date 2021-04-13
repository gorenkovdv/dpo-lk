import React, { ChangeEvent, useState, FC } from 'react'
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
import {
  requestCourses,
  changeListParams,
  createRequest,
  cancelRequest as cancelRequestAction,
  createListenersRequests,
  getListenersOptions,
  actions as coursesActions
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
import { parseUserOption } from '../../utils/parse'

const useStyles = makeStyles((theme) => ({
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

const CheckboxInput: FC<ICheckboxProps> = ({ checked, onFilterChange, edited, label }): JSX.Element => {
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

const CoursesList: FC = () => {
  const classes = useStyles()
  const theme = useTheme()
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'))
  const dispatch = useDispatch()
  const currentUserID = userAPI.getUID()
  const isLoading = useSelector(getIsLoading)
  const filters = useSelector(getCoursesFilters)
  const currentPage = useSelector(getCurrentPage)
  const pageSize = useSelector(getPageSize)
  const totalCount = useSelector(getTotalCount)
  const selectedCourse = useSelector(getSelectedCourse)
  const coursesList = useSelector(getCoursesList)
  const coursesRoots = useSelector(getCoursesRoots)
  const [searchString, setSearchString] = useState(filters.searchString)
  const [startDate, setStartDate] = useState(filters.startDate)
  const [endDate, setEndDate] = useState(filters.endDate)
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [isListenersWindowOpen, setListenersWindowOpen] = useState(false)
  const [isAddListenersWindowOpen, setAddListenersWindowOpen] = useState(
    false
  )
  const pageCountVariants = [5, 10, 20, 50]

  React.useEffect(() => {
    dispatch(requestCourses(currentPage, pageSize, filters))
    // eslint-disable-next-line
  }, [dispatch])

  const handlePageChange = (event: ChangeEvent<unknown>, value: number) => {
    if (value !== currentPage)
      dispatch(changeListParams(value, pageSize, filters))
  }

  const handlePageSizeChange = (event: any) => {
    if (event.target.value !== pageSize)
      dispatch(
        changeListParams(currentPage, event.target.value, filters)
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

  const minDateLimits = (value: string) => {
    if (value < filters.minStartDate || value > filters.maxEndDate) return filters.minStartDate
    return value
  }

  const maxDateLimits = (value: string) => {
    if (value > filters.maxEndDate || value < filters.minStartDate) return filters.maxEndDate
    return value
  }

  const approveFilterDate = (value: string, minDate: string, maxDate: string, filter: keyof ICourseFilters) => {
    let currentDate = parseCourseDate(value, minDate, maxDate)
    if (currentDate && currentDate !== filters[filter])
      handleFilterChange(filter, currentDate)
  }

  const [autocompleteOpen, setAutocompleteOpen] = React.useState(false)
  const [autocompleteValue, setAutocompleteValue] = React.useState(null as IUserOption | null)
  const [inputValue, setInputValue] = React.useState('')
  const [selectedFilter, setSelectedFilter] = React.useState('0')
  const listenersAddition = useSelector(getListenersAddition)
  const loading = listenersAddition.isLoading

  const onInputChange = (e: ChangeEvent<{}>, value: string) => {
    setInputValue(value)
    dispatch(getListenersOptions(value))
  }

  const onSelectedFilterChange = (e: any) => {
    setSelectedFilter(e.target.value)
    setSearchString('')
    setAutocompleteValue(null)
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
        <Grid container direction="row" alignItems="flex-start">
          <Grid item className={classes.inlineDateField}>
            <DateInput
              //@ts-ignore
              input={{ value: startDate }}
              name="startDate"
              views={['year', 'date']}
              minDate={filters.minStartDate}
              maxDate={maxDateLimits(endDate)}
              dateformat="DD-MM-YYYY"
              placeholder="дд-мм-гггг"
              label="Начало периода"
              onChange={(value: string) => setStartDate(parseDate(value))}
              onAccept={(value: string) =>
                approveFilterDate(
                  value,
                  filters.minStartDate,
                  maxDateLimits(endDate),
                  'startDate'
                )
              }
              onBlur={(e: any) =>
                approveFilterDate(
                  e.target.value,
                  filters.minStartDate,
                  endDate,
                  'startDate'
                )
              }
            />
          </Grid>
          <Grid item className={classes.inlineDateField}>
            <DateInput
              //@ts-ignore
              input={{ value: endDate }}
              name="endDate"
              views={['year', 'date']}
              minDate={minDateLimits(startDate)}
              maxDate={filters.maxEndDate}
              dateformat="DD-MM-YYYY"
              placeholder="дд-мм-гггг"
              label="Окончание периода"
              onChange={(value: string) => setEndDate(parseDate(value))}
              onAccept={(value: string) =>
                approveFilterDate(
                  value,
                  minDateLimits(startDate),
                  filters.maxEndDate,
                  'endDate'
                )
              }
              onBlur={(e: any) =>
                approveFilterDate(
                  e.target.value,
                  startDate,
                  filters.maxEndDate,
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
                getOptionSelected={(option, value) => option.name === value.name}
                getOptionDisabled={(option) => option.isUserAdded}
                getOptionLabel={parseUserOption}
                options={listenersAddition.options}
                loading={loading}
                inputValue={inputValue}
                value={autocompleteValue}
                onInputChange={onInputChange}
                onChange={(e: ChangeEvent<{}>, value: IUserOption | null) => {
                  if (value) setAutocompleteValue(value)
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
                    <span>{parseUserOption(option)}</span>
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
                          {loading && (
                            <CircularProgress color="inherit" size={20} />
                          )}
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
