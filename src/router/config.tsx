import React from 'react';
import { PartialRouteObject } from 'react-router';

import LayoutPage from '@/layout';

export const routeList: PartialRouteObject[] = [
  {
    path: '/',
    element: <LayoutPage />,
  },
];
