import { MockMethod } from 'vite-plugin-mock';
import { resultSuccess } from './utils';

const userMethod: MockMethod[] = [
  {
    url: '/api/user/menu',
    method: 'get',
    response: () => {
      return resultSuccess([
        {
          path: '/welcome',
          name: '欢迎',
          icon: 'heart',
        },
      ]);
    },
  },
];

export default userMethod;
