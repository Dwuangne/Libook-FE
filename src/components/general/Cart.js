import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  selectCart,
  updateQuantityCart,
  removeFromCart,
  clearCart,
} from "../../redux/CartSlice";
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  Box,
  Checkbox,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";

import { useNavigate } from "react-router-dom";
import { GetAllVouchersApi } from "../../api/VoucherApi";

const Cart = () => {
  const dispatch = useDispatch();
  const cartData = useSelector(selectCart);
  const [selectedBooks, setSelectedBooks] = useState([]);
  const [vouchers, setVouchers] = useState([]);
  const [selectedVoucher, setSelectedVoucher] = useState(null);
  const [loading, setLoading] = useState(true); // Loading state
  const navigate = useNavigate();

  // Increase quantity
  const handleIncreaseQuantity = (book) => {
    dispatch(updateQuantityCart({ book, quantityChange: 1 }));
    updateSelectedBooks(book, 1);
  };

  // Decrease quantity
  const handleDecreaseQuantity = (book) => {
    dispatch(updateQuantityCart({ book, quantityChange: -1 }));
    updateSelectedBooks(book, -1);
  };

  // Remove item
  const handleRemoveItem = (book) => {
    dispatch(removeFromCart(book));
    setSelectedBooks((prevSelectedBooks) =>
      prevSelectedBooks.filter((item) => item.book.id !== book.id)
    );
  };

  // Clear entire cart
  const handleClearCart = () => {
    dispatch(clearCart());
    setSelectedBooks([]);
  };

  // Checkbox change for selecting books
  const handleCheckboxChange = (event, item) => {
    if (event.target.checked) {
      const bookInCart = cartData.books.find((b) => b.book.id === item.book.id);
      setSelectedBooks([
        ...selectedBooks,
        { ...item, quantity: bookInCart.quantity },
      ]);
    } else {
      setSelectedBooks(
        selectedBooks.filter((selected) => selected.book.id !== item.book.id)
      );
    }
  };

  // Update selected books when quantities change
  const updateSelectedBooks = (book, quantityChange) => {
    setSelectedBooks((prevSelectedBooks) =>
      prevSelectedBooks.map((item) =>
        item.book.id === book.id
          ? { ...item, quantity: item.quantity + quantityChange }
          : item
      )
    );
  };

  // Fetch vouchers
  const fetchVouchers = async () => {
    try {
      const response = await GetAllVouchersApi();
      setVouchers(response.data.data); // Ensure correct assignment
    } catch (error) {
      console.error("Error fetching vouchers:", error);
    } finally {
      setLoading(false);
    }
  };

  // Calculate total before discount
  const calculateTotalBeforeDiscount = () => {
    return selectedBooks.reduce((sum, item) => {
      if (item && item.book) {
        return sum + item.book.price * item.quantity;
      }
      return sum;
    }, 0);
  };

  // Calculate discount
  const calculateDiscount = () => {
    if (!selectedVoucher) return 0;
    return selectedVoucher.discount;
  };

  // Calculate total after discount
  const calculateTotalAfterDiscount = () => {
    const totalBefore = calculateTotalBeforeDiscount();
    const discount = calculateDiscount();
    return totalBefore - discount > 0 ? totalBefore - discount : 0;
  };

  // Handle voucher selection
  const handleVoucherSelect = (event) => {
    const voucherId = event.target.value;
    const selected = vouchers.find((v) => v.voucherId === voucherId);
    setSelectedVoucher(selected);
  };

  // Handle checkout
  const handleCheckout = () => {
    if (selectedBooks.length === 0) {
      alert("Vui lòng chọn ít nhất một sách để thanh toán.");
      return;
    }
    const totalAmount = calculateTotalAfterDiscount();
    navigate("/checkout", {
      state: { selectedBooks, totalAmount, selectedVoucher },
    });
  };

  useEffect(() => {
    fetchVouchers();
  }, []);

  useEffect(() => {
    setSelectedBooks((prevSelectedBooks) =>
      prevSelectedBooks.map((selected) => {
        const bookInCart = cartData.books.find(
          (item) => item.book.id === selected.book.id
        );
        return bookInCart
          ? { ...selected, quantity: bookInCart.quantity }
          : selected;
      })
    );
  }, [cartData.books]);

  return (
    <Box
      p={3}
      backgroundColor="#f0f0f0"
      paddingLeft="100px"
      paddingRight="100px"
    >
      <Box
        sx={{
          padding: "10px 10px 40px 10px",
          backgroundColor: "white",
        }}
      >
        <Typography variant="h4" mb={3}>
          Giỏ Hàng
        </Typography>
        {cartData.books.length > 0 ? (
          <>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Chọn</TableCell>
                  <TableCell>Sách</TableCell>
                  <TableCell>Số lượng</TableCell>
                  <TableCell>Giá</TableCell>
                  <TableCell>Thao tác</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {cartData.books.map((item) => (
                  <TableRow key={item.book.id}>
                    <TableCell>
                      <Checkbox
                        onChange={(event) => handleCheckboxChange(event, item)}
                        checked={selectedBooks.some(
                          (selected) => selected.book.id === item.book.id
                        )}
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="subtitle1">
                        {item.book.name}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="outlined"
                        onClick={() => handleDecreaseQuantity(item.book)}
                        disabled={item.quantity <= 1}
                      >
                        -
                      </Button>
                      <span style={{ margin: "0 10px" }}>{item.quantity}</span>
                      <Button
                        variant="outlined"
                        onClick={() => handleIncreaseQuantity(item.book)}
                        disabled={item.quantity >= item.book.remain}
                      >
                        +
                      </Button>
                    </TableCell>
                    <TableCell>
                      {item.book.price.toLocaleString("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      })}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="contained"
                        color="error"
                        onClick={() => handleRemoveItem(item.book)}
                      >
                        Xóa
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            <Box mt={3}>
              {loading ? (
                <Typography>Đang tải voucher...</Typography>
              ) : (
                <FormControl fullWidth>
                  <InputLabel id="voucher-label">Chọn Voucher</InputLabel>
                  <Select
                    labelId="voucher-label"
                    value={selectedVoucher ? selectedVoucher.voucherId : ""}
                    onChange={handleVoucherSelect}
                  >
                    {Array.isArray(vouchers) && vouchers.length > 0 ? (
                      vouchers.map((voucher) => (
                        <MenuItem
                          key={voucher.voucherId}
                          value={voucher.voucherId}
                        >
                          {voucher.title} (
                          {voucher.discount.toLocaleString("vi-VN")} VND)
                        </MenuItem>
                      ))
                    ) : (
                      <MenuItem disabled>Không có voucher khả dụng</MenuItem>
                    )}
                  </Select>
                </FormControl>
              )}
            </Box>

            <Box mt={3}>
              <Typography variant="h6">
                Thành tiền:{" "}
                {calculateTotalBeforeDiscount().toLocaleString("vi-VN", {
                  style: "currency",
                  currency: "VND",
                })}
              </Typography>
              <Typography variant="h6">
                Giảm giá:{" "}
                {calculateDiscount().toLocaleString("vi-VN", {
                  style: "currency",
                  currency: "VND",
                })}
              </Typography>
              <Typography variant="h6">
                Tổng tiền:{" "}
                {calculateTotalAfterDiscount().toLocaleString("vi-VN", {
                  style: "currency",
                  currency: "VND",
                })}
              </Typography>
              <Button
                variant="contained"
                color="secondary"
                onClick={handleClearCart}
                style={{ marginTop: 10 }}
              >
                Xóa toàn bộ giỏ hàng
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={handleCheckout}
                style={{ marginTop: 10, marginLeft: 10 }}
              >
                Thanh toán
              </Button>
            </Box>
          </>
        ) : (
          <Typography variant="h6">Giỏ hàng hiện đang trống.</Typography>
        )}
      </Box>
    </Box>
  );
};

export default Cart;
