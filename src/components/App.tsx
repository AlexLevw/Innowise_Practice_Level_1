import React, { useState } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { AuthProvider } from "@contexts/AuthContext";
import styles from "./_App.module.scss";
import Signup from "./Signup/Signup";
import Login from "./Login/Login";
import ToDo from "./ToDo/ToDo";
import Profile from "./Profile/Profile";
import ResetPassword from "./ResetPassword/ResetPassword";
import UpdateProfile from "./UpdateProfile/UpdateProfile";
import PrivateRoute from "./PrivateRoute";

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
