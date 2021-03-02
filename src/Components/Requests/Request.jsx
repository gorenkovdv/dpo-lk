import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import {
  Grid,
  Typography,
  Tooltip,
  IconButton,
  TableCell,
  TableRow,
} from '@material-ui/core'
import { Clear as ClearIcon } from '@material-ui/icons'
import styles from '../../styles.js'
import moodleIcon from '../../img/moodle.png'
import cmeIcon from '../../img/CME.png'
import cardIcon from '../../img/personal_card.png'
import moneyIcon from '../../img/money.png'
import contrAnsIcon from '../../img/contr_ans.png'
import sertIcon from '../../img/sert.png'
import { userAPI } from '../../services/api'

const useStyles = makeStyles((theme) => ({
  ...styles(theme),
  imageIcon: {
    width: 24,
    marginRight: theme.spacing(0.5),
  },
}))

const Request = ({
  row,
  onCancelRequest,
  onDocumentsDialogOpen,
  onRequestCMEDialogOpen,
}) => {
  const classes = useStyles()
  const uid = userAPI.getUID()

  let currentRequest = {
    ID: row.requestID,
    rowID: row.rowID,
    courseName: row.Name,
    Price: row.Price,
    DocumentsApproved: row.DocumentsApproved,
  }
  const IsCME = parseInt(row.IsCME)

  return (
    <>
      <TableRow key={row.ID}>
        <TableCell>
          <Typography noWrap>{`Заявка от ${row.RequestCreateDate}`}</Typography>
          {IsCME ? (
            <Tooltip title="Непрерывное медицинское образование">
              <img className={classes.imageIcon} src={cmeIcon} alt="cmeIcon" />
            </Tooltip>
          ) : null}
          {parseInt(row.Price) > 0 && (
            <Tooltip title="Хозрасчётный курс">
              <img
                className={classes.imageIcon}
                src={moneyIcon}
                alt="cmeIcon"
              />
            </Tooltip>
          )}
          <Typography>
            <small>{`Начало обучения с ${row.BeginDate}`}</small>
          </Typography>
        </TableCell>
        <TableCell>
          <Typography>{row.Name}</Typography>
          {row.Territory && (
            <small className={classes.block}>({row.Territory})</small>
          )}
          <small
            className={classes.block}
          >{`Специальность: ${row.Speciality}`}</small>
        </TableCell>
        <TableCell align="center">
          {row.MoodleID && (
            <Tooltip title="Курс на платформе внеаудиторной учебной работы (Moodle)">
              <IconButton>
                <a
                  href={`http://do.asmu.ru/enrol/index.php?id=${row.MoodleID}`}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  <img
                    style={{ width: 35 }}
                    src={moodleIcon}
                    alt="moodleIcon"
                  />
                </a>
              </IconButton>
            </Tooltip>
          )}
        </TableCell>
        <TableCell align="center">
          {parseInt(row.Price) > 0 ? (
            <IconButton onClick={() => onDocumentsDialogOpen(currentRequest)}>
              <img
                style={{ width: 35 }}
                src={contrAnsIcon}
                alt="contrAnsIcon"
              />
            </IconButton>
          ) : (
            'Оформление договора не требуется'
          )}
        </TableCell>
        <TableCell align="center">
          {IsCME ? (
            <Tooltip title="Заявка с портала НМО">
              <IconButton
                onClick={() => onRequestCMEDialogOpen(currentRequest)}
              >
                <img style={{ width: 35 }} src={sertIcon} alt="sertIcon" />
              </IconButton>
            </Tooltip>
          ) : (
            'Традиционный курс'
          )}
        </TableCell>
        <TableCell align="center">
          <Tooltip title="Личная карточка">
            <IconButton>
              <a
                href={`http://localhost/templates/personal_card.php?uid=${uid}&course=${row.ID}`}
                rel="noopener noreferrer"
                target="_blank"
              >
                <img style={{ width: 35 }} src={cardIcon} alt="cardIcon" />
              </a>
            </IconButton>
          </Tooltip>
        </TableCell>
        <TableCell>
          {IsCME && !row.RequestCME ? (
            <Grid
              container
              direction="row"
              alignItems="flex-start"
              className={classes.pointer}
              onClick={() => onRequestCMEDialogOpen(currentRequest)}
            >
              <Grid item>
                <img
                  className={classes.imageIcon}
                  src={sertIcon}
                  alt="moodleIcon"
                />
              </Grid>
              <Grid item>
                <small>
                  Укажите специальность и номер заявки с портала НМО!
                </small>
              </Grid>
            </Grid>
          ) : null}
          {parseInt(row.Price) > 0 && !parseInt(row.DocumentsApproved) ? (
            <Grid
              container
              direction="row"
              alignItems="flex-start"
              className={classes.pointer}
              onClick={() => onDocumentsDialogOpen(currentRequest)}
            >
              <Grid item>
                <img
                  className={classes.imageIcon}
                  src={contrAnsIcon}
                  alt="moodleIcon"
                />
              </Grid>
              <Grid item>
                <small>Необходимо Ваше участие в оформлении документов</small>
              </Grid>
            </Grid>
          ) : null}
        </TableCell>
        <TableCell>
          <Tooltip title="Отменить заявку">
            <IconButton
              onClick={() => onCancelRequest(currentRequest)}
              size="small"
            >
              <ClearIcon />
            </IconButton>
          </Tooltip>
        </TableCell>
      </TableRow>
    </>
  )
}

export default Request
