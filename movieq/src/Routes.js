import React from 'react';
import Login from './containers/Login';
import { Route, Switch } from 'react-router-dom';
import NotFound from './containers/NotFound';
import Home from './containers/Home';
import AppliedRoute from './components/AppliedRoute';
import Signup from './containers/Signup';


export default ({ childProps }) => (
  <Switch>
    <AppliedRoute path="/" exact component={Home} props={childProps} />
    <AppliedRoute path="/login" exact component={Login} props={childProps} />
    <AppliedRoute path="/signup" exact component={Signup} props={childProps} />

    <Route component={NotFound} />
  </Switch>
);
