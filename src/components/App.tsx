import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import styles from "./_App.module.scss";
import Signup from "./Signup/Signup";
import Login from "./Login/Login";
import ToDo from "./ToDo/ToDo";
import Profile from "./Profile/Profile";
import ResetPassword from "./ResetPassword/ResetPassword";
import UpdateProfile from "./UpdateProfile/UpdateProfile";
import { AuthProvider } from "../contexts/AuthContext";
import PrivateRoute from "./PrivateRoute";

export default function App(): JSX.Element {
  return (
    <div className={styles.app}>
      <Router>
        <AuthProvider>
          <Switch>
            <PrivateRoute exact path="/" component={ToDo} />
            <PrivateRoute path="/profile" component={Profile} />
            <PrivateRoute path="/update-profile" component={UpdateProfile} />
            <Route path="/login" component={Login} />
            <Route path="/register" component={Signup} />
            <Route path="/reset-password" component={ResetPassword} />
          </Switch>
        </AuthProvider>
      </Router>
    </div>
  );
}
