import React from 'react';
import { HashRouter } from 'react-router-dom';
import { Router } from './router';

import './App.less';

function App() {
  return (
    <HashRouter>
      <Router />
    </HashRouter>
  );
}

export default App;
