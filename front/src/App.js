import { useEffect, useState } from 'react';
import BackgroundPattern1 from './components/BackgroundPattern1';
import ThemeCustomization from './themes';
import Routes from './routes';

const App = () => {
    return (
        <ThemeCustomization>
            <Routes />
        </ThemeCustomization>
    );
};

export default App;
