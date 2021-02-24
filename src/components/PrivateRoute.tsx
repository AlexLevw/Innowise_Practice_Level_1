/* eslint-disable react/jsx-props-no-spreading */
import React from "react";
import { Redirect, Route, RouteProps } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

interface IPrivateRouteProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  component: (props: any) => JSX.Element;
}

export default function PrivateRoute({
  component: Component,
  ...rest
}: IPrivateRouteProps & RouteProps): JSX.Element {
  const { currentUser } = useAuth();
  return (
    <Route
      {...rest}
      render={(props): React.ReactNode => {
        return currentUser.uid ? (
          <Component {...props} />
        ) : (
          <Redirect to="/login" />
        );
      }}
    />
  );
}
