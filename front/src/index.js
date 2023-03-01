import { createRoot } from 'react-dom/client';
import React from 'react';

// third party
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';

// project imports
import App from './App';
import { BASE_PATH } from './config';
import { ConfigProvider } from './contexts/ConfigContext';

// style + assets
import './assets/scss/style.scss';

const container = document.getElementById('root');
const root = createRoot(container);
root.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>

    // <Provider store={store}>
    // <PersistGate loading={null} persistor={persister}>
    // <ConfigProvider>
    //<BrowserRouter basename={BASE_PATH}>
    //<App />
    // </BrowserRouter>
    // </ConfigProvider>
    // </PersistGate>
    // </Provider>
);
