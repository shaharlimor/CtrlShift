import { createRoot } from 'react-dom/client';

import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';

import App from 'App';
import { store } from 'store';
import { ConfigProvider } from 'contexts/ConfigContext';

import 'assets/scss/style.scss';

const container = document.getElementById('root');
const root = createRoot(container);
root.render(
    <Provider store={store}>
        <ConfigProvider>
            <BrowserRouter>
                <App />
            </BrowserRouter>
        </ConfigProvider>
    </Provider>
);
