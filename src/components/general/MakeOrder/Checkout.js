import React, { useState } from "react";
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
  RadioGroup,
  FormControlLabel,
  Radio,
} from "@mui/material";
import AddressSelector from "./AddressSelector";
import { toast } from "react-toastify";
import { makeOrderApi } from "../../../api/MakeOrderApi";
import { useDispatch } from "react-redux";
import { removeFromCart } from "../../../redux/CartSlice";

const Checkout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { selectedBooks, totalAmount, selectedVoucher } = location.state || {};
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [orderId, setOrderId] = useState("");

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

  const handleConfirmPayment = async () => {
    if (!selectedAddress) {
      alert("Vui lòng chọn địa chỉ nhận hàng.");
      return;
    }

    // Chuẩn bị dữ liệu cho orderDetails
    const orderDetails = selectedBooks.map((item) => ({
      unitPrice: item.book.price,
      quantity: item.quantity,
      bookId: item.book.id,
    }));

    // Chuẩn bị dữ liệu cho API
    const orderData = {
      amount: totalAmount,
      paymentMethod: paymentMethod,
      userId: selectedAddress.userId,
      voucherId: selectedVoucher ? selectedVoucher.voucherId : null,
      orderInfoId: selectedAddress.id,
      orderDetails: orderDetails,
      orderStatuses: [{ status: "Processing" }],
    };
    console.log(">>>>>>>>>>> orderData: ", orderData);

    try {
      const response = await makeOrderApi(
        orderData.amount,
        orderData.paymentMethod,
        orderData.userId,
        orderData.voucherId,
        orderData.orderInfoId,
        orderData.orderDetails,
        orderData.orderStatuses
      );
      console.log("Đơn hàng đã gửi:", response.data);

      const newOrderId = response.data.data.orderId;
      setOrderId(newOrderId);
      const bookIdsToRemove = selectedBooks.map((item) => item.book.id);
      dispatch(removeFromCart(bookIdsToRemove));
      toast.success("Thanh toán thành công!");
      console.log(">>> Navigating based on paymentMethod...");
      setTimeout(() => {
        if (paymentMethod === "COD") {
          navigate("/");
        } else if (paymentMethod === "Bank Transfer") {
          navigate("/payment", { state: { orderId: newOrderId } });
        }
      }, 1000);
    } catch (error) {
      console.error("Lỗi khi đặt hàng:", error);
      toast.error("Thanh toán thất bại. Vui lòng thử lại.");
    }
  };

  return (
    <Box p={3}>
      <Typography variant="h4" mb={3}>
        Thanh Toán
      </Typography>

      {/* Chọn địa chỉ nhận hàng */}
      <AddressSelector onAddressSelect={setSelectedAddress} />

      {/* Chọn phương thức thanh toán */}
      <Box mt={3}>
        <Typography variant="h6">Phương thức thanh toán:</Typography>
        <RadioGroup
          value={paymentMethod}
          onChange={(e) => setPaymentMethod(e.target.value)}
        >
          <FormControlLabel
            value="COD"
            control={<Radio />}
            label="Thanh toán khi nhận hàng"
          />
          <FormControlLabel
            value="Bank Transfer"
            control={<Radio />}
            label="Chuyển khoản ngân hàng"
          />
        </RadioGroup>
      </Box>

      {selectedVoucher && (
        <Box mt={3}>
          <Typography variant="h6">Voucher được áp dụng:</Typography>
          <Typography>- {selectedVoucher.title}</Typography>
          <Typography>
            Giảm giá:{" "}
            {selectedVoucher.discount.toLocaleString("vi-VN", {
              style: "currency",
              currency: "VND",
            })}
          </Typography>
        </Box>
      )}

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

      {/* Tổng tiền */}
      <Box mt={3}>
        <Typography variant="h6">
          Tổng tiền:{" "}
          {totalAmount.toLocaleString("vi-VN", {
            style: "currency",
            currency: "VND",
          })}
        </Typography>
      </Box>

      {/* Nút hành động */}
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
