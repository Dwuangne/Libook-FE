import React, { useState, useEffect } from "react";
import { AllBooksApi } from "../../api/BookApi";
import { GetAuthorApi } from "../../api/AuthorApi";
import { GetSupplierApi } from "../../api/Supplier";
import { GetCategoryApi } from "../../api/CategoryApi";
import { useNavigate, useLocation } from "react-router-dom";

import {
  Box,
  TextField,
  Button,
  Card,
  CardContent,
  CardMedia,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  RadioGroup,
  FormControlLabel,
  Radio,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import Grid from "@mui/material/Grid2";

const BookList = () => {
  const navigate = useNavigate();
  window.document.title = "Books";
  const location = useLocation(); // Lấy pathname hiện tại
  const isAdmin = location.pathname.includes("admin"); // Kiểm tra nếu là admin
  const [loading, setLoading] = useState(false);

  //Get info book
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
        AllBooksApi({
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
      console.log(authorData);
      console.log(supplierData);
      console.log(categoryData);
      console.log(bookData);

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
        // Sắp xếp theo tên
        return isDescending
          ? b.name.localeCompare(a.name) // Z-A
          : a.name.localeCompare(b.name); // A-Z
      } else if (orDerByFilter === "price") {
        // Sắp xếp theo giá
        return isDescending
          ? b.price - a.price // Giảm dần
          : a.price - b.price; // Tăng dần
      }
      return 0; // Không sắp xếp
    });
  };

  const handleClearFilters = () => {
    setNameFilter(null);
    setAuthorIdFilter(null);
    setCategoryIdFilter(null);
    setSupplierIdFilter(null);
  };

  return (
    <Box sx={{ padding: 3 }}>
      {/* Thanh Filter */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          flexWrap: "wrap",
          mb: 3,
        }}
      >
        {/* Tìm kiếm theo từ khóa */}
        <TextField
          label="Search by name"
          variant="outlined"
          value={nameFilter}
          onChange={(e) => setNameFilter(e.target.value)}
          sx={{ minWidth: "200px", mb: 2 }}
        />

        {/* Lọc theo tác giả */}
        <FormControl sx={{ minWidth: "150px", mb: 2 }}>
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

        {/* Lọc theo phân loại */}
        <FormControl sx={{ minWidth: "150px", mb: 2 }}>
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

        {/* Lọc theo nhà cung cấp */}
        <FormControl sx={{ minWidth: "150px", mb: 2 }}>
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

        {/* Sắp xếp theo */}
        <RadioGroup
          row
          value={orDerByFilter}
          onChange={(e) => setOrDerByFilter(e.target.value)}
          sx={{ mb: 2 }}
        >
          <FormControlLabel
            value="name"
            control={<Radio />}
            label="Sort by name"
          />
          <FormControlLabel
            value="price"
            control={<Radio />}
            label="Sort by price"
          />
        </RadioGroup>

        {/* Thứ tự sắp xếp */}
        <ToggleButtonGroup
          value={isDescending}
          exclusive
          onChange={(e, value) => setIsDescending(value)}
          aria-label="Sort order"
          sx={{ mb: 2 }}
        >
          <ToggleButton value={false} aria-label="ascending">
            Ascending
          </ToggleButton>
          <ToggleButton value={true} aria-label="descending">
            Descending
          </ToggleButton>
        </ToggleButtonGroup>

        {/* Nút xóa bộ lọc */}
        <Button
          variant="contained"
          color="secondary"
          onClick={() => {
            setNameFilter("");
            setAuthorIdFilter("");
            setCategoryIdFilter("");
            setSupplierIdFilter("");
            setOrDerByFilter("name");
            setIsDescending(false);
          }}
          sx={{ mb: 2 }}
        >
          Clear
        </Button>
      </Box>

      {/* Danh sách sách */}
      <Grid container spacing={3}>
        {loading ? (
          <CircularProgress sx={{ color: "#003ce9" }} />
        ) : Books.length > 0 ? (
          Books.map((book, index) => (
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
                    image={book.imageUrl}
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

                  {isAdmin ? (
                    <>
                      <Typography variant="body2" sx={{ textAlign: "center" }}>
                        Author: {authorMap[book.authorId] || "Unknown"}
                      </Typography>
                      <Typography variant="body2" sx={{ textAlign: "center" }}>
                        Supplier: {supplierMap[book.supplierId] || "Unknown"}
                      </Typography>
                      <Typography variant="body2" sx={{ textAlign: "center" }}>
                        Remain: {book.remain}
                      </Typography>
                    </>
                  ) : (
                    <Typography variant="body2">
                      Discount: {book.precentDiscount}%
                    </Typography>
                  )}
                </CardContent>
              </Card>
            </Grid>
          ))
        ) : (
          <Typography variant="h6">No books available.</Typography>
        )}
      </Grid>
    </Box>
  );
};

export default BookList;
