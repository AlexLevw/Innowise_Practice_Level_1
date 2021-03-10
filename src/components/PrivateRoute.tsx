import React from "react";
import { Redirect, Route, RouteProps } from "react-router-dom";
import { useAuth } from "@contexts/index";
import { LOGIN_ROUTE } from "@constants/routes";

interface IPrivateRouteProps {
  component: () => JSX.Element;
  path: string;
}

export default function PrivateRoute({
  component: Component,
  path,
}: IPrivateRouteProps & RouteProps): JSX.Element {
  const { currentUser } = useAuth();

  return (
    <Route
      path={path}
      render={(): React.ReactNode => {
        return currentUser.uid ? <Component /> : <Redirect to={LOGIN_ROUTE} />;
      }}
    />
  );
}
