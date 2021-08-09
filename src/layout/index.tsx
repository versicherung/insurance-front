import React, { FC } from 'react';
import { Outlet, Link } from 'react-router-dom';
import ProLayout from '@ant-design/pro-layout';
import type { MenuDataItem } from '@ant-design/pro-layout';
import { HeartOutlined } from '@ant-design/icons';
import { useGetMenu } from '@/api/user';

import { Footer } from './components/Footer';
import RightContent from './components/RightContent';

const IconMap: { [key: string]: React.ReactNode } = {
  heart: <HeartOutlined />,
};

const loopMenuItem = (menus?: MenuDataItem[]): MenuDataItem[] => {
  if (!menus) {
    return [];
  }

  const m = menus.map(({ icon, children, ...item }) => ({
    ...item,
    icon: icon && IconMap[icon as string],
    children: children && loopMenuItem(children),
  }));

  return m;
};

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
      menuDataRender={() => loopMenuItem(menuList)}
      menuItemRender={(menuItemProps, defaultDom) => {
        console.log(menuItemProps, defaultDom);
        if (
          menuItemProps.isUrl ||
          !menuItemProps.path ||
          location.pathname === menuItemProps.path
        ) {
          return defaultDom;
        }

        return <Link to={menuItemProps.path}>{defaultDom}</Link>;
      }}
    >
      <Outlet />
    </ProLayout>
  );
};

export default LayoutPage;
