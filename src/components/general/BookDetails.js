import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import replaceImg from "../../assets/Blue_Book.jpg";
import { GetAuthorApi } from "../../api/AuthorApi";
import { GetSupplierApi } from "../../api/Supplier";
import { GetCategoryApi } from "../../api/CategoryApi";
import { GetBookByIdApi } from "../../api/BookApi";
import {
  Box,
  Typography,
  Button,
  CardMedia,
  CircularProgress,
  TextField,
  IconButton,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { useDispatch } from "react-redux";
import { addToCart } from "../../redux/CartSlice";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const BookDetail = () => {
  const params = useParams();
  const bookId = params.bookId;
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [book, setBook] = useState({});
  const [loading, setLoading] = useState(true);
  const [authorMap, setAuthorMap] = useState({});
  const [supplierMap, setSupplierMap] = useState({});
  const [categoryMap, setCategoryMap] = useState({});
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    const fetchBookDetail = async () => {
      setLoading(true);
      try {
        const [bookRes, authorRes, supplierRes, categoryRes] =
          await Promise.all([
            GetBookByIdApi(bookId),
            GetAuthorApi(),
            GetSupplierApi(),
            GetCategoryApi(),
          ]);

        const bookData = bookRes?.data?.data || {};
        setBook(bookData);

        const authorData = authorRes?.data?.data || [];
        const supplierData = supplierRes?.data?.data || [];
        const categoryData = categoryRes?.data?.data || [];

        const authorMap = authorData.reduce((map, item) => {
          map[item.id] = item.name;
          return map;
        }, {});

        const supplierMap = supplierData.reduce((map, item) => {
          map[item.id] = item.name;
          return map;
        }, {});

        const categoryMap = categoryData.reduce((map, item) => {
          map[item.id] = item.name;
          return map;
        }, {});

        setAuthorMap(authorMap);
        setSupplierMap(supplierMap);
        setCategoryMap(categoryMap);
        setSelectedImage(bookData.imageUrl);
      } catch (error) {
        console.error("Failed to fetch book details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookDetail();
  }, [bookId]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN").format(amount) + " VND";
  };

  const handleImageClick = (imageUrl) => {
    setSelectedImage(imageUrl);
  };

  const handleQuantityChange = (action) => {
    if (action === "increase") {
      setQuantity(quantity + 1);
    } else if (action === "decrease" && quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const handleAddToCart = () => {
    // Dispatch action to add book to cart with selected quantity
    dispatch(
      addToCart({
        book,
        quantity,
      })
    );
    toast.success("Thêm vào giỏ hàng thành công!", {
      position: "top-right",
      autoClose: 1000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  };

  if (loading) {
    return <CircularProgress />;
  }

  if (!book) {
    return <Typography variant="h6">Book not found</Typography>;
  }

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        padding: "100px 100px 0 100px",
        paddingTop: "100px",
        backgroundColor: "#f0f0f0",
      }}
    >
      {/* Phần ảnh sách */}
      <Box
        sx={{
          flex: 1,
          borderRadius: "8px",
          padding: 2,
          backgroundColor: "#fff",
          mr: 2,
          width: "20%",
        }}
      >
        <CardMedia
          component="img"
          image={selectedImage || replaceImg}
          sx={{
            maxWidth: "100%",
            height: "auto",
            maxHeight: 300,
            objectFit: "contain",
            mb: 2,
            padding: "8px",
            borderRadius: "8px",
          }}
        />

        {/* Các ảnh phụ */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            gap: 2,
            borderTop: "1px solid #ccc",
            paddingTop: 2,
          }}
        >
          {book.bookImages &&
            book.bookImages.map((image, index) => (
              <CardMedia
                key={index}
                component="img"
                image={image.bookImageUrl}
                alt={`Additional image ${index + 1}`}
                sx={{
                  width: 60,
                  height: 80,
                  objectFit: "cover",
                  cursor: "pointer",
                  border:
                    selectedImage === image.bookImageUrl
                      ? "2px solid red"
                      : "1px solid #ccc",
                }}
                onClick={() => handleImageClick(image.bookImageUrl)}
              />
            ))}
        </Box>
      </Box>

      {/* Phần thông tin sách */}
      <Box
        sx={{ flex: 3, backgroundColor: "#f0f0f0", flexDirection: "column" }}
      >
        <Box
          sx={{
            flex: 2,
            pl: 3,
            backgroundColor: "#fff",
            paddingTop: "10px",
            paddingBottom: "10px",
            borderRadius: "8px",
          }}
        >
          <Typography variant="h3" sx={{ fontWeight: "bold", mb: 2 }}>
            {book.name || "No name available"}
          </Typography>

          <Typography variant="h6" sx={{ mb: 1 }}>
            Tác giả: {authorMap[book.authorId] || "Unknown Author"}
          </Typography>

          <Typography variant="h6" sx={{ mb: 1 }}>
            Nhà cung cấp: {supplierMap[book.supplierId] || "Unknown Supplier"}
          </Typography>

          <Typography variant="h6" sx={{ mb: 1 }}>
            Thể loại: {categoryMap[book.categoryId] || "Unknown Category"}
          </Typography>

          <Typography variant="h6" sx={{ mb: 1 }}>
            Số lượng trong kho: {book.remain}
          </Typography>

          <Box
            sx={{
              display: "flex",
              justifyContent: "left",
              alignItems: "center",
              marginTop: 1,
            }}
          >
            <Typography variant="h5" color="error" sx={{ fontWeight: "bold" }}>
              {formatCurrency(
                book.price - (book.price * book.precentDiscount) / 100
              )}
            </Typography>

            {book.precentDiscount > 0 && (
              <Box
                sx={{
                  backgroundColor: "red",
                  color: "white",
                  marginLeft: "10px",
                  padding: "2px 6px",
                  borderRadius: "4px",
                  fontWeight: 500,
                }}
              >
                -{book.precentDiscount}%
              </Box>
            )}
          </Box>

          {book.precentDiscount > 0 && (
            <Typography
              variant="body2"
              sx={{
                textDecoration: "line-through",
                color: "gray",
                textAlign: "left",
              }}
            >
              {formatCurrency(book.price)}
            </Typography>
          )}

          {/* Chọn số lượng */}
          <Box sx={{ display: "flex", alignItems: "center", my: 2 }}>
            <Typography variant="body1" sx={{ mr: 2 }}>
              Số lượng:
            </Typography>
            <IconButton onClick={() => handleQuantityChange("decrease")}>
              <RemoveIcon />
            </IconButton>
            <TextField
              value={quantity}
              size="small"
              sx={{ width: 40, textAlign: "center" }}
              inputProps={{ style: { textAlign: "center" } }}
            />
            <IconButton onClick={() => handleQuantityChange("increase")}>
              <AddIcon />
            </IconButton>
          </Box>

          {/* Nút hành động */}
          <Box sx={{ display: "flex", gap: 2 }}>
            <Button
              variant="contained"
              sx={{ flex: 1 }}
              onClick={handleAddToCart}
            >
              Thêm vào giỏ hàng
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default BookDetail;
