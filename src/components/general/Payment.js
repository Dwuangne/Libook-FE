import React from "react";
import { useLocation } from "react-router-dom";
import { Box, Typography } from "@mui/material";
import { createPaymentLinkApi } from "../../api/PaymentApi";
import { useEffect, useState } from "react";

const Payment = () => {
  const location = useLocation();
  const { orderId } = location.state || {};
  const [checkoutUrl, setCheckoutUrl] = useState("");

  useEffect(() => {
    const fetchPaymentLink = async () => {
      try {
        const response = await createPaymentLinkApi(orderId, "abcxus");
        console.log(">>>>>>>>>. orderId:", orderId);
        console.log(">>>>>>>>>. response:", response);

        if (response.data.status === 200) {
          setCheckoutUrl(response.data.data.checkoutUrl);
        } else {
          console.error("Error:", response.data.message);
        }
      } catch (error) {
        console.error("Failed to create payment link:", error);
      }
    };

    fetchPaymentLink();
  }, [orderId]);

  const redirectToPayment = () => {
    if (checkoutUrl) {
      window.location.href = checkoutUrl; // Chuyển trang thanh toán
    }
  };

  if (!orderId) {
    return (
      <Box p={3}>
        <Typography variant="h6">Không có đơn hàng nào để xử lý.</Typography>
      </Box>
    );
  }

  return (
    <Box p={3}>
      <Typography variant="h4" mb={3}>
        Chuyển khoản ngân hàng
      </Typography>
      <Typography variant="body1">
        Mã đơn hàng của bạn: <strong>{orderId}</strong>
      </Typography>
      <Typography variant="body2" mt={2}>
        Vui lòng chuyển khoản theo thông tin được cung cấp để hoàn tất thanh
        toán.
      </Typography>
      <div>
        <h1>Trang Thanh Toán</h1>
        {checkoutUrl ? (
          <div>
            <p>Nhấn vào nút dưới để tiến hành thanh toán:</p>
            <button onClick={redirectToPayment}>Thanh Toán</button>
          </div>
        ) : (
          <p>Đang tạo liên kết thanh toán...</p>
        )}
      </div>
    </Box>
  );
};

export default Payment;
