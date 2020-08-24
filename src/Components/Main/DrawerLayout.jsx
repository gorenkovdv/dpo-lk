import React from 'react'
import { withRouter } from 'react-router-dom'
import { makeStyles, useTheme } from '@material-ui/core/styles'
import {
  Typography,
  Hidden,
  Drawer,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@material-ui/core'
import {
  Home as FirstPageIcon,
  Person as PersonIcon,
  HowToReg as RegIcon,
  Info as AboutIcon,
  StorageRounded as StorageRoundedIcon,
  Description as DescriptionIcon,
  Web as WebIcon,
} from '@material-ui/icons'
import LogoLayout from './LogoLayout'
import { DRAWER_WIDTH } from '../../store/const.js'

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  drawer: {
    [theme.breakpoints.up('sm')]: {
      width: DRAWER_WIDTH,
      flexShrink: 0,
    },
  },
  drawerPaper: {
    width: DRAWER_WIDTH,
  },
  selected: {
    color: theme.palette.primary.main,
  },
  listItem: {
    padding: theme.spacing(1, 3),
  },
  listItemIcon: {
    minWidth: 'auto',
    marginRight: theme.spacing(3),
  },
  icon: {
    width: 25,
    height: 25,
  },
  username: {
    margin: theme.spacing(1, 3),
  },
}))

const DrawerLayout = (props) => {
  const classes = useStyles()
  const theme = useTheme()
  const pagesType = props.pagesType

  const items = [
    {
      key: 'about',
      path: '/about',
      for: 'both',
      isSelected: props.match.path === '/about',
      component: <AboutIcon className={classes.icon} />,
      text: 'О кабинете',
    },
    {
      key: 'profile',
      path: `/profile`,
      for: 'both',
      isSelected: props.match.path === `/profile`,
      component: <RegIcon className={classes.icon} />,
      text: 'Регистрационные данные',
    },
    {
      key: 'data',
      path: `/listener/data`,
      for: 'listener',
      isSelected: props.match.path === `/listener/data`,
      component: <PersonIcon className={classes.icon} />,
      text: 'Данные о слушателе',
    },
    {
      key: 'data',
      path: `/entity/data`,
      for: 'entity',
      isSelected: props.match.path === `/entity/data`,
      component: <StorageRoundedIcon className={classes.icon} />,
      text: 'Реквизиты юридического лица',
    },
    {
      key: 'documents',
      path: `/listener/documents`,
      for: 'listener',
      isSelected: props.match.path === `/listener/documents`,
      component: <DescriptionIcon className={classes.icon} />,
      text: 'Документы',
    },
    {
      key: 'courses',
      path: `/courses`,
      for: 'both',
      isSelected: props.match.path === `/courses`,
      component: <StorageRoundedIcon className={classes.icon} />,
      text: 'Список программ ПК и ПП',
    },
    {
      key: 'requests',
      path: `/requests`,
      for: 'listener',
      isSelected: props.match.path === `/requests`,
      component: <WebIcon className={classes.icon} />,
      text: 'Заявки на обучение по программам ПК и ПП',
    },
    null,
    {
      key: 'firstPage',
      path: `/`,
      for: 'both',
      isSelected: false,
      component: <FirstPageIcon className={classes.icon} />,
      text: 'К началу',
    },
  ]

  const drawer = (
    <div>
      <div className={classes.toolbar}>
        <LogoLayout />
      </div>
      <Divider />
      <Typography variant="h6" className={classes.username}>
        {props.username}
      </Typography>
      <Divider />
      <List>
        {items.map((item, index) => {
          if (item !== null) {
            return (
              (item.for === pagesType || item.for === 'both') && (
                <ListItem
                  button
                  key={item.key}
                  className={`${classes.listItem} ${
                    item.isSelected ? classes.selected : null
                  }`}
                  onClick={() =>
                    !item.isSelected ? props.history.push(item.path) : null
                  }
                  selected={item.isSelected}
                >
                  <ListItemIcon className={classes.listItemIcon}>
                    {item.component}
                  </ListItemIcon>
                  <ListItemText primary={item.text} />
                </ListItem>
              )
            )
          } else return <Divider key={index} />
        })}
      </List>
    </div>
  )

  return (
    <nav className={classes.drawer} aria-label="mailbox folders">
      <Hidden smUp implementation="css">
        <Drawer
          container={props.container}
          variant="temporary"
          anchor={theme.direction === 'rtl' ? 'right' : 'left'}
          open={props.mobileOpen}
          onClose={props.onDrawerToggle}
          classes={{ paper: classes.drawerPaper }}
          ModalProps={{ keepMounted: true }}
        >
          {drawer}
        </Drawer>
      </Hidden>
      <Hidden xsDown implementation="css">
        <Drawer
          open
          classes={{ paper: classes.drawerPaper }}
          variant="permanent"
        >
          {drawer}
        </Drawer>
      </Hidden>
    </nav>
  )
}

export default withRouter(DrawerLayout)
