import React, { Component } from "react";
import { Auth } from "aws-amplify";
import {
  BrowserRouter as Router,
  withRouter,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import Login from "../features/Login";
import MainView from "./MainView";
import RegisterAccount from "../features/RegisterAccount";
import ConfirmEmail from "../features/ConfirmEmail";
import ForgottenPasswordReset from "../features/ForgottenPasswordReset";

class PrivateRoute extends Component {
  state = {
    loaded: false,
    isAuthenticated: false,
  };

  componentDidMount() {
    this.authenticate();
  }

  authenticate() {
    Auth.currentAuthenticatedUser()
      .then((user) => {
        this.setState({ loaded: true, isAuthenticated: true });
      })
      .catch(() => this.props.history.push("/login"));
  }

  render() {
    const { component: Component, ...rest } = this.props;
    const { loaded, isAuthenticated } = this.state;

    if (!loaded) return null;

    return (
      <Route
        {...rest}
        render={(props) => {
          return isAuthenticated ? (
            <Component {...props} />
          ) : (
            <Redirect
              to={{
                pathname: "/login",
                state: { from: props.location },
              }}
            />
          );
        }}
      />
    );
  }
}

PrivateRoute = withRouter(PrivateRoute);

const Routes = () => (
  <Router>
    <Switch>
      <Route exact path="/login" component={Login} />
      <Route exact path="/register" component={RegisterAccount} />
      <Route exact path="/confirmemail" component={ConfirmEmail} />
      <Route exact path="/newpassword" component={ForgottenPasswordReset} />
      <PrivateRoute exact path="/dashboard" component={MainView} />
      <Redirect from="*" to="/dashboard" />
    </Switch>
  </Router>
);

export default Routes;
