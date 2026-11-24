import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { BrowserRouter } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

import 'modern-normalize/modern-normalize.css';
import './styles/fonts.css';
import './styles/variables.css';
import 'react-toastify/dist/ReactToastify.css';
import './styles/global.css';

import { store, persistor } from './redux/store';
import App from './app';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        {/* BASE_URL keeps routes working on GitHub Pages later. */}
        <BrowserRouter basename={import.meta.env.BASE_URL}>
          <App />
          {/* Backend errors are shown as toasts (TASK-14, 21, 28, 56). */}
          <ToastContainer position="top-right" autoClose={3000} theme="dark" />
        </BrowserRouter>
      </PersistGate>
    </Provider>
  </StrictMode>,
);
