import axiosJWT from "./ConfigAxiosInterceptor";

const URL_BOOK = `https://app-libook-adchhwceexbve4g5.southeastasia-01.azurewebsites.net/api/Book`;

export const AddBookApi = (
  name,
  description,
  price,
  precentDiscount,
  remain,
  authorId,
  categoryId,
  supplierId,
  bookImages
) => {
  return axiosJWT.post(URL_BOOK, {
    name: name,
    description: description,
    price: price,
    precentDiscount: precentDiscount,
    remain: remain,
    isActive: true,
    authorId: authorId,
    categoryId: categoryId,
    supplierId: supplierId,
    bookImages: bookImages,
  });
};

export const GetAllBooksApi = (params) => {
  return axiosJWT.get(URL_BOOK, {
    params: params,
  });
};

export const GetBookByIdApi = (bookId) => {
  return axiosJWT.get(`${URL_BOOK}/${bookId}`);
};

export const UpdateBookApi = (
  bookId,
  name,
  description,
  price,
  precentDiscount,
  remain,
  authorId,
  categoryId,
  supplierId,
) => {
  return axiosJWT.put(`${URL_BOOK}/${bookId}`, {
    name: name,
    description: description,
    price: price,
    precentDiscount: precentDiscount,
    remain: remain,
    authorId: authorId,
    categoryId: categoryId, 
    supplierId: supplierId, 
  });
};
