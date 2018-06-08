import { Switch, Route } from 'react-router-dom'
import NavBar from './components/nav/nav-bar'
import HomePage from './components/home/home-page'
import About from './components/about/about'
import Help from './components/help/help'
import SignUp from './components/user/sign-up/sign-up'
import Login from './components/user/login'
import UpdatePassword from './components/user/update-password'
import ForgotPassword from './components/user/forgot-password'
import Account from './components/user/account'
import Profile from './components/user/profile/profile'
import AuthAction from './components/user/auth-action/auth-action'
import NotFound from './components/not-found/not-found'

import LoadingSpinner from './components/shared/loading-spinner'

export default (
    <div>
        <Route component={NavBar} />
        <Switch>
            <Route exact path="/" component={HomePage} />
            <Route exact path="/about" component={About} />
            <Route exact path="/help" component={Help} />
            <Route exact path="/sign-up" component={SignUp} />
            <Route exact path="/login" component={Login} />
            <Route exact path="/update-password" component={UpdatePassword} />
            <Route exact path="/forgot-password" component={ForgotPassword} />
            <Route exact path="/account" component={Account} />
            <Route exact path="/profile" component={Profile} />
            <Route exact path="/auth-action" component={AuthAction} />
            <Route exact path="*" component={NotFound} />
        </Switch>
        <LoadingSpinner />
    </div>
)
