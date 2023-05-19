import Routes from 'routes';

// project imports
import NavigationScroll from 'layout/NavigationScroll';
import Snackbar from 'components/Snackbar';
import ThemeCustomization from 'themes';
import { JWTProvider as AuthProvider } from './contexts/JWTContext';
import { useToaster, Toaster } from 'react-hot-toast';

const App = () => (
    <ThemeCustomization>
        <NavigationScroll>
            <AuthProvider>
                <Toaster position="top-center" reverseOrder={false}>
                    <>
                        <Routes />
                        <Snackbar />
                    </>
                </Toaster>
            </AuthProvider>
        </NavigationScroll>
    </ThemeCustomization>
);

export default App;
