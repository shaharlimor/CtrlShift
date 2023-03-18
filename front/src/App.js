import Routes from 'routes';

// project imports
import NavigationScroll from 'layout/NavigationScroll';
import Snackbar from 'components/Snackbar';
import ThemeCustomization from 'themes';
import { JWTProvider as AuthProvider } from './contexts/JWTContext';

const App = () => (
    <ThemeCustomization>
        <NavigationScroll>
            <AuthProvider>
                <>
                    <Routes />
                    <Snackbar />
                </>
            </AuthProvider>
        </NavigationScroll>
    </ThemeCustomization>
);

export default App;
