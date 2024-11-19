import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./AuthSlice";
import logger from "redux-logger";

const store = configureStore({
  reducer: {
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(logger), // Thêm middleware logger vào store
});

export default store;
