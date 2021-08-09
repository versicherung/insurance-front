import React, { FC } from 'react';
import { Outlet } from 'react-router-dom';
import ProLayout from '@ant-design/pro-layout';

const LayoutPage: FC = () => {
  return (
    <ProLayout style={{ height: '100vh' }}>
      <Outlet />
    </ProLayout>
  );
};

export default LayoutPage;
