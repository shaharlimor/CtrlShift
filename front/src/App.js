import { useEffect, useState } from 'react';
import Register from './pages/authentication/Register';
import Login from './pages/authentication/Login';
import ThemeCustomization from './themes';
import { JWTProvider as AuthProvider } from './contexts/JWTContext';

const App = () => {
    return (
        <ThemeCustomization>
            <AuthProvider>
                <Login />
            </AuthProvider>
        </ThemeCustomization>
    );
};

export default App;
