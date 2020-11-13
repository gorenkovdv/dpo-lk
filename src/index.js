import React from 'react'
import ReactDOM from 'react-dom'
import { Router } from 'react-router-dom'
import { createStore, applyMiddleware, compose } from 'redux'
import { Provider } from 'react-redux'
import thunk from 'redux-thunk'
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core'
import { rootReducer } from './store/reducers'
import AlertSnackbar from './Components/Commons/AlertSnackbar/AlertSnackbar'
import ConfirmDialog from './Components/Commons/Dialog/ConfirmDialog'
import * as serviceWorker from './services/serviceWorker'
import App from './App'
import history from './history'
import './index.css'

const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#8C1212',
    },
    secondary: {
      main: '#3f51b5',
    },
  },
})

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

const store = createStore(rootReducer, composeEnhancers(applyMiddleware(thunk)))

window.store = store

ReactDOM.render(
  <MuiThemeProvider theme={theme}>
    <Router history={history}>
      <Provider store={store}>
        <App />
        <AlertSnackbar />
        <ConfirmDialog />
      </Provider>
    </Router>
  </MuiThemeProvider>,
  document.getElementById('root')
)

serviceWorker.unregister()
