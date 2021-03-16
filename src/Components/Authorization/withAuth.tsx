import React from 'react'
import { Redirect } from 'react-router-dom'
import { authAPI } from '../../services/api'
import history from '../../history'

const withAuth = <P extends object>(
  Component: React.ComponentType<P>
): React.FC<P> => (props) => {
  const [reload, setReload] = React.useState(true)

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
