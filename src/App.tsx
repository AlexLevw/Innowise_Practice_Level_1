import React, { useState } from "react";
import { HashRouter as Router, Switch, Route } from "react-router-dom";
import { AuthProvider } from "@contexts/AuthContext";
import Signup from "@pages/Signup/Signup";
import Login from "@pages/Login/Login";
import ToDo from "@pages/ToDo/ToDo";
import Profile from "@pages/Profile/Profile";
import ResetPassword from "@pages/ResetPassword/ResetPassword";
import UpdateProfile from "@pages/UpdateProfile/UpdateProfile";
import PrivateRoute from "@components/PrivateRoute";
import styles from "./_App.module.scss";

export default function App(): JSX.Element {
  const [theme, setTheme] = useState<string>(
    localStorage.theme ? localStorage.theme : "dark"
  );

  const switchTheme = (): void => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.theme = newTheme;
  };

  return (
    <div className={`${styles.app} ${theme}`}>
      <div className={styles.main}>
        <Router>
          <AuthProvider>
            <Switch>
              <PrivateRoute exact path="/" component={ToDo} />
              <PrivateRoute
                path="/profile"
                component={() => <Profile switchTheme={switchTheme} />}
              />
              <PrivateRoute path="/update-profile" component={UpdateProfile} />
              <Route path="/login" component={Login} />
              <Route path="/register" component={Signup} />
              <Route path="/reset-password" component={ResetPassword} />
            </Switch>
          </AuthProvider>
        </Router>
      </div>
    </div>
  );
}
