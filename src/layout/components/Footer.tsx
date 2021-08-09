import React, { FC } from 'react';
import { GithubOutlined } from '@ant-design/icons';
import { DefaultFooter } from '@ant-design/pro-layout';

export const Footer: FC = () => (
  <DefaultFooter
    copyright="2021-2021 车险出单出品"
    links={[
      {
        key: '车险出单',
        title: '车险出单',
        blankTarget: true,
        href: '',
      },
      {
        key: 'github',
        title: <GithubOutlined />,
        href: '',
        blankTarget: true,
      },
      {
        key: '车险出单管理平台',
        title: '车险出单管理平台',
        blankTarget: true,
        href: '',
      },
    ]}
  />
);
