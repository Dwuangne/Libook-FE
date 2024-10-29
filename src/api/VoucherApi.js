import axiosJWT from "./ConfigAxiosInterceptor";

const URL_VOUCHER = `https://app-libook-adchhwceexbve4g5.southeastasia-01.azurewebsites.net/api/Voucher`;

export const AddVoucherApi = (
    title,
    startDate,
    endDate,
    discount,
    remain
) => {
    return axiosJWT.post(URL_VOUCHER, {
        title: title,
        startDate: startDate,
        endDate: endDate,
        discount: discount,
        remain: remain
    });
};

export const GetAllVouchersApi = (params) => {
    return axiosJWT.get(URL_VOUCHER, {
        params: params,
    });
};

export const GetVoucherByIdApi = (voucherId) => {
    return axiosJWT.get(`${URL_VOUCHER}/${voucherId}`);
};

export const UpdateRemainVoucherApi = (
    voucherId,
    remain,
) => {
    return axiosJWT.put(`${URL_VOUCHER}/${voucherId}`, {
        remain: remain
    });
};
