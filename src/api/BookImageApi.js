import axiosJWT from "./ConfigAxiosInterceptor";

const URL_BOOKIMAGE = `https://localhost:7158/api/BookImage`;

export const GetBookImageByBookIdApi = (username, password) => {
    return axiosJWT.get(URL_BOOKIMAGE, {
        username: username,
        password: password,
    });
};