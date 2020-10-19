import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { Grid, Typography } from '@material-ui/core'
import logo from '../../img/agmu-logo.png'

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    height: 64,
  },
  logo: {
    padding: 10,
    width: 65,
    height: 65,
  },
  text: {
    padding: 10,
    fontWeight: 700,
  },
}))

const LogoLayout = () => {
  const classes = useStyles()

  return (
    <div className={classes.root}>
      <Grid container direction="row" justify="flex-start" alignItems="center">
        <img className={classes.logo} src={logo} alt="logo" />
        <Typography className={classes.text} color="inherit">
          АГМУ
        </Typography>
      </Grid>
    </div>
  )
}

export default LogoLayout
