import React from 'react';
import ReactDOM from 'react-dom';
import { RecoilRoot } from 'recoil';
import { ErrorBoundary } from 'react-error-boundary';
import { AxiosProvide, ClientProvider } from './api';
import App from './App';

import './index.less';

ReactDOM.render(
  <React.StrictMode>
    <AxiosProvide>
      <ClientProvider>
        <RecoilRoot>
          <ErrorBoundary
            fallbackRender={({ error, resetErrorBoundary }) => (
              <div>
                There was an error! <button onClick={() => resetErrorBoundary()}>Try again</button>
                <pre style={{ whiteSpace: 'normal' }}>{error.message}</pre>
              </div>
            )}
          >
            <App />
          </ErrorBoundary>
        </RecoilRoot>
      </ClientProvider>
    </AxiosProvide>
  </React.StrictMode>,
  document.getElementById('root'),
);
