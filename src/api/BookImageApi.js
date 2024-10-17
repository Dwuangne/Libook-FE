import axiosJWT from "./ConfigAxiosInterceptor";

const URL_BOOKIMAGE = `https://app-libook-adchhwceexbve4g5.southeastasia-01.azurewebsites.net/api/BookImage`;

export const GetBookImageByBookIdApi = (bookId) => {
  return axiosJWT.get(`${URL_BOOKIMAGE}/book/${bookId}`);
};

export const GetBookImageByIdApi = (bookImageId) => {
  return axiosJWT.get(`${URL_BOOKIMAGE}/${bookImageId}`);
};

export const AddBookImageApi = (bookImageUrl, bookId) => {
  return axiosJWT.post(URL_BOOKIMAGE, {
    bookImageUrl: bookImageUrl,
    bookId: bookId,
  });
};

export const DeleteBookImageByIdApi = (bookImageId) => {
  return axiosJWT.delete(`${URL_BOOKIMAGE}/${bookImageId}`);
};
