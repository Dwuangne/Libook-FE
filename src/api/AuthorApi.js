import axiosJWT from "./ConfigAxiosInterceptor";

const URL_AUTHOR = `https://app-libook-adchhwceexbve4g5.southeastasia-01.azurewebsites.net/api/Author`;

export const GetAuthorApi = (params) => {
  return axiosJWT.get(URL_AUTHOR, {
    params: params,
  });
};
