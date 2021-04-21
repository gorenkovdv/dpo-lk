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
import { setDocumentsTabAction } from '../../store/reducers/listenerData'
import { getSelectedDocumentsTab } from '../../store/selectors/listener'

const useStyles = makeStyles((theme) => ({
  button: {
    marginTop: 20,
    width: '100%',
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
  h6: {
    margin: theme.spacing(1.25, 0),
  },
}))

interface ITabPanel {
  value: number
  index: Number
}

interface IProps {
  username: string
  pagesType: string
}

const ListenerDocuments: React.FC<IProps> = ({ username, pagesType }) => {
  const classes = useStyles()
  const dispatch = useDispatch()
  const selectedTab = useSelector(getSelectedDocumentsTab) - 4

  const TabPanel: React.FC<ITabPanel> = ({ children, value, index, ...props }) => {

    return (
      <Typography
        component="div"
        role="tabpanel"
        hidden={value !== index}
        id={`scrollable-auto-tabpanel-${index}`}
        key={`scrollable-auto-tabpanel-${index}`}
        aria-labelledby={`scrollable-auto-tab-${index}`}
        {...props}
      >
        {value === index && <Box>{children}</Box>}
      </Typography>
    )
  }

  const handleTabChange = (event: React.ChangeEvent<{}>, value: number) => {
    dispatch(setDocumentsTabAction(value + 4))
  }

  if (pagesType === 'entity') return <Redirect to="/entity/data" />

  return (
    <>
      <Typography className={classes.h6} variant="h6">
        Документы
      </Typography>
      <AppBar position="static" color="default" className={classes.appBar}>
        <Tabs
          value={selectedTab}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          variant="scrollable"
          scrollButtons="on"
        >
          <Tab label="Документы об образовании" className={classes.tab} />
          <Tab label="Сертификат специалиста" className={classes.tab} />
          <Tab label="Иные документы" className={classes.tab} />
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
