import { GithubOutlined } from '@ant-design/icons';
import { DefaultFooter } from '@ant-design/pro-layout';

export default () => {
  const defaultMessage = '超赔出单系统';
  const currentYear = new Date().getFullYear();

  return (
    <DefaultFooter
      copyright={`${currentYear} ${defaultMessage}`}
      links={[
        {
          key: '超赔出单系统',
          title: '超赔出单系统',
          href: '',
          blankTarget: false,
        },
        {
          key: 'github',
          title: <GithubOutlined />,
          href: '',
          blankTarget: false,
        },
        {
          key: '由 Ant Design 驱动',
          title: '由 Ant Design 驱动',
          href: '',
          blankTarget: false,
        },
      ]}
    />
  );
};
