import { MockMethod } from 'vite-plugin-mock';
import { resultSuccess } from './utils';

const userMethod: MockMethod[] = [
  {
    url: '/api/user/menu',
    method: 'get',
    response: () => {
      return resultSuccess([
        {
          path: '/',
          name: 'welcome',
          icon: 'heart',
          children: [
            {
              path: '/welcome',
              name: 'one',
            },
          ],
        },
        {
          path: '/demo',
          name: 'demo',
        },
      ]);
    },
  },
];

export default userMethod;
