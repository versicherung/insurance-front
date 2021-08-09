import React from 'react';
import { Space } from 'antd';
// import { QuestionCircleOutlined } from '@ant-design/icons';
import Avatar from './AvatarDropdown';

import styles from './index.module.less';

const GlobalHeaderRight: React.FC = () => {
  const className = styles.right;

  return (
    <Space className={className}>
      {/* <span
        className={styles.action}
        onClick={() => {
          window.open('https://pro.ant.design/docs/getting-started');
        }}
      >
        <QuestionCircleOutlined />
      </span> */}
      <Avatar />
    </Space>
  );
};
export default GlobalHeaderRight;
