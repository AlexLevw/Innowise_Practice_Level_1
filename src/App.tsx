import React, { useState } from "react";
import { HashRouter as Router, Switch, Route } from "react-router-dom";
import { AuthProvider } from "@contexts/index";
import {
  Signup,
  Login,
  ToDo,
  Profile,
  ResetPassword,
  UpdateProfile,
} from "@pages/index";
import { PrivateRoute } from "@components/index";
import {
  HOME_ROUTE,
  PROFILE_ROUTE,
  UPDATE_PROFILE_ROUTE,
  LOGIN_ROUTE,
  REGISTER_ROUTE,
  RESET_PASSWORD_ROUTE,
} from "@constants/routes";
import styles from "./_App.module.scss";

export default function App(): JSX.Element {
  const [theme, setTheme] = useState<string>(
    localStorage.theme ? localStorage.theme : "dark"
  );

  const switchTheme = (): void => {
    const newTheme: string = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.theme = newTheme;
  };

  return (
    <div className={`${styles.app} ${theme}`}>
      <div className={styles.main}>
        <Router>
          <AuthProvider>
            <Switch>
              <PrivateRoute exact path={HOME_ROUTE} component={ToDo} />
              <PrivateRoute
                path={PROFILE_ROUTE}
                component={() => <Profile switchTheme={switchTheme} />}
              />
              <PrivateRoute
                path={UPDATE_PROFILE_ROUTE}
                component={UpdateProfile}
              />
              <Route path={LOGIN_ROUTE} component={Login} />
              <Route path={REGISTER_ROUTE} component={Signup} />
              <Route path={RESET_PASSWORD_ROUTE} component={ResetPassword} />
            </Switch>
          </AuthProvider>
        </Router>
      </div>
    </div>
  );
}
