import { useGetOne } from './request';

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
  return useGetOne<MenuList>('MENU', 'user/menu');
};
