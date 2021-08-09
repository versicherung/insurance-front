import React, { createContext, useContext, useMemo, FC } from 'react';
import Axios, { AxiosInstance } from 'axios';
import { createHashHistory } from 'history';
import { useQuery } from 'react-query';
import { notification } from 'antd';

const history = createHashHistory();

const baseUrl = import.meta.env.VITE_BASE_URL as string;

const axios = Axios.create({
  baseURL: baseUrl ? baseUrl : '/api',
  timeout: 3000,
});

axios.interceptors.response.use(
  response => {
    const data = response.data;
    if (response.status === 200) {
      return data;
    }

    notification.error({
      message: `请求错误 ${response.statusText}: ${response}`,
      description: data || response.statusText || 'Error',
    });

    if (response.status === 401) {
      history.push('/auth/login');
    }

    return Promise.reject(new Error(response.statusText || 'Error'));
  },
  error => {
    if (error.response && error.response.status) {
      switch (error.response.status) {
        // 401: 未登录
        // 未登录则跳转登录页面，并携带当前页面的路径
        // 在登录成功后返回当前页面，这一步需要在登录页操作。
        case 401:
          history.push('/auth/login');
          break;
        // 403 token过期
        // 登录过期对用户进行提示
        // 清除本地token和清空vuex中token对象
        // 跳转登录页面
        case 403:
          history.push('/auth/login');
          break;
        // 404请求不存在
        case 404:
          notification.error({
            message: `请求不存在`,
            description: error.response.data?.msg || 'Error',
          });
          break;
        case 406:
          notification.error({
            message: `请求参数有误`,
            description: error.response.data?.msg || 'Error',
          });
          break;
        default:
          notification.error({
            message: `请求错误`,
            description: error.response.data?.msg || 'Error',
          });
      }
    }

    // throw new Error(error);
    return Promise.reject(error);
  },
);

export const AxiosContext = createContext<AxiosInstance>(
  new Proxy(axios, {
    apply: () => {
      throw new Error('You must wrap your component in an AxiosProvider');
    },
    get: () => {
      throw new Error('You must wrap your component in an AxiosProvider');
    },
  }),
);

export const useAxios = () => {
  return useContext(AxiosContext);
};

export const AxiosProvide: FC = ({ children }) => {
  const axiosValue = useMemo(() => axios, []);

  return <AxiosContext.Provider value={axiosValue}>{children}</AxiosContext.Provider>;
};

export const useGetOne = <T, U = Record<string, unknown>>(key: string, url: string, params?: U) => {
  const axios = useAxios();

  const service = async () => {
    const data: T = await axios.get(url, params);
    console.log(data);

    return data;
  };

  return useQuery(key, service);
};
