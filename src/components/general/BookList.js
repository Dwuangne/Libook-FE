import React, { useState, useEffect } from "react";
import { GetAllBooksApi } from "../../api/BookApi";
import { GetAuthorApi } from "../../api/AuthorApi";
import { GetSupplierApi } from "../../api/Supplier";
import { GetCategoryApi } from "../../api/CategoryApi";
import { useNavigate, useLocation } from "react-router-dom";
import replaceImg from "../../assets/Blue_Book.jpg";

import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Pagination,
  Divider,
} from "@mui/material";
import Grid from "@mui/material/Grid2";

const BookList = () => {
  const navigate = useNavigate();
  window.document.title = "Books";
  const [loading, setLoading] = useState(false);

  // Get info book
  const [Books, setBooks] = useState([]);
  const [authors, setAuthors] = useState([]);
  const [categories, setCategories] = useState([]);
  const [suppliers, setSuppliers] = useState([]);

  const [categoryMap, setCategoryMap] = useState([]);
  const [authorMap, setAuthorMap] = useState([]);
  const [supplierMap, setSupplierMap] = useState([]);

  const [nameFilter, setNameFilter] = useState("");
  const [authorIdFilter, setAuthorIdFilter] = useState("");
  const [categoryIdFilter, setCategoryIdFilter] = useState("");
  const [supplierIdFilter, setSupplierIdFilter] = useState("");
  const [orDerByFilter, setOrDerByFilter] = useState("");
  const [isDescending, setIsDescending] = useState(false);
  const [pageIndex, setPageIndex] = useState(1);

  const [visible, setVisible] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(12);

  // Đoạn này xử lý việc hiện/ẩn sidebar dựa trên cuộn trang
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY || document.documentElement.scrollTop;
      setVisible(scrollY > 70);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const fetchData = async () => {
    try {
      const [authorRes, supplierRes, categoryRes, bookRes] = await Promise.all([
        GetAuthorApi(),
        GetSupplierApi(),
        GetCategoryApi(),
        GetAllBooksApi({
          filter: nameFilter,
          authorID: authorIdFilter,
          categoryID: categoryIdFilter,
          supplierID: supplierIdFilter,
          orDerBy: orDerByFilter,
          isDescending: isDescending,
          pageIndex: pageIndex - 1,
          pageSize: pageSize,
        }),
      ]);

      const authorData = authorRes?.data?.data || [];
      const supplierData = supplierRes?.data?.data || [];
      const categoryData = categoryRes?.data?.data || [];
      const bookData = bookRes?.data?.data || [];

      setAuthors(authorData);
      setSuppliers(supplierData);
      setCategories(categoryData);
      setBooks(bookData);
      // console.log(authorData);
      // console.log(supplierData);
      // console.log(categoryData);
      // console.log(bookData);

      const authorMap = authorData.reduce((x, item) => {
        x[item.id] = item.name;
        return x;
      }, {});
      setAuthorMap(authorMap);

      const categoryMap = categoryData.reduce((x, item) => {
        x[item.id] = item.name;
        return x;
      }, {});
      setCategoryMap(categoryMap);

      const supplierMap = supplierData.reduce((x, item) => {
        x[item.id] = item.name;
        return x;
      }, {});
      setSupplierMap(supplierMap);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 2000);
    fetchData();
  }, [
    nameFilter,
    authorIdFilter,
    categoryIdFilter,
    supplierIdFilter,
    orDerByFilter,
    isDescending,
    pageIndex,
    pageSize,
  ]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN").format(amount) + " VND";
  };

  const handleNameKeyChange = (id) => {
    setNameFilter((prev) => (prev === id ? null : id));
    setCurrentPage(1);
  };

  const handleSortChange = (e, isDescending) => {
    if (isDescending !== null) {
      setIsDescending(isDescending);
    }
  };

  const handleAuthorChange = (id) => {
    setAuthorIdFilter((prev) => (prev === id ? null : id));
    setCurrentPage(1);
  };

  const handleCategoryChange = (id) => {
    setCategoryIdFilter((prev) => (prev === id ? null : id));
    setCurrentPage(1);
  };

  const handleSupplierChange = (id) => {
    setSupplierIdFilter((prev) => (prev === id ? null : id));
    setCurrentPage(1);
  };

  const handlePageChange = (e, page) => {
    setCurrentPage(page);
  };

  const sortBooks = (books) => {
    return books.sort((a, b) => {
      if (orDerByFilter === "name") {
        return isDescending
          ? b.name.localeCompare(a.name) // Z-A
          : a.name.localeCompare(b.name); // A-Z
      } else if (orDerByFilter === "price") {
        return isDescending
          ? b.price - a.price // Giảm dần
          : a.price - b.price; // Tăng dần
      }
      return 0;
    });
  };

  const handleClearFilters = () => {
    setNameFilter(null);
    setAuthorIdFilter(null);
    setCategoryIdFilter(null);
    setSupplierIdFilter(null);
  };

  return (
    <Box
      sx={{ display: "flex", backgroundColor: "#fafafa", marginTop: "62px" }}
    >
      {/* Sidebar Filter */}
      <Box
        sx={{
          width: "20%",
          position: "relative",
          height: "100%",
          borderRight: "1px solid #ddd",
          padding: 2,
        }}
      >
        <Typography variant="h6" padding={2}>
          Filter Options
        </Typography>

        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel>Author</InputLabel>
          <Select
            value={authorIdFilter}
            onChange={(e) => setAuthorIdFilter(e.target.value)}
            label="Author"
          >
            <MenuItem value="">All Authors</MenuItem>
            {authors.map((author) => (
              <MenuItem key={author.id} value={author.id}>
                {author.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel>Category</InputLabel>
          <Select
            value={categoryIdFilter}
            onChange={(e) => setCategoryIdFilter(e.target.value)}
            label="Category"
          >
            <MenuItem value="">All Categories</MenuItem>
            {categories.map((category) => (
              <MenuItem key={category.id} value={category.id}>
                {category.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel>Supplier</InputLabel>
          <Select
            value={supplierIdFilter}
            onChange={(e) => setSupplierIdFilter(e.target.value)}
            label="Supplier"
          >
            <MenuItem value="">All Suppliers</MenuItem>
            {suppliers.map((supplier) => (
              <MenuItem key={supplier.id} value={supplier.id}>
                {supplier.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Button
          variant="contained"
          backgroundColor="#003ce9"
          fullWidth
          onClick={handleClearFilters}
        >
          Clear
        </Button>
      </Box>

      {/* Book List */}
      <Box sx={{ width: "80%", padding: 3, height: "100%" }}>
        {/* Dropdown Menu (Sorting Options) */}
        <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 3 }}>
          <FormControl sx={{ width: "80px", mb: 2 }}>
            <InputLabel>Sort By</InputLabel>
            <Select
              size="small"
              value={`${orDerByFilter}-${isDescending}`}
              onChange={(e) => {
                const [orderBy, desc] = e.target.value.split("-");
                setOrDerByFilter(orderBy);
                setIsDescending(desc === "true");
              }}
              label="Sort By"
            >
              <MenuItem value="name-false">A-Z</MenuItem>
              <MenuItem value="name-true">Z-A</MenuItem>
              <MenuItem value="price-false">Price Low to High</MenuItem>
              <MenuItem value="price-true">Price High to Low</MenuItem>
            </Select>
          </FormControl>
        </Box>

        {/* Book Grid */}
        <Grid container spacing={2}>
          {loading ? (
            <CircularProgress />
          ) : (
            Books.map((book) => (
              <Grid item xs={6} sm={4} md={2.4} key={book.id}>
                <Card
                  sx={{
                    boxShadow: "none",
                    flexDirection: "column",
                    height: "300px",
                    width: "200px",
                    "&:hover": {
                      boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.2)", // Hiệu ứng đổ bóng khi hover
                      transform: "translateY(-5px)", // Tăng thêm hiệu ứng di chuyển nhẹ lên trên
                      transition: "all 0.3s ease", // Thời gian chuyển đổi khi hover
                    },
                  }}
                >
                  <Box
                    sx={{
                      position: "relative",
                      height: "180px",
                      display: "flex",
                      justifyContent: "center",
                    }}
                  >
                    <CardMedia
                      component="img"
                      image={book.imageUrl ? book.imageUrl : replaceImg}
                      alt={book.name}
                      sx={{
                        maxHeight: "100%",
                        maxWidth: "100%",
                        objectFit: "contain",
                      }}
                    />
                  </Box>
                  <CardContent
                    sx={{
                      paddingLeft: 1.5,
                      paddingRight: 1,
                      flexGrow: 1,
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    <Typography
                      variant="h7"
                      sx={{
                        // fontWeight: 500,
                        textAlign: "left",
                        width: "100%",
                        height: "3rem", // Thiết lập chiều cao cố định cho tiêu đề
                        overflow: "hidden", // Đảm bảo nội dung không bị vỡ
                        textOverflow: "ellipsis",
                        lineHeight: "1.5rem",
                        whiteSpace: "normal", // Bắt buộc xuống dòng khi văn bản dài
                      }}
                    >
                      {book.name}
                    </Typography>

                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "left",
                        alignItems: "center",
                        marginTop: 1,
                      }}
                    >
                      <Typography
                        variant="h7"
                        color="error"
                        sx={{ fontWeight: "bold" }}
                      >
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
                          textAlign: "left", // Căn lề trái
                        }}
                      >
                        {formatCurrency(book.price)}
                      </Typography>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            ))
          )}
        </Grid>

        {/* Pagination */}
        <Box
          sx={{
            mt: 3,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Pagination
            count={Math.ceil(Books.length / pageSize)}
            page={currentPage}
            onChange={handlePageChange}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default BookList;
