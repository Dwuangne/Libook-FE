import axiosJWT from "./ConfigAxiosInterceptor";

const URL_CATEGORY = `https://app-libook-adchhwceexbve4g5.southeastasia-01.azurewebsites.net/api/Category`;

export const GetCategoryApi = (params) => {
  return axiosJWT.get(URL_CATEGORY, {
    params: params,
  });
};
