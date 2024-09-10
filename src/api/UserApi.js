import axiosJWT from "./ConfigAxiosInterceptor";

const URL_LOGIN = `https://localhost:7158/api/Auth/Login`;
const URL_SIGNUP = `https://localhost:7158/api/Auth/Register`;


export const UserApi = (params) => {
    return axiosJWT.get(URL_LOGIN, {
        params: params,
    })
}

export const loginApi = (username, password) => {
    return axiosJWT.post(URL_LOGIN, {
        username: username,
        password: password,
    });
};

export const signUpApi = (
    username,
    password,
    retype,
    role = "customer"

) => {
    return axiosJWT.post(URL_SIGNUP, {
        username: username,
        password: password,
        retype_password: retype,
        role: role
    });
};

