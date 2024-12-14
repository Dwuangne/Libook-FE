import axiosJWT from "./ConfigAxiosInterceptor";

const URL_ORDERINFO = `https://app-libook-adchhwceexbve4g5.southeastasia-01.azurewebsites.net/api/OrderInfo`;

export const GetOrderInfoAdressByUserIdApi = (userId) => {
  return axiosJWT.get(`${URL_ORDERINFO}/user/${userId}`);
};

export const postOrderInfoApi = (
  name,
  phone,
  provinceId,
  districtId,
  wardId,
  address,
  userId
) => {
  return axiosJWT.post(URL_ORDERINFO, {
    name: name,
    phone: phone,
    provinceId: provinceId,
    districtId: districtId,
    wardId: wardId,
    address: address,
    userId: userId,
  });
};
