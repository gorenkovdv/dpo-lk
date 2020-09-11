import React from 'react'
import { useDispatch } from 'react-redux'
import { Field, reduxForm, submit } from 'redux-form'
import { makeStyles } from '@material-ui/core/styles'
import { Typography, Tooltip, IconButton } from '@material-ui/core'
import { Clear as ClearIcon, Edit as EditIcon } from '@material-ui/icons'
import TableCell from '@material-ui/core/TableCell'
import TableRow from '@material-ui/core/TableRow'
import DialogLayout from '../Commons/Dialog/DialogLayout'
import { MaskedInput, Input } from '../Commons/FormsControls/FormsControls'
import { required, isStringContainsUnderscore } from '../../utils/validate.js'
import styles from '../../styles.js'
import moodleIcon from '../../img/moodle.png'
import cmeIcon from '../../img/CME.png'
import cardIcon from '../../img/personal_card.png'
import moneyIcon from '../../img/money.png'
import sertIcon from '../../img/sert.png'
import allActions from '../../store/actions'
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
  const dispatch = useDispatch()

  const [requestCMEDialogParams, setRequestCMEDialogParams] = React.useState({
    open: false,
    disabled: true,
  })

  const requestCMEDialogClose = () => {
    setRequestCMEDialogParams({ open: false, disabled: true })
  }

  const handleSubmit = (values) => {
    dispatch(
      allActions.requestsActions.updateCMERequest({
        ...values,
        rowID: course.rowID,
      })
    )

    requestCMEDialogClose()
  }

  let initialValues = {}
  if (course.RequestCME) {
    const parsedCME = JSON.parse(course.RequestCME)
    initialValues = {
      speciality: parsedCME[0],
      number: parsedCME[1],
    }
  }

  return (
    <>
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
              <img
                className={classes.imageIcon}
                src={moneyIcon}
                alt="cmeIcon"
              />
            </Tooltip>
          )}
          <Typography>
            <small>{`Начало обучения с ${course.BeginDate}`}</small>
          </Typography>
        </TableCell>
        <TableCell>
          <Typography>{course.Name}</Typography>
          <small>{`Специальность: ${course.Speciality}`}</small>
        </TableCell>
        <TableCell align="center">
          {course.MoodleID && (
            <Tooltip title="Курс на платформе внеаудиторной учебной работы (Moodle)">
              <IconButton>
                <a
                  href={`http://do.asmu.ru/enrol/index.php?id=${course.MoodleID}`}
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
          <Tooltip title="Заявка с портала НМО">
            <IconButton
              onClick={() => {
                setRequestCMEDialogParams({ open: true, disabled: false })
              }}
            >
              {!course.RequestCME ? (
                <img style={{ width: 35 }} src={sertIcon} alt="moodleIcon" />
              ) : (
                <EditIcon />
              )}
            </IconButton>
          </Tooltip>
        </TableCell>
        <TableCell align="center">
          <Tooltip title="Личная карточка">
            <IconButton>
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

      <DialogLayout
        options={requestCMEDialogParams}
        onClose={requestCMEDialogClose}
        onApprove={() => dispatch(submit('requestCMEForm'))}
        approveText="Подтвердить"
        cancelText="Отмена"
        title="Заявка с портала НМО"
        text={`Программа «${course.Name}»`}
      >
        <RequestCMEForm onSubmit={handleSubmit} initialValues={initialValues} />
      </DialogLayout>
    </>
  )
}

let RequestCMEForm = (props) => {
  const specialityFieldRef = React.useRef(null)

  React.useEffect(() => {
    specialityFieldRef.current.focus()
  }, [])

  return (
    <form onSubmit={props.handleSubmit}>
      <Field
        inputRef={specialityFieldRef}
        name="speciality"
        component={Input}
        label="Специальность"
        validate={required}
        required
      />
      <Field
        name="number"
        component={MaskedInput}
        mask={`NMO-999999-2099`}
        label="Номер документа"
        validate={[required, isStringContainsUnderscore]}
        required
      />
    </form>
  )
}

RequestCMEForm = reduxForm({ form: 'requestCMEForm' })(RequestCMEForm)

export default Request
