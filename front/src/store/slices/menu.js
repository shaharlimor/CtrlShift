import { createSlice } from '@reduxjs/toolkit';

// initial state
const initialState = {
    selectedItem: [''],
    selectedID: null,
    drawerOpen: false,
    error: null
};

const menu = createSlice({
    name: 'menu',
    initialState,
    reducers: {
        activeItem(state, action) {
            state.selectedItem = action.payload;
        },

        activeID(state, action) {
            state.selectedID = action.payload;
        },

        openDrawer(state, action) {
            state.drawerOpen = action.payload;
        }
    }
});

export default menu.reducer;

export const { activeItem, openDrawer, activeID } = menu.actions;
