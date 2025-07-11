import './index.css';

import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';

import {AuthProvider} from './contexts/AuthContext.tsx';
import {Router} from './Router.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <Router />
    </AuthProvider>
  </StrictMode>
);
