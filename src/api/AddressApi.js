import axiosJWT from "./ConfigAxiosInterceptor";

const URL_PROVINCE = `https://app-libook-adchhwceexbve4g5.southeastasia-01.azurewebsites.net/api/province`;
const URL_DISTRICT = `https://app-libook-adchhwceexbve4g5.southeastasia-01.azurewebsites.net/api/district/province`;
const URL_WARD = `https://app-libook-adchhwceexbve4g5.southeastasia-01.azurewebsites.net/api/ward/district`;

export const GetProvinceApi = (params) => {
  return axiosJWT.get(URL_PROVINCE, {
    params: params,
  });
};

export const GetDistrictByProvinceApi = (provinceId) => {
  return axiosJWT.get(`${URL_DISTRICT}/${provinceId}`);
};

export const GetWardByDistrictApi = (districtId) => {
  return axiosJWT.get(`${URL_WARD}/${districtId}`);
};
