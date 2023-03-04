import { useEffect, useState } from 'react';
import Register from './pages/authentication/Register';
import ThemeCustomization from './themes';
import { JWTProvider as AuthProvider } from './contexts/JWTContext';

const App = () => {
    return (
        <ThemeCustomization>
            <AuthProvider>
                <Register />
            </AuthProvider>
        </ThemeCustomization>
    );
};

export default App;
