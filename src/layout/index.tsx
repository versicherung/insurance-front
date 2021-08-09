import React, { FC } from 'react';
import { Outlet } from 'react-router-dom';
import ProLayout from '@ant-design/pro-layout';

import { Footer } from './components/Footer';
import RightContent from './components/RightContent';

const LayoutPage: FC = () => {
  return (
    <ProLayout
      style={{ height: '100vh' }}
      fixSiderbar
      title="车险出单 Pro"
      footerRender={() => <Footer />}
      rightContentRender={() => <RightContent />}
    >
      <Outlet />
    </ProLayout>
  );
};

export default LayoutPage;
