import axiosJWT from "./ConfigAxiosInterceptor";

const URL_CATEGORY = `https://localhost:7158/api/Category`;

export const GetCategoryApi = (params) => {
    return axiosJWT.get(URL_CATEGORY, {
        params: params
    });
};