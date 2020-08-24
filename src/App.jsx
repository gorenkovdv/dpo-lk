import React from 'react'
import Authorization from './Components/Authorization/Authorization'
import Registration from './Components/Registration/Registration'
import ConfirmRegistry from './Components/Registration/ConfirmRegistry'
import ChangePassword from './Components/Password/ChangePassword'
import ForgotPassword from './Components/Password/ForgotPassword'
import ChooseType from './Components/Main/ChooseType'
import NotFoundPage from './Components/Main/NotFoundPage'
import About from './Components/About/About'
import Profile from './Components/Profile/Profile'
import ListenerData from './Components/Profile/ListenerData'
import ListenerDocuments from './Components/Profile/ListenerDocuments'
import EntityData from './Components/Profile/EntityData'
import CoursesList from './Components/Courses/CoursesList'
import RequestsList from './Components/Requests/RequestsList'
import { Switch, Route } from 'react-router-dom'

const App = () => {
  return (
    <Switch>
      <Route path="/auth">
        <Authorization />
      </Route>
      <Route path="/reg">
        <Registration />
      </Route>
      <Route exact path="/">
        <ChooseType />
      </Route>
      <Route path="/about">
        <About />
      </Route>
      <Route path="/profile">
        <Profile />
      </Route>
      <Route path="/courses">
        <CoursesList />
      </Route>
      <Route path="/requests">
        <RequestsList />
      </Route>
      <Route path="/listener/data">
        <ListenerData />
      </Route>
      <Route path="/listener/documents">
        <ListenerDocuments />
      </Route>
      <Route path="/entity/data">
        <EntityData />
      </Route>
      <Route path="/confirm/:id/:key">
        <ConfirmRegistry />
      </Route>
      <Route path="/changepassword/:id/:key">
        <ChangePassword />
      </Route>
      <Route path="/forgotpassword">
        <ForgotPassword />
      </Route>
      <Route component={NotFoundPage} />
    </Switch>
  )
}

export default App
