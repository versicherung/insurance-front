import React, { useCallback } from 'react';
import { LogoutOutlined, SettingOutlined, UserOutlined } from '@ant-design/icons';
import { Avatar, Menu, Spin } from 'antd';
import HeaderDropdown from '../HeaderDropdown';

import styles from './index.module.less';

export type GlobalHeaderRightProps = {
  menu?: boolean;
};

const AvatarDropdown: React.FC<GlobalHeaderRightProps> = ({ menu }) => {
  const initialState = {
    currentUser: {
      name: 'Derek',
      avatar:
        'https://tse1-mm.cn.bing.net/th/id/R-C.425302bcdbbb97ff02e610d1768c3e84?rik=syZM0%2fHUF82Y%2fg&riu=http%3a%2f%2fwww.gx8899.com%2fuploads%2fallimg%2f2017110610%2feizbdetv5xo.jpg&ehk=WgrpdiIdqars6%2bUvMxLxW2tWhIhX8YnYHONyICx8ezw%3d&risl=&pid=ImgRaw&r=0',
    },
  };

  const onMenuClick = useCallback(() => {
    console.log('onMenuClick');
  }, []);

  const loading = (
    <span className={`${styles.action} ${styles.account}`}>
      <Spin
        size="small"
        style={{
          marginLeft: 8,
          marginRight: 8,
        }}
      />
    </span>
  );

  if (!initialState) {
    return loading;
  }

  const { currentUser } = initialState;

  if (!currentUser || !currentUser.name) {
    return loading;
  }

  const menuHeaderDropdown = (
    <Menu className={styles.menu} selectedKeys={[]} onClick={onMenuClick}>
      {menu && (
        <Menu.Item key="center">
          <UserOutlined />
          个人中心
        </Menu.Item>
      )}
      {menu && (
        <Menu.Item key="settings">
          <SettingOutlined />
          个人设置
        </Menu.Item>
      )}
      {menu && <Menu.Divider />}

      <Menu.Item key="logout">
        <LogoutOutlined />
        退出登录
      </Menu.Item>
    </Menu>
  );

  return (
    <HeaderDropdown overlay={menuHeaderDropdown}>
      <span className={`${styles.action} ${styles.account}`}>
        <Avatar size="small" className={styles.avatar} src={currentUser.avatar} alt="avatar" />
        <span className={`${styles.name} anticon`}>{currentUser.name}</span>
      </span>
    </HeaderDropdown>
  );
};

export default AvatarDropdown;
