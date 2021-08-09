import React, { FC } from 'react';
import { Result, Button } from 'antd';
import { RouteProps, useLocation } from 'react-router';
import { Route, useNavigate } from 'react-router-dom';

const PrivateRoute: FC<RouteProps> = props => {
  const logged = true;
  const navigate = useNavigate();
  const location = useLocation();

  return logged ? (
    <Route {...props} />
  ) : (
    <Result
      status="403"
      title="403"
      subTitle="对不起，您没有权限访问此页。"
      extra={
        <Button
          type="primary"
          onClick={() => navigate('/login', { replace: true, state: { from: location.pathname } })}
        >
          去登录
        </Button>
      }
    />
  );
};

export default PrivateRoute;
