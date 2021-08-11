import { useQuery } from 'react-query';
import { useAxios } from './request';

interface MenuItem {
  /** menu item name */
  name: string;
  /** 图标名称 */
  icon?: string;
  /** 菜单id */
  key: string;
  /** 菜单路由 */
  path: string;
  /** 子菜单 */
  children?: MenuItem[];
}

type MenuList = MenuItem[];

export const useGetMenu = () => {
  const axios = useAxios();

  const service = async () => {
    const data: API.ResponseBody<MenuList> = await axios.get('/user/menu');

    return data.data;
  };

  return useQuery<MenuList, Error>('user/menu', service);
};
