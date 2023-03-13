import PropTypes from 'prop-types';
import { createContext } from 'react';

// project import
import defaultConfig from 'config';
import useLocalStorage from 'hooks/useLocalStorage';

// initial state
const initialState = {
    ...defaultConfig,
    onChangeLayout: () => {},
    onChangeDrawer: () => {},
    onChangeMenuType: () => {},
    onChangeContainer: () => {},
    onChangeFontFamily: () => {},
    onChangeBorderRadius: () => {},
    onChangeOutlinedField: () => {}
};

const ConfigContext = createContext(initialState);

function ConfigProvider({ children }) {
    const [config, setConfig] = useLocalStorage('config', {
        layout: initialState.layout,
        drawerType: initialState.drawerType,
        fontFamily: initialState.fontFamily,
        borderRadius: initialState.borderRadius,
        outlinedFilled: initialState.outlinedFilled
    });

    const onChangeLayout = (layout) => {
        setConfig({
            ...config,
            layout
        });
    };

    const onChangeDrawer = (drawerType) => {
        setConfig({
            ...config,
            drawerType
        });
    };

    const onChangeMenuType = (navType) => {
        setConfig({
            ...config,
            navType
        });
    };

    const onChangeContainer = () => {
        setConfig({
            ...config,
            container: !config.container
        });
    };

    const onChangeFontFamily = (fontFamily) => {
        setConfig({
            ...config,
            fontFamily
        });
    };

    const onChangeBorderRadius = (event, newValue) => {
        setConfig({
            ...config,
            borderRadius: newValue
        });
    };

    const onChangeOutlinedField = (outlinedFilled) => {
        setConfig({
            ...config,
            outlinedFilled
        });
    };

    return (
        <ConfigContext.Provider
            value={{
                ...config,
                onChangeLayout,
                onChangeDrawer,
                onChangeMenuType,
                onChangeContainer,
                onChangeFontFamily,
                onChangeBorderRadius,
                onChangeOutlinedField
            }}
        >
            {children}
        </ConfigContext.Provider>
    );
}

ConfigProvider.propTypes = {
    children: PropTypes.node
};

export { ConfigProvider, ConfigContext };
