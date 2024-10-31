import { createSlice } from "@reduxjs/toolkit";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

const initialState = {
  data: {
    books: [],
  },
};

const persistConfig = {
  key: "cart",
  version: 1,
  storage,
};
export const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const { book, quantity } = action.payload;
      const addedBookId = book.id;
      const existingBook = state.data.books.find(
        (item) => item.book.id == addedBookId
      );
      if (existingBook) {
        const updatedQuantity = Math.min(
          existingBook.quantity + quantity,
          book.remain,
          99
        );
        existingBook.quantity = Math.max(updatedQuantity, 1);
      } else {
        state.data.books.push(action.payload);
      }
    },
    updateQuantityCart: (state, action) => {
      const { book, quantityChange } = action.payload;
      const existingBook = state.data.books.find(
        (item) => item.book.id === book.id
      );
      if (existingBook) {
        existingBook.quantity += quantityChange;
        if (existingBook.quantity <= 0) {
          state.data.books = state.data.books.filter(
            (item) => item.book.id !== book.id
          );
        }
      }
    },
    removeFromCart: (state, action) => {
      const bookIdsToRemove = Array.isArray(action.payload)
        ? action.payload
        : [action.payload.id];
      state.data.books = state.data.books.filter(
        (item) => !bookIdsToRemove.includes(item.book.id)
      );
    },
    clearCart: (state) => {
      state.data.books = [];
    },
  },
});
export const { addToCart, updateQuantityCart, removeFromCart, clearCart } =
  cartSlice.actions;
export const selectCart = (state) => state.cart.data;
export const selectCartAmount = (state) => state.cart.data.books.length;
export const selectTotalCost = (state) =>
  Math.round(
    state.cart.data.books.reduce(
      (total, item) => total + item.book.price * item.quantity,
      0
    )
  );

const persistedReducer = persistReducer(persistConfig, cartSlice.reducer);

export default persistedReducer;
