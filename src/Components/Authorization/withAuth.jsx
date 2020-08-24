import React from 'react'
import { Redirect, useHistory } from 'react-router-dom'
import { authAPI } from '../../services/api'

const withAuth = (Component) => (props) => {
  const history = useHistory()
  const [reload, setReload] = React.useState(true)

  //return <Component {...props} />

  if (!sessionStorage.token) return <Redirect to="/auth" />

  if (authAPI.loggedIn()) return <Component {...props} />

  let parseToken = JSON.parse(sessionStorage.token)
  if (!parseToken.isPasswordSet)
    return (
      <Redirect
        to={`/changepassword/${sessionStorage.uid}/${parseToken.key}`}
      />
    )

  authAPI
    .checkAuth()
    .then((response) => {
      console.log(response)
      if (response.data.response) {
        authAPI.setToken(response.data.token)
        setReload(!reload)
      } else {
        authAPI.clearData()
        history.push('/auth')
      }
    })
    .catch((error) => {
      console.error(error)
      authAPI.clearData()
      history.push('/auth')
    })

  return null
}

export default withAuth
