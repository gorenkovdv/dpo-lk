import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { Grid, Typography } from '@material-ui/core'
import logo from '../../../img/agmu-logo.png'

const useStyles = makeStyles((theme) => ({
    image: {
        marginBottom: theme.spacing(1),
        marginTop: theme.spacing(1),
        width: 80,
    },
}))

const HeaderLayout: React.FC = () => {
    const classes = useStyles()
    return (
        <div>
            <Grid container direction="column" justify="center" alignItems="center">
                <img className={classes.image} src={logo} alt="logo" />
                <Grid container direction="column" justify="center" alignItems="center">
                    <Typography align="center">Алтайский государственный медицинский университет</Typography>
                </Grid>
            </Grid>
        </div>
    )
}

export default HeaderLayout