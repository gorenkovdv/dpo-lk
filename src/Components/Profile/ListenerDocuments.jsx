import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Redirect, withRouter } from 'react-router-dom'
import { compose } from 'redux'
import { Typography, AppBar, Tabs, Tab, Box } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import MainLayout from '../Main/MainLayout'
import Education from './ListenerProfileTabs/Education'
import Sertificates from './ListenerProfileTabs/Sertificates'
import Others from './ListenerProfileTabs/Others'
import withAuth from '../Authorization/withAuth'
import allActions from '../../store/actions'
import { userAPI } from '../../services/api'
import styles from '../../styles.js'

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

const ListenerDocuments = (props) => {
  const classes = useStyles()
  const dispatch = useDispatch()
  const selectedTab = useSelector((state) => state.listenerData.documentsTab)
  const username = userAPI.getUserName().toLowerCase()
  const pagesType = props.pagesType

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
    dispatch(allActions.listenerDataActions.setDocumentsTab(value))
  }

  if (pagesType === 'entity') return <Redirect to="/entity/data" />

  return (
    <>
      <Typography className={classes.h6} variant="h6">
        Документы
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
          <Tab label="Документы об образовании" {...tabProps(0)} />
          <Tab label="Сертификат специалиста" {...tabProps(1)} />
          <Tab label="Иные документы" {...tabProps(2)} />
        </Tabs>
      </AppBar>
      <TabPanel value={selectedTab} index={0}>
        <Education username={username} />
      </TabPanel>
      <TabPanel value={selectedTab} index={1}>
        <Sertificates username={username} />
      </TabPanel>
      <TabPanel value={selectedTab} index={2}>
        <Others username={username} />
      </TabPanel>
    </>
  )
}

export default compose(withAuth, withRouter, MainLayout)(ListenerDocuments)