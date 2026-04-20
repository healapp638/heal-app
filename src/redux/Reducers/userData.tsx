import { createSlice } from '@reduxjs/toolkit';
import { strings } from '../../constants/variables';
export const userDataSlice = createSlice({
    name: 'userData',
    initialState: {
        auth: false,
        token: '',
        user: {},
        appLanguage: strings.english,
        fontScaling: 1.0
    },
    reducers: {
        setAuth: (state, action) => {
            state.auth = action.payload;
        },
        setUser: (state, action) => {
            state.user = action.payload;
        },
        setToken: (state, action) => {
            state.token = action.payload;
        },
        setFontScaling: (state, action) => {
            state.fontScaling = action.payload;
        },
        SetAppLanguage: (state, action) => {
            state.appLanguage = action.payload;
        }

    },
});
export const {
    setAuth,
    setUser,
    setToken,
    SetAppLanguage,
    setFontScaling
} = userDataSlice.actions;

export default userDataSlice.reducer;
