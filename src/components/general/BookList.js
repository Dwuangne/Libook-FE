import React, { useState, useEffect } from "react";
import { AllBooksApi } from "../../api/BookApi";
import { GetAuthorApi } from "../../api/AuthorApi";
import { GetSupplierApi } from "../../api/Supplier";
import { GetCategoryApi } from "../../api/CategoryApi";

import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { ca } from "date-fns/locale";

import {
  Box,
  TextField,
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  CircularProgress,
  Container,
  Divider,
  Fade,
  FormControlLabel,
  IconButton,
  Pagination,
  Radio,
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  RadioGroup,
} from "@mui/material";
import {
  ClearAll,
  KeyboardCapslock,
  Star,
  StarHalf,
  StarOutline,
} from "@mui/icons-material";

import Grid from "@mui/material/Grid2";

const BookList = () => {
  const navigate = useNavigate();
  window.document.title = "Books";
  //console.log(AllBooksApi);
  const [uploading, setUploading] = useState(false); // State for uploading process
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
  const [pageSize, setPageSize] = useState(12);

  const [visible, setVisible] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

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
          Clear Filters
        </Button>
      </Box>

      {/* Danh sách sách */}
      <Grid container spacing={3}>
        {loading ? (
          <CircularProgress sx={{ color: "#003ce9" }} />
        ) : Books.length > 0 ? (
          Books.map((book, index) => (
            <Grid item xs={12} md={6} lg={4} key={index}>
              <Card
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  height: "370px",
                  width: "250px",
                }}
              >
                <CardMedia
                  component="img"
                  image={book.imageUrl}
                  alt={book.name}
                  sx={{
                    height: "100%", // Chiều cao 100% để giữ nguyên kích thước
                    width: "100%",
                    objectFit: "contain", // Giữ tỉ lệ khung hình mà không bị cắt
                    maxHeight: "200px", // Chiều cao tối đa để hình ảnh không quá lớn
                    backgroundColor: "#f0f0f0", // Màu nền nếu ảnh nhỏ hơn kích thước
                  }}
                />
                <CardContent
                  sx={{
                    flexGrow: 1,
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <Typography
                    variant="h6"
                    sx={{
                      textAlign: "center",
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

                  <Typography variant="body2" sx={{ textAlign: "center" }}>
                    Author: {authorMap[book.authorId] || "Unknown"}
                  </Typography>
                  <Typography variant="body2" sx={{ textAlign: "center" }}>
                    Supplier: {supplierMap[book.supplierId] || "Unknown"}
                  </Typography>
                  <Typography variant="body2" sx={{ textAlign: "center" }}>
                    Remain: {book.remain}
                  </Typography>
                  <Typography variant="body2" sx={{ textAlign: "center" }}>
                    Price: {formatCurrency(book.price)}
                  </Typography>
                  <Typography variant="body2" sx={{ textAlign: "center" }}>
                    Discount: {book.precentDiscount}% off
                  </Typography>
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
