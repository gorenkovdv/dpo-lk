import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { Typography, Tooltip, IconButton } from '@material-ui/core'
import { Clear as ClearIcon } from '@material-ui/icons'
import TableCell from '@material-ui/core/TableCell'
import TableRow from '@material-ui/core/TableRow'
import styles from '../../styles.js'
import moodleIcon from '../../img/moodle.png'
import cmeIcon from '../../img/CME.png'
import cardIcon from '../../img/personal_card.png'
import moneyIcon from '../../img/money.png'
import { userAPI } from '../../services/api'

const useStyles = makeStyles((theme) => ({
  ...styles(theme),
  imageIcon: {
    width: 24,
    marginRight: theme.spacing(0.5),
  },
}))

const Request = ({ course, onCancelRequest }) => {
  const classes = useStyles()
  const uid = userAPI.getUID()

  return (
    <TableRow key={course.ID}>
      <TableCell>
        <Typography
          noWrap
        >{`Заявка от ${course.RequestCreateDate}`}</Typography>
        {parseInt(course.IsCME) === 1 && (
          <Tooltip title="Непрерывное медицинское образование">
            <img className={classes.imageIcon} src={cmeIcon} alt="cmeIcon" />
          </Tooltip>
        )}
        {parseInt(course.Price) !== 0 && (
          <Tooltip title="Хозрасчётный курс">
            <img className={classes.imageIcon} src={moneyIcon} alt="cmeIcon" />
          </Tooltip>
        )}
        <Typography>{`Начало обучения с ${course.BeginDate}`}</Typography>
      </TableCell>
      <TableCell>
        <Typography>{course.Name}</Typography>
        <small>{`Специальность: ${course.Speciality}`}</small>
      </TableCell>
      <TableCell align="center">
        {course.MoodleID && (
          <Tooltip title="Курс на платформе внеаудиторной учебной работы (Moodle)">
            <IconButton size="small">
              <a
                href={`http://do.asmu.ru/enrol/index.php?id=${course.MoodleID}`}
                rel="noopener noreferrer"
                target="_blank"
              >
                <img style={{ width: 35 }} src={moodleIcon} alt="moodleIcon" />
              </a>
            </IconButton>
          </Tooltip>
        )}
      </TableCell>
      <TableCell align="center">
        <Tooltip title="Личная карточка">
          <IconButton size="small">
            <a
              href={`http://localhost/files/templates/personal_card.php?uid=${uid}&course=${course.ID}`}
              rel="noopener noreferrer"
              target="_blank"
            >
              <img style={{ width: 35 }} src={cardIcon} alt="cardIcon" />
            </a>
          </IconButton>
        </Tooltip>
      </TableCell>
      <TableCell>
        <Tooltip title="Отменить заявку">
          <IconButton
            onClick={() =>
              onCancelRequest({ id: course.ID, name: course.Name })
            }
            size="small"
          >
            <ClearIcon />
          </IconButton>
        </Tooltip>
      </TableCell>
    </TableRow>
  )
}

export default Request
