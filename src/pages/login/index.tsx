import React, { FC } from 'react';
import { Button, Form, Input } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useLogin } from '@/api/user';
import { FormParams } from '@/models/user';
import LogoSvg from '@/assets/logo.svg';

import styles from './index.module.less';
import './antd.reset.less';

const LoginForm: FC = () => {
  const loginMutation = useLogin();

  const onFinish = async (form: FormParams) => {
    loginMutation.mutate(form);
  };

  return (
    <div className={styles.container}>
      <div className={styles.top}>
        <div className={styles.header}>
          <img src={LogoSvg} className={styles.logo} />
          <span className={styles.title}>车险出单系统</span>
        </div>
        <div className={styles.desc}>使用（React\Recoil\React Query\React Hooks\Vite）构建</div>
      </div>
      <div className={styles.main} id="components-form-demo-normal-login">
        <Form
          name="normal_login"
          className="login-form"
          initialValues={{ remember: false }}
          onFinish={onFinish}
        >
          <Form.Item name="username" rules={[{ required: true, message: '请输入用户名' }]}>
            <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="用户名" />
          </Form.Item>
          <Form.Item name="password" rules={[{ required: true, message: '请输入密码' }]}>
            <Input
              prefix={<LockOutlined className="site-form-item-icon" />}
              type="password"
              placeholder="密码"
            />
          </Form.Item>
          {/* <Form.Item>
            <Form.Item name="remember" valuePropName="checked" noStyle>
              <Checkbox>Remember me</Checkbox>
            </Form.Item>

            <a className="login-form-forgot" href="">
              忘记密码
            </a>
          </Form.Item> */}

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="login-form-button"
              loading={loginMutation.isLoading}
              disabled={loginMutation.isLoading}
            >
              登录
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default LoginForm;
