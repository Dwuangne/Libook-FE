import { createSlice } from "@reduxjs/toolkit";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

// Trạng thái khởi tạo
const initialState = {
  data: {
    books: [], // Danh sách sách trong giỏ hàng
  },
};

// Cấu hình persist
const persistConfig = {
  key: "cart", // key để lưu trong localStorage
  version: 1, // Phiên bản
  storage, // Sử dụng localStorage
};

// Slice giỏ hàng
export const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    // Thêm sản phẩm vào giỏ hàng
    addToCart: (state, action) => {
      const { book, quantity } = action.payload;
      const addedBookId = book.id;

      // Kiểm tra sản phẩm đã tồn tại trong giỏ hàng chưa
      const existingBook = state.data.books.find(
        (item) => item.book.id === addedBookId
      );

      if (existingBook) {
        // Cập nhật số lượng tối đa là `remain` hoặc 99
        const updatedQuantity = Math.min(
          existingBook.quantity + quantity,
          book.remain,
          99
        );
        existingBook.quantity = Math.max(updatedQuantity, 1); // Đảm bảo số lượng không nhỏ hơn 1
      } else {
        // Thêm sản phẩm mới vào giỏ hàng
        state.data.books.push({ book, quantity });
      }
    },

    // Cập nhật số lượng sản phẩm trong giỏ
    updateQuantityCart: (state, action) => {
      const { book, quantityChange } = action.payload;
      const existingBook = state.data.books.find(
        (item) => item.book.id === book.id
      );

      if (existingBook) {
        existingBook.quantity += quantityChange;
        // Nếu số lượng <= 0, xóa sản phẩm khỏi giỏ hàng
        if (existingBook.quantity <= 0) {
          state.data.books = state.data.books.filter(
            (item) => item.book.id !== book.id
          );
        }
      }
    },

    // Xóa sản phẩm khỏi giỏ hàng
    removeFromCart: (state, action) => {
      const bookIdsToRemove = Array.isArray(action.payload)
        ? action.payload
        : [action.payload.id];
      state.data.books = state.data.books.filter(
        (item) => !bookIdsToRemove.includes(item.book.id)
      );
    },

    // Xóa toàn bộ giỏ hàng
    clearCart: (state) => {
      state.data.books = [];
    },
  },
});

// Export các actions
export const { addToCart, updateQuantityCart, removeFromCart, clearCart } =
  cartSlice.actions;

// Selector để lấy giỏ hàng
export const selectCart = (state) => state.cart.data;

// Lấy số lượng sản phẩm trong giỏ
export const selectCartAmount = (state) => state.cart.data.books.length;

// Tính tổng chi phí của giỏ hàng
export const selectTotalCost = (state) =>
  Math.round(
    state.cart.data.books.reduce(
      (total, item) => total + item.book.price * item.quantity,
      0
    )
  );

// Kết hợp với persistReducer để lưu giỏ hàng vào localStorage
const persistedReducer = persistReducer(persistConfig, cartSlice.reducer);

export default persistedReducer;
