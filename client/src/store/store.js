import { combineReducers, configureStore, createSlice } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

const USER_INITIAL_STATE = {
  currentUser: null,
  error: null,
  loading: false,
};

const THEME_INITIAL_STATE = {
  isDark: false,
};

export const themeSlice = createSlice({
  name: "theme",
  initialState: THEME_INITIAL_STATE,
  reducers: {
    toogleMode: (state) => {
      state.isDark = !state.isDark;
    },
  },
});

export const userSlice = createSlice({
  name: "user",
  initialState: USER_INITIAL_STATE,
  reducers: {
    signInStart: (state) => {
      state.loading = true;
      state.error = null;
    },

    signInError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },

    signInSuccess: (state, action) => {
      state.error = null;
      state.loading = false;
      state.currentUser = action.payload;
    },
    updateStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    updateError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    updateSuccess: (state, action) => {
      state.error = null;
      state.loading = false;
      state.currentUser = action.payload;
    },
    deleteStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    deleteFailure: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    deleteSuccess: (state, action) => {
      state.error = null;
      state.loading = false;
      state.currentUser = null;
    },
    signOutSuccess: (state) => {
      state.error = null;
      state.loading = false;
      state.currentUser = null;
    },
  },
});

const rootReducer = combineReducers({
  user: userSlice.reducer,
  theme: themeSlice.reducer,
});

const persistConfig = {
  key: "root",
  storage,
  version: 1,
};

const persistedStore = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedStore,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
});

export const {
  signInStart,
  signInError,
  signInSuccess,
  updateStart,
  updateError,
  updateSuccess,
  deleteFailure,
  deleteStart,
  deleteSuccess,
  signOutSuccess,
} = userSlice.actions;
export const { toogleMode } = themeSlice.actions;
export const persistor = persistStore(store);
