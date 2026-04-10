import React from 'react';
import ReactDOM from 'react-dom/client';

import App from './App';
import { isProfilerView, isProfilingEnabled } from './profiling';
import { ProfilerApp } from './profiling';

const rootApp = isProfilerView() ? <ProfilerApp/> : <App/>;

const app = isProfilingEnabled() ? (
  rootApp
) : (
  <React.StrictMode>
    {rootApp}
  </React.StrictMode>
);

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(app);
