import React, { useState } from 'react'
import { withRouter } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Menu,
  MenuItem,
  Tooltip,
} from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import {
  Menu as MenuIcon,
  MoreVert as MoreIcon,
  ExitToApp as ExitToAppIcon,
} from '@material-ui/icons'
import allActions from '../../store/actions'
import { DRAWER_WIDTH } from '../../store/const.js'

const useStyles = makeStyles((theme) => ({
  appBar: {
    [theme.breakpoints.up('md')]: {
      width: `calc(100% - ${DRAWER_WIDTH}px)`,
      marginLeft: DRAWER_WIDTH,
    },
  },
  menuButton: {
    marginRight: theme.spacing(2),
    [theme.breakpoints.up('md')]: {
      display: 'none',
    },
  },
  toolbar: theme.mixins.toolbar,
  drawerPaper: {
    width: DRAWER_WIDTH,
  },
  sectionDesktop: {
    display: 'none',
    [theme.breakpoints.up('md')]: {
      display: 'flex',
    },
  },
  sectionMobile: {
    display: 'flex',
    [theme.breakpoints.up('md')]: {
      display: 'none',
    },
  },
  grow: {
    flexGrow: 1,
  },
}))

const AppBarLayout = (props) => {
  const classes = useStyles()
  const dispatch = useDispatch()

  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = useState(null)
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl)

  const menuId = 'primary-search-account-menu'
  const mobileMenuId = 'primary-search-account-menu-mobile'
  const pagesType = props.pagesType

  const handleMobileMenuOpen = (event) => {
    setMobileMoreAnchorEl(event.currentTarget)
  }

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null)
  }

  const handleDialogOpen = () => {
    dispatch(
      allActions.confirmDialogActions.confirmDialogShow({
        title: `Выход из личного кабинета`,
        text: `Вы действительно хотите выйти из личного кабинета?`,
        onApprove: () => handleLogout(),
      })
    )
  }

  const handleLogout = () => {
    dispatch(allActions.confirmDialogActions.confirmDialogClose())
    dispatch(allActions.authActions.logout())
  }

  const renderMobileMenu = (
    <Menu
      keepMounted
      id={mobileMenuId}
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
      <MenuItem onClick={handleDialogOpen}>
        <IconButton
          style={{ marginRight: 10 }}
          aria-label="account-of-current-user"
          aria-controls="primary-search-account-menu"
          aria-haspopup="true"
          color="inherit"
          size="small"
        >
          <ExitToAppIcon />
        </IconButton>
        <span>Выход</span>
      </MenuItem>
    </Menu>
  )

  return (
    <AppBar position="fixed" className={classes.appBar}>
      <Toolbar>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="start"
          onClick={props.onDrawerToggle}
          className={classes.menuButton}
        >
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" noWrap>
          {`Личный кабинет ${
            pagesType === 'listener'
              ? 'слушателя'
              : 'представителя юридического лица'
          }`}
        </Typography>
        <div className={classes.grow} />
        <div className={classes.sectionDesktop}>
          <Tooltip title="Выход" arrow>
            <IconButton
              edge="end"
              aria-label="account of current user"
              aria-controls={menuId}
              aria-haspopup="true"
              color="inherit"
              onClick={handleDialogOpen}
            >
              <ExitToAppIcon />
            </IconButton>
          </Tooltip>
        </div>
        <div className={classes.sectionMobile}>
          <IconButton
            aria-label="show more"
            aria-controls={mobileMenuId}
            aria-haspopup="true"
            onClick={handleMobileMenuOpen}
            color="inherit"
          >
            <MoreIcon />
          </IconButton>
        </div>
      </Toolbar>
      {renderMobileMenu}
    </AppBar>
  )
}

export default withRouter(AppBarLayout)
