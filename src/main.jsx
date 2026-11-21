import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { BrowserRouter } from 'react-router-dom';

import 'modern-normalize/modern-normalize.css';
import './styles/fonts.css';
import './styles/variables.css';
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
        </BrowserRouter>
      </PersistGate>
    </Provider>
  </StrictMode>,
);
