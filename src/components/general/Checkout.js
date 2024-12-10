import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Typography,
  Box,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
} from "@mui/material";

const Checkout = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Lấy danh sách sách được chọn từ state
  const { selectedBooks, totalAmount } = location.state || {};

  if (!selectedBooks || selectedBooks.length === 0) {
    return (
      <Box p={3}>
        <Typography variant="h6">Không có sách nào để thanh toán.</Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate("/cart")}
        >
          Quay lại giỏ hàng
        </Button>
      </Box>
    );
  }

  const handleConfirmPayment = () => {
    console.log("Processing payment...");
    alert("Thanh toán thành công!");
    navigate("/"); // Chuyển về trang chính sau khi thanh toán thành công
  };

  return (
    <Box p={3}>
      <Typography variant="h4" mb={3}>
        Thanh Toán
      </Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Tên sách</TableCell>
            <TableCell>Số lượng</TableCell>
            <TableCell>Giá</TableCell>
            <TableCell>Thành tiền</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {selectedBooks.map((item) => (
            <TableRow key={item.book.id}>
              <TableCell>{item.book.name}</TableCell>
              <TableCell>{item.quantity}</TableCell>
              <TableCell>
                {item.book.price.toLocaleString("vi-VN", {
                  style: "currency",
                  currency: "VND",
                })}
              </TableCell>
              <TableCell>
                {(item.book.price * item.quantity).toLocaleString("vi-VN", {
                  style: "currency",
                  currency: "VND",
                })}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Box mt={3}>
        <Typography variant="h6">
          Tổng tiền:{" "}
          {totalAmount.toLocaleString("vi-VN", {
            style: "currency",
            currency: "VND",
          })}
        </Typography>
      </Box>
      <Box mt={3}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleConfirmPayment}
        >
          Xác nhận thanh toán
        </Button>
        <Button
          variant="outlined"
          color="secondary"
          onClick={() => navigate("/cart")}
          style={{ marginLeft: 10 }}
        >
          Quay lại giỏ hàng
        </Button>
      </Box>
    </Box>
  );
};

export default Checkout;
