import axiosJWT from "./ConfigAxiosInterceptor";

const URL_LOGIN = `https://app-libook-adchhwceexbve4g5.southeastasia-01.azurewebsites.net/api/Auth/Login`;
const URL_SIGNUP = `https://app-libook-adchhwceexbve4g5.southeastasia-01.azurewebsites.net/api/Auth/Register`;
const URL_LOGIN_GOOGLE = `https://app-libook-adchhwceexbve4g5.southeastasia-01.azurewebsites.net/api/Auth/google-login`;

// export const UserApi = (params) => {
//     return axiosJWT.get(URL_LOGIN, {
//         params: params,
//     })
// }

export const loginApi = (username, password) => {
  return axiosJWT.post(URL_LOGIN, {
    username: username,
    password: password,
  });
};

export const signUpApi = (username, password) => {
  return axiosJWT.post(URL_SIGNUP, {
    username: username,
    password: password,
    roles: ["customer"],
  });
};

export const loginGoogleApi = (token) => {
  return axiosJWT.post(URL_LOGIN_GOOGLE, {
    token: token,
  });
};

export const userProfileApi = () => {
  return axiosJWT.get(URL_LOGIN);
};
