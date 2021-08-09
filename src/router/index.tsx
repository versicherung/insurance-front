import { FC } from 'react';
import { useRoutes } from 'react-router-dom';

import { routeList } from './config';

export const Router: FC = () => {
  const router = useRoutes(routeList);

  return router;
};
