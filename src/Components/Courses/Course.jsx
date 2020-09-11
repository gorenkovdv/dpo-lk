import React from 'react'
import {
  Tooltip,
  Typography,
  IconButton,
  Button,
  Grid,
} from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import { Check as CheckIcon, Add as AddIcon } from '@material-ui/icons/'
import Box from '@material-ui/core/Box'
import Collapse from '@material-ui/core/Collapse'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableRow from '@material-ui/core/TableRow'
import TableCell from '@material-ui/core/TableCell'
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
    width: 24,
    marginRight: theme.spacing(0.5),
  },
  block: {
    display: 'block',
  },
  button: {
    margin: theme.spacing(0.5, 0),
  },
}))

const Course = ({
  roots,
  course,
  onWindowOpen,
  onAddWindowOpen,
  onSubmitRequest,
  onCancelRequest,
}) => {
  const classes = useStyles()
  const [open, setOpen] = React.useState(false)
  const isListener = sessionStorage.pagesType === 'listener'
  let currentCourse = { ID: course.ID, Name: course.Name }
  const rootsGroup = parseInt(roots.group)

  const isRequestDateExpired =
    moment().format('YYYY-MM-DD') <=
    moment(course.RequestDate).format('YYYY-MM-DD')

  const showUsers = (course) => {
    if (!rootsGroup) return false

    return (
      course.users.length &&
      ([1, 2].includes(rootsGroup) ||
        (rootsGroup === 3 && course.DepartmentGUID === roots.cathedra))
    )
  }

  return (
    <>
      <TableRow className={classes.root}>
        <TableCell>
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
        <TableCell>
          <Typography>{course.Name}</Typography>
          {course.Territory && (
            <small className={classes.block}>({course.Territory})</small>
          )}
          {parseInt(course.IsCME) === 1 && (
            <Tooltip title="Непрерывное медицинское образование">
              <img className={classes.imageIcon} src={cmeIcon} alt="cmeIcon" />
            </Tooltip>
          )}
          {course.MoodleID && (
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
          )}
          {course.AdditionalSpecialities && (
            <Tooltip title="Имеются дополнительные специальности для прохождения обучения по циклу">
              <CheckIcon />
            </Tooltip>
          )}
        </TableCell>
        <TableCell align="left">{course.Speciality}</TableCell>
        <TableCell align="center">
          <span>{course.BeginDate}</span>
          {course.StartDateTooltip && (
            <small className={classes.block}>{course.StartDateTooltip}</small>
          )}
        </TableCell>
        <TableCell align="center">{course.Volume}</TableCell>
        <TableCell align="center">
          {parseInt(course.Price) !== 0 ? course.Price : 'Бюджет'}
        </TableCell>
        <TableCell align="center">
          {isRequestDateExpired ? (
            <Grid container direction="column" alignItems="center">
              {isListener && (
                <Button
                  className={classes.button}
                  type="button"
                  size="small"
                  variant={!course.haveRequest ? 'contained' : 'outlined'}
                  color="primary"
                  onClick={() => {
                    if (!course.haveRequest) onSubmitRequest(currentCourse)
                    else onCancelRequest(currentCourse)
                  }}
                >
                  {!course.haveRequest ? `Подать заявку` : `Отозвать заявку`}
                </Button>
              )}
              <small>
                срок подачи до
                <br />
                {course.RequestDate}
              </small>
            </Grid>
          ) : (
            <small>
              срок подачи истёк
              <br />
              {course.RequestDate}
            </small>
          )}
        </TableCell>
        {rootsGroup ? (
          <TableCell align="center">
            <Typography>{course.users.length}</Typography>
            {showUsers(course) ? (
              <Grid container direction="column" alignItems="center">
                <Grid item>
                  <IconButton onClick={() => onWindowOpen(currentCourse)}>
                    <PeopleIcon fontSize="large" />
                  </IconButton>
                </Grid>
                <Grid item>
                  <IconButton onClick={() => onAddWindowOpen(currentCourse)}>
                    <AddIcon size="large" />
                  </IconButton>
                </Grid>
              </Grid>
            ) : null}
          </TableCell>
        ) : null}
      </TableRow>
      <TableRow>
        <TableCell
          style={{ paddingBottom: 0, paddingTop: 0 }}
          colSpan={rootsGroup ? 8 : 7}
        >
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box margin={1}>
              <Typography variant="h6" gutterBottom component="div">
                {`${course.Name} (${course.ID})`}
              </Typography>
              <Table size="small">
                <TableBody>
                  <TableRow>
                    <TableCell style={{ width: '25%' }} align="right">
                      Специальность
                    </TableCell>
                    <TableCell align="left">{course.Speciality}</TableCell>
                  </TableRow>
                  {course.AdditionalSpecialities ? (
                    <TableRow>
                      <TableCell align="right">
                        Возможные специальности для прохождения обучения по
                        циклу
                      </TableCell>
                      <TableCell align="left">
                        {course.AdditionalSpecialities}
                      </TableCell>
                    </TableRow>
                  ) : null}
                  <TableRow>
                    <TableCell align="right">
                      Укрупнённая группа специальностей (УГС)
                    </TableCell>
                    <TableCell align="left">{course.EGS}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell align="right">
                      Вид профессионального обучения
                    </TableCell>
                    <TableCell align="left">
                      {course.ProfEducationType}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell align="right">Количество часов</TableCell>
                    <TableCell align="left">{course.Volume}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell align="right">Дата начала</TableCell>
                    <TableCell align="left">{course.BeginDate}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell align="right">Дата окончания</TableCell>
                    <TableCell align="left">{course.EndDate}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell align="right">Стоимость обучения</TableCell>
                    <TableCell align="left">
                      {parseInt(course.Price) !== 0
                        ? course.Price
                        : 'за счёт средств бюджета'}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell align="right">Форма обучения</TableCell>
                    <TableCell align="left">{course.EducationForm}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell align="right">Кафедра</TableCell>
                    <TableCell align="left">{course.Department}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  )
}

export default Course
