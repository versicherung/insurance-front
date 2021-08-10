import React from 'react';
import { PartialRouteObject } from 'react-router';
import LayoutPage from '@/layout';
import NotFound from '@/pages/404';
import WarpRoute from './components/WarpRoute';

const Welcome = React.lazy(() => import('@/pages/Welcome'));

export const routeList: PartialRouteObject[] = [
  {
    path: '/',
    element: <WarpRoute element={<LayoutPage />} navigate="/welcome" path="/" />,
    children: [
      {
        path: '/welcome',
        element: <WarpRoute element={<Welcome />} />,
      },
      { path: '*', element: <WarpRoute element={<NotFound />} /> },
    ],
  },
];
