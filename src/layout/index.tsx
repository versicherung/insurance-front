import React, { FC, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import ProLayout from '@ant-design/pro-layout';
import { useGetMenu } from '@/api/user';

import { Footer } from './components/Footer';
import RightContent from './components/RightContent';

const LayoutPage: FC = () => {
  const { data: menuList } = useGetMenu();

  // useEffect(() => {
  //   console.log(menuList);
  // }, [menuList]);

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
