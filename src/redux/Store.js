import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./AuthSlice";
import logger from "redux-logger";
import { persistStore } from "redux-persist";
import cartReducer from "./CartSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    cart: cartReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(logger), // Thêm middleware logger vào store
});

export const persistor = persistStore(store);
export default store;
