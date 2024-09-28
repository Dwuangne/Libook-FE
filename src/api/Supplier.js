import axiosJWT from "./ConfigAxiosInterceptor";

const URL_SUPPLIER = `https://localhost:7158/api/Supplier`;

export const GetSupplierApi = (params) => {
    return axiosJWT.get(URL_SUPPLIER, {
        params: params
    });
};