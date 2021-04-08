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
import { getSelectedTab } from '../../store/selectors/listener'
import { ITabPanel } from '../../types'

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

interface IProps {
  username: string,
  pagesType: string
}

const ListenerData: React.FC<IProps> = ({ username, pagesType }) => {
  const classes = useStyles()
  const dispatch = useDispatch()
  const selectedTab = useSelector(getSelectedTab)

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

  const handleTabChange = (e: React.ChangeEvent<{}>, value: number) => {
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
          value={selectedTab}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          variant="scrollable"
          scrollButtons="on"
        >
          <Tab label="Адрес регистрации" className={classes.tab} />
          <Tab label="Адрес проживания" className={classes.tab} />
          <Tab label="Паспорт" className={classes.tab} />
          <Tab label="Сведения о работе" className={classes.tab} />
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
