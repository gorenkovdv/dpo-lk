import React from 'react'
import {
  Tooltip,
  Typography,
  IconButton,
  Button,
  Grid,
  Box,
  Collapse,
  TableRow,
  TableCell,
} from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import { Add as AddIcon } from '@material-ui/icons/'
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown'
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp'
import PeopleIcon from '@material-ui/icons/People'
import moodleIcon from '../../img/moodle.png'
import cmeIcon from '../../img/CME.png'
import * as moment from 'moment'

const useStyles = makeStyles((theme) => ({
  root: {
    '& > *': {
      borderBottom: 'unset',
    },
  },
  imageIcon: {
    width: 35,
    marginRight: theme.spacing(0.5),
  },
  imageContainer: {
    padding: theme.spacing(1.5),
    '&:first-child': {
      paddingLeft: 0,
    },
  },
  block: {
    display: 'block',
  },
  button: {
    margin: theme.spacing(2, 0),
  },
}))

const CourseMobile = ({
  roots,
  course,
  onWindowOpen,
  onAddWindowOpen,
  onSubmitRequest,
  onCancelRequest,
  currentUserID,
}) => {
  const classes = useStyles()
  const [open, setOpen] = React.useState(false)
  const isListener = sessionStorage.pagesType === 'listener'
  let currentCourse = { ID: course.ID, Name: course.Name }
  const rootsGroup = parseInt(roots.group)

  const currentUserRequests = course.users.filter(
    (user) => parseInt(user.id) === parseInt(currentUserID)
  )

  const isRequestDateExpired =
    moment().format('YYYY-MM-DD') <=
    moment(course.RequestDate).format('YYYY-MM-DD')

  const haveRoots = (course) => {
    if (!rootsGroup) return false

    return (
      [1, 2].includes(rootsGroup) ||
      (rootsGroup === 3 && course.DepartmentGUID === roots.cathedra)
    )
  }

  return (
    <>
      <TableRow className={classes.root}>
        <TableCell style={{ width: 15, padding: 5 }}>
          <Tooltip title="Описание программы">
            <IconButton
              aria-label="expand row"
              size="small"
              onClick={() => setOpen(!open)}
            >
              {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
            </IconButton>
          </Tooltip>
        </TableCell>
        <TableCell align="left">
          <Typography style={{ marginBottom: 10 }} variant="h6">
            {course.Name}
            {course.Territory && (
              <small className={classes.block}>{`(${course.Territory})`}</small>
            )}
          </Typography>

          <small className={classes.block}>
            Объём (часов): {course.Volume}
          </small>
          <small className={classes.block}>Дата начала: {course.BeginDate}</small>
          <small className={classes.block}>
            Группа слушателей: {course.ListenersGroup}
          </small>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell colSpan={2}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box margin={1}>
              <Grid container direction="row" alignItems="flex-start">
                {course.MoodleID && (
                  <Grid className={classes.imageContainer} item>
                    <Tooltip title="Курс на платформе внеаудиторной учебной работы (Moodle)">
                      <a
                        href={`http://do.asmu.ru/enrol/index.php?id=${course.MoodleID}`}
                        rel="noopener noreferrer"
                        target="_blank"
                      >
                        <img
                          className={classes.imageIcon}
                          src={moodleIcon}
                          alt="moodleIcon"
                        />
                      </a>
                    </Tooltip>
                  </Grid>
                )}
                {parseInt(course.IsCME) === 1 && (
                  <Grid className={classes.imageContainer} item>
                    <Tooltip title="Непрерывное медицинское образование">
                      <img
                        className={classes.imageIcon}
                        src={cmeIcon}
                        alt="cmeIcon"
                      />
                    </Tooltip>
                  </Grid>
                )}
                {rootsGroup ? (
                  <Grid item>
                    {haveRoots(course) ? (
                      <Grid container direction="row" alignItems="center">
                        {course.users.length > 0 && (
                          <Grid item>
                            <IconButton
                              onClick={() => onWindowOpen(currentCourse)}
                            >
                              <PeopleIcon fontSize="large" />
                            </IconButton>
                          </Grid>
                        )}
                        <Grid item>
                          <IconButton
                            onClick={() => onAddWindowOpen(currentCourse)}
                          >
                            <AddIcon fontSize="large" />
                          </IconButton>
                        </Grid>
                      </Grid>
                    ) : null}
                  </Grid>
                ) : null}
              </Grid>
              <Typography>Специальность: {course.Speciality}</Typography>

              <Typography>
                {parseInt(course.Price) !== 0
                  ? 'Стоимость на 1 чел. (руб): ' + course.Price
                  : 'Бюджет'}
              </Typography>
              {isRequestDateExpired ? (
                <Grid container direction="column" alignItems="flex-start">
                  {isListener && (
                    <Button
                      className={classes.button}
                      type="button"
                      size="small"
                      variant={
                        currentUserRequests.length > 0
                          ? 'outlined'
                          : 'contained'
                      }
                      color="primary"
                      onClick={() => {
                        if (currentUserRequests.length > 0)
                          onCancelRequest(currentCourse)
                        else onSubmitRequest(currentCourse)
                      }}
                    >
                      {currentUserRequests.length > 0
                        ? `Отозвать заявку`
                        : `Подать заявку`}
                    </Button>
                  )}
                </Grid>
              ) : (
                <small>
                  срок подачи истёк
                  <br />
                  {course.RequestDate}
                </small>
              )}
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  )
}

export default CourseMobile
