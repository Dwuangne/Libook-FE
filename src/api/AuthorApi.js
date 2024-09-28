import axiosJWT from "./ConfigAxiosInterceptor";

const URL_AUTHOR = `https://localhost:7158/api/Author`;

export const GetAuthorApi = (params) => {
    return axiosJWT.get(URL_AUTHOR, {
        params: params
    });
};