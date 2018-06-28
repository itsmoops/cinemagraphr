import { Switch, Route } from 'react-router-dom'
import NavBar from './components/nav/nav-bar'
import Create from './components/create/create'
import Home from './components/home/home'
import Browse from './components/browse/browse'
import Feed from './components/feed/feed'
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
            <Route exact path="/" component={Home} />
            <Route exact path="/create" component={Create} />
            <Route exact path="/browse" component={Browse} />
            <Route exact path="/feed" component={Feed} />
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
