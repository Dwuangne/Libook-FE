import axiosJWT from "./ConfigAxiosInterceptor";

const URL_ORDER = `https://app-libook-adchhwceexbve4g5.southeastasia-01.azurewebsites.net/api/Order`;

export const GetOrderInfoAdressByUserIdApi = (userId) => {
  return axiosJWT.get(`${URL_ORDER}/user/${userId}`);
};

export const makeOrderApi = (
  amount,
  paymentMethod,
  userId,
  voucherId,
  orderInfoId,
  orderDetails,
  orderStatuses
) => {
  return axiosJWT.post(URL_ORDER, {
    amount: amount,
    paymentMethod: paymentMethod,
    userId: userId,
    voucherId: voucherId,
    orderInfoId: orderInfoId,
    orderDetails: orderDetails,
    orderStatuses: orderStatuses,
  });
};
