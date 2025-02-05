import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isLoggedIn: Boolean(localStorage.getItem("accessToken")),
  user: {
    username: localStorage.getItem("username") || "User",
    avatarUrl: localStorage.getItem("avatarUrl") || "",
    role: localStorage.getItem("role") || "",
    userId: localStorage.getItem("userId") || "",
  },
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login(state, action) {
      state.isLoggedIn = true;
      state.user = action.payload;

      // Lưu vào localStorage
      localStorage.setItem("accessToken", action.payload.token);
      localStorage.setItem("username", action.payload.username);
      localStorage.setItem("avatarUrl", action.payload.avatarUrl);
      localStorage.setItem("role", action.payload.role);
      localStorage.setItem("userId", action.payload.userId);
    },
    logout(state) {
      state.isLoggedIn = false;
      state.user = { username: "User", avatarUrl: "", role: "", userId: "" };

      // Xóa localStorage
      localStorage.clear();
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
