import axiosJWT from "./ConfigAxiosInterceptor";

const URL_CHECKOUT = `https://app-libook-adchhwceexbve4g5.southeastasia-01.azurewebsites.net/api/Checkout`;

export const createPaymentLinkApi = (orderId, description) => {
  return axiosJWT.post(`${URL_CHECKOUT}/create`, {
    orderId: orderId,
    description: description,
  });
};
