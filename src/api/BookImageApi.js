import axiosJWT from "./ConfigAxiosInterceptor";

const URL_BOOKIMAGE = `https://app-libook-adchhwceexbve4g5.southeastasia-01.azurewebsites.net/api/BookImage`;

export const GetBookImageByBookIdApi = (username, password) => {
  return axiosJWT.get(URL_BOOKIMAGE, {
    username: username,
    password: password,
  });
};
