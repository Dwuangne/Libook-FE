import axiosJWT from "./ConfigAxiosInterceptor";

const URL_VOUCHER = `https://app-libook-adchhwceexbve4g5.southeastasia-01.azurewebsites.net/api/Order`;

export const GetAllOrdersApi = (params) => {
  return axiosJWT.get(URL_VOUCHER, {
    params: params,
  });
};

export const GetOrderByIdApi = (orderId) => {
  return axiosJWT.get(`${URL_VOUCHER}/${orderId}`);
};
