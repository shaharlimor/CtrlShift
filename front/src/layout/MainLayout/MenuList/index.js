import { memo } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import { useMediaQuery } from '@mui/material';

// project imports
import menuItem from 'layout/menu-items';
import NavGroup from './NavGroup';
import LAYOUT_CONST from 'constant';
import { HORIZONTAL_MAX_ITEM } from 'config';
import useConfig from 'hooks/useConfig';
import useAuth from 'hooks/useAuth';

const MenuList = () => {
    const { user } = useAuth();
    const theme = useTheme();
    const matchDownMd = useMediaQuery(theme.breakpoints.down('md'));
    const { layout } = useConfig();

    // last menu-item to show in horizontal menu bar
    const lastItem = layout === LAYOUT_CONST.HORIZONTAL_LAYOUT && !matchDownMd ? HORIZONTAL_MAX_ITEM : null;
    const menuItems = menuItem;
    menuItems.items[0].children = !user?.isAdmin
        ? menuItems.items[0].children.filter((item) => item.id !== 'Organization-Manager' && item.id !== 'Shifts-Board-Manager')
        : menuItems.items[0].children;
    let lastItemIndex = menuItems.items.length - 1;
    let remItems = [];
    let lastItemId;

    if (lastItem && lastItem < menuItems.items.length) {
        lastItemId = menuItems.items[lastItem - 1].id;
        lastItemIndex = lastItem - 1;
        remItems = menuItems.items.slice(lastItem - 1, menuItems.items.length).map((item) => ({
            title: item.title,
            elements: item.children
        }));
    }
    // eslint-disable-next-line
    const navItems = menuItems.items.slice(0, lastItemIndex + 1).map((item) => {
        return <NavGroup key={item.id} item={item} lastItem={lastItem} remItems={remItems} lastItemId={lastItemId} />;
    });

    return <>{navItems}</>;
};

export default memo(MenuList);
