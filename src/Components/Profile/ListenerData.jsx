import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Redirect, withRouter } from 'react-router-dom'
import { compose } from 'redux'
import { Typography, AppBar, Tabs, Tab, Box } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import MainLayout from '../Main/MainLayout'
import RegAddress from './ListenerProfileTabs/RegAddress'
import FactAddress from './ListenerProfileTabs/FactAddress'
import Passport from './ListenerProfileTabs/Passport'
import Work from './ListenerProfileTabs/Work'
import withAuth from '../Authorization/withAuth'
import { setSelectedTabAction } from '../../store/reducers/listenerData'
import { userAPI } from '../../services/api'
import styles from '../../styles'

const useStyles = makeStyles((theme) => ({
  ...styles(theme),
  button: {
    ...styles(theme).button,
    maxWidth: 250,
    [theme.breakpoints.down('xs')]: {
      maxWidth: '100%',
    },
  },
  appBar: {
    boxShadow: 'none',
    backgroundColor: 'transparent',
  },
  tab: {
    [theme.breakpoints.down('xs')]: {
      textTransform: 'none',
      fontSize: 14,
    },
  },
}))

const ListenerData = (props) => {
  const classes = useStyles()
  const dispatch = useDispatch()
  const selectedTab = useSelector((state) => state.listenerData.selectedTab)
  const pagesType = props.pagesType

  const username = userAPI.getUserName().toLowerCase()

  const TabPanel = (props) => {
    const { children, value, index, ...other } = props

    return (
      <Typography
        component="div"
        role="tabpanel"
        hidden={value !== index}
        id={`scrollable-auto-tabpanel-${index}`}
        key={`scrollable-auto-tabpanel-${index}`}
        aria-labelledby={`scrollable-auto-tab-${index}`}
        {...other}
      >
        {value === index && <Box>{children}</Box>}
      </Typography>
    )
  }

  const tabProps = (index) => {
    return {
      id: `scrollable-auto-tab-${index}`,
      key: `scrollable-auto-tab-${index}`,
      'aria-controls': `scrollable-auto-tabpanel-${index}`,
      className: classes.tab,
    }
  }

  const handleTabChange = (e, value) => {
    dispatch(setSelectedTabAction(value))
  }

  if (pagesType === 'entity') return <Redirect to="/entity/data" />

  return (
    <>
      <Typography className={classes.h6} variant="h6">
        Данные о слушателе
      </Typography>
      <AppBar position="static" color="default" className={classes.appBar}>
        <Tabs
          className={classes.tabs}
          value={selectedTab}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          variant="scrollable"
          scrollButtons="on"
        >
          <Tab label="Адрес регистрации" {...tabProps(0)} />
          <Tab label="Адрес проживания" {...tabProps(1)} />
          <Tab label="Паспорт" {...tabProps(2)} />
          <Tab label="Сведения о работе" {...tabProps(3)} />
        </Tabs>
      </AppBar>
      <TabPanel value={selectedTab} index={0}>
        <RegAddress />
      </TabPanel>
      <TabPanel value={selectedTab} index={1}>
        <FactAddress />
      </TabPanel>
      <TabPanel value={selectedTab} index={2}>
        <Passport />
      </TabPanel>
      <TabPanel value={selectedTab} index={3}>
        <Work username={username} />
      </TabPanel>
    </>
  )
}

export default compose(withAuth, withRouter, MainLayout)(ListenerData)
