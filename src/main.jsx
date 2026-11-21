import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';

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
        <App />
      </PersistGate>
    </Provider>
  </StrictMode>,
);
