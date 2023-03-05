// routing
import Routes from 'routes';

// project imports
import NavigationScroll from 'layout/NavigationScroll';
import Snackbar from 'ui-component/Snackbar';
import ThemeCustomization from 'themes';

const App = () => (
    <ThemeCustomization>
        <NavigationScroll>
            <>
                <Routes />
                <Snackbar />
            </>
        </NavigationScroll>
    </ThemeCustomization>
);

export default App;
