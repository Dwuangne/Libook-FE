import axiosJWT from "./ConfigAxiosInterceptor";

const URL_SUPPLIER = `https://app-libook-adchhwceexbve4g5.southeastasia-01.azurewebsites.net/api/Supplier`;

export const GetSupplierApi = (params) => {
  return axiosJWT.get(URL_SUPPLIER, {
    params: params,
  });
};
