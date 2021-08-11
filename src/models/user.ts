export interface FormParams {
  username: string;
  password: string;
  remember: boolean;
}

export interface LoginResponse {
  uid: string;
  authority: number;
  token: string;
}

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

export type MenuList = MenuItem[];
