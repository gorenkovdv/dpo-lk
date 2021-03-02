import React, { useEffect } from 'react'
import { withRouter, NavLink } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { Typography, Grid } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import HeaderLayout from '../Commons/Header/HeaderLayout'
import LoaderLayout from '../Commons/Loader/LoaderLayout'
import { actions as authActions, checkParams } from '../../store/reducers/auth'
import styles from '../../styles.js'

const useStyles = makeStyles(theme => ({
  ...styles(theme),
  typography: {
    ...styles(theme).typography,
    textAlign: 'center',
  },
}))

const ConfirmRegistry = props => {
  const classes = useStyles()
  const dispatch = useDispatch()
  const params = useSelector(state => state.auth.confirm)
  const isLoading = useSelector(state => state.loader.isLoading)

  useEffect(() => {
    dispatch(authActions.clearConfirmParams())
  }, [dispatch])

  useEffect(() => {
    const matchParams = props.match.params
    dispatch(checkParams(matchParams.id, matchParams.key, 'confirm'))
  }, [dispatch, props])

  if (isLoading) return <LoaderLayout />

  return (
    <Grid container direction="column" justify="center" alignItems="center">
      <HeaderLayout />
      <h3 className={classes.h3}>Подтверждение учётной записи</h3>
      {params && (
        !params.response ? (
          <Typography className={`${classes.typography} ${classes.error}`}>
            {params.error}
          </Typography>
        ) : (
            <Grid
              container
              direction="column"
              justify="center"
              alignItems="center"
            >
              <Typography className={classes.typography}>
                {params.reset
                  ? `Учётная запись успешно подтверждена.
              Для активации учётной записи первый вход в систему выполняется без пароля`
                  : `Данная учётная запись уже активирована`}
              </Typography>
              <Typography>
                Ваш логин: <b>{params.login}</b>
              </Typography>
            </Grid>
          )
      )}
      <NavLink to="/auth" className={classes.link}>
        Перейти на страницу авторизации
      </NavLink>
    </Grid>
  )
}

export default withRouter(ConfirmRegistry)
