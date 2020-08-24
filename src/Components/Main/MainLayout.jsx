import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'
import { CssBaseline } from '@material-ui/core'
import {
  ThemeProvider,
  createMuiTheme,
  makeStyles,
} from '@material-ui/core/styles'
import AppBarLayout from './AppBarLayout'
import DrawerLayout from './DrawerLayout'
import { userAPI } from '../../services/api'
import { DRAWER_WIDTH } from '../../store/const.js'

const useStyles = makeStyles(theme => ({
  toolbar: theme.mixins.toolbar,
  content: {
    [theme.breakpoints.up('sm')]: {
      width: `calc(100% - ${DRAWER_WIDTH}px)`,
      marginLeft: DRAWER_WIDTH,
    },
    padding: theme.spacing(3),
  },
}))

const MainLayout = Component => props => {
  const { container } = props

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const classes = useStyles()

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [mobileOpen, setMobileOpen] = useState(false)

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const history = useHistory()

  const pagesType = sessionStorage.pagesType
  const username = userAPI.getUserName()

  if (!pagesType) history.replace('/')

  let theme = createMuiTheme({
    palette: {
      primary: {
        main: pagesType === 'listener' ? '#8C1212' : '#3f51b5',
      },
      secondary: {
        main: pagesType === 'listener' ? '#3f51b5' : '#8C1212',
      },
    },
  })

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen)
  }

  return (
    <ThemeProvider theme={theme}>
      <div className={classes.root}>
        <CssBaseline />
        <AppBarLayout
          pagesType={pagesType}
          onDrawerToggle={handleDrawerToggle}
        />
        <DrawerLayout
          container={container}
          pagesType={pagesType}
          username={username}
          mobileOpen={mobileOpen}
          onDrawerToggle={handleDrawerToggle}
        />
        <main className={classes.content}>
          <div className={classes.toolbar} />
          <Component {...props} pagesType={pagesType} />
        </main>
      </div>
    </ThemeProvider>
  )
}

export default MainLayout
