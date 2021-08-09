import React, { FC } from 'react';
import { Route, Navigate, useLocation } from 'react-router-dom';
import { RouteProps } from 'react-router';
import PrivateRoute from './PrivateRoute';

export interface WrapperRouteProps extends RouteProps {
  /** authorization？ */
  auth?: string;
  navigate?: string;
}

const WrapperRouteComponent: FC<WrapperRouteProps> = ({ auth, navigate, ...props }) => {
  const location = useLocation();
  const WitchRoute = auth && auth !== '' ? PrivateRoute : Route;

  return (
    <>
      <WitchRoute {...props} />
      {location.pathname === props.path && navigate && <Navigate to={navigate} />}
    </>
  );
};

export default WrapperRouteComponent;
