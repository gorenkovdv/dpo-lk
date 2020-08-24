import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { Grid } from '@material-ui/core'
import logo from '../../../img/agmu-logo.png'

const useStyles = makeStyles(theme => ({
    image: {
      marginBottom: 10,
      marginTop: 10,
      width: 80,
    },
  }))

const HeaderLayout = () =>{
    const classes = useStyles()
    return(
    <div>
        <Grid container direction="column" justify="center" alignItems="center">
            <img className={classes.image} src={logo} alt="logo" />
            <Grid container direction="column" justify="center" alignItems="center">
                <center>Алтайский государственный</center>
                <center>медицинский университет</center>
            </Grid>
        </Grid>
    </div>
    )
}

export default HeaderLayout