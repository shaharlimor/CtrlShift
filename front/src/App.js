import { useEffect, useState } from 'react';
import BackgroundPattern1 from './components/BackgroundPattern1';
import ThemeCustomization from './themes';

const App = () => {
    return (
        <ThemeCustomization>
            <BackgroundPattern1 />
        </ThemeCustomization>
    );
};

export default App;
