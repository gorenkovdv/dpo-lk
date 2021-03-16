import React from 'react'
import { compose } from 'redux'
import { withRouter } from 'react-router-dom'
import { Typography, Button } from '@material-ui/core'
import { makeStyles, Theme } from '@material-ui/core/styles'
import AssignmentIcon from '@material-ui/icons/AssignmentTwoTone'
import MainLayout from '../Main/MainLayout'
import withAuth from '../Authorization/withAuth'
import document from '../../files/Poryadok-predostavleniya-dokumentov-dlya-obucheniya.pdf'

const useStyles = makeStyles((theme: Theme) => ({
  button: {
    marginTop: 20,
    width: '100%',
    marginBottom: 20,
    maxWidth: 500,
  },
  ol: {
    paddingLeft: theme.spacing(2),
    margin: 0,
  },
  h6: {
    margin: theme.spacing(1.25, 0),
  },
}))

const About: React.FC = (): JSX.Element => {
  const classes = useStyles()
  return (
    <>
      <Typography className={classes.h6} variant="h6">
        О кабинете
      </Typography>
      <Typography>
        <b>В личном кабинете Вы можете:</b>
      </Typography>
      <ol className={classes.ol}>
        <li>Заполнить либо изменить свои личные данные.</li>
        <li>
          Внести сведения о слушателе для физических лиц с прикреплением
          скан-копий документов.
        </li>
        <li>
          Заполнить данные об организации и ее слушателях для юридических лиц.
        </li>
        <li>
          Оформить заявку на повышение квалификации и профессиональную
          переподготовку слушателей с получением документов (заявление, анкета
          слушателя, договор об обучении, счет, акт выполненных работ),
          сформированных в электронном виде.
        </li>
        <li>
          Оформить заявку на образовательные мероприятия, проводимые в рамках
          НМО в АГМУ.
        </li>
      </ol>
      {<Button
        type="button"
        className={classes.button}
        variant="contained"
        color="primary"
        href={document}
        target="_blank"
        startIcon={<AssignmentIcon />}
      >
        Порядок формирования заявки на цикл
      </Button>}
    </>
  )
}

export default compose(
  withAuth,
  withRouter,
  MainLayout)(About)
