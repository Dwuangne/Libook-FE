import axiosJWT from "./ConfigAxiosInterceptor";

const URL_BOOK = `https://localhost:7158/api/Book`;

export const AddBookApi = (
  name,
  description,
  price,
  precentDiscount,
  remain,
  isActive,
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
    isActive: isActive,
    authorId: authorId,
    categoryId: categoryId,
    supplierId: supplierId,
    bookImages: bookImages,
  });
};
