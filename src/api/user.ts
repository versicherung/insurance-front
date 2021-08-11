import { Location } from 'history';
import { useNavigate, useLocation } from 'react-router-dom';
import { useMutation, useQuery } from 'react-query';
import { MenuList, FormParams, LoginResponse } from '@/models/user';
import { setToken } from '@/utils/storage';
import { useAxios } from './request';

export const useLogin = () => {
  const navigate = useNavigate();
  const location = useLocation() as Location<{ from: string }>;
  const axios = useAxios();

  const service = async ({ username, password }: FormParams) => {
    const data: API.ResponseBody<LoginResponse> = await axios.post('/login', {
      username,
      password,
    });

    return data.data;
  };

  return useMutation<LoginResponse, Error, FormParams>(service, {
    onSuccess: (data, variables) => {
      setToken(data.token, variables.remember);
      const from = location.state?.from || { pathname: '/welcome' };
      navigate(from);
    },
  });
};

export const useGetMenu = () => {
  const axios = useAxios();

  const service = async () => {
    const data: API.ResponseBody<MenuList> = await axios.get('/menu');

    return data.data;
  };

  return useQuery<MenuList, Error>('menu', service);
};
