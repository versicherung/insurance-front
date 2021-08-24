export default [
  {
    path: '/user',
    layout: false,
    routes: [
      { path: '/user', routes: [{ name: '登录', path: '/user/login', component: './user/Login' }] },
      { component: './404' },
    ],
  },
  // { path: '/welcome', name: '欢迎', icon: 'smile', component: './Welcome' },
  // {
  //   path: '/admin',
  //   name: '管理页',
  //   icon: 'crown',
  //   access: 'canAdmin',
  //   component: './Admin',
  //   routes: [
  //     { path: '/admin/sub-page', name: '二级管理页', icon: 'smile', component: './Welcome' },
  //     { component: './404' },
  //   ],
  // },
  // { name: '查询表格', icon: 'table', path: '/list', component: './TableList' },
  {
    name: '订单',
    icon: 'table',
    path: '/order',
    routes: [
      { name: '订单列表', path: '/order/list', component: './OrderList' },
      { name: '创建订单', path: '/order/create', component: './CreateOrder' },
      { component: './404' },
    ],
  },
  { path: '/', redirect: '/order/list' },
  { component: './404' },
];
