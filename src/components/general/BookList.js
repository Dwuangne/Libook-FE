import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import replaceImg from "../../assets/Blue_Book.jpg";
import { GetAllBooksApi } from "../../api/BookApi";
import { GetAuthorApi } from "../../api/AuthorApi";
import { GetSupplierApi } from "../../api/Supplier";
import { GetCategoryApi } from "../../api/CategoryApi";
import debounce from "lodash.debounce";

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
} from "@mui/material";
import Grid from "@mui/material/Grid2";

const BooksList = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [Books, setBooks] = useState([]);
  const [authors, setAuthors] = useState([]);
  const [categories, setCategories] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [authorMap, setAuthorMap] = useState([]);
  const [categoryMap, setCategoryMap] = useState([]);
  const [supplierMap, setSupplierMap] = useState([]);
  const [nameFilter, setNameFilter] = useState("");
  const [authorIdFilter, setAuthorIdFilter] = useState("");
  const [categoryIdFilter, setCategoryIdFilter] = useState("");
  const [supplierIdFilter, setSupplierIdFilter] = useState("");
  const [orDerByFilter, setOrDerByFilter] = useState("");
  const [isDescending, setIsDescending] = useState(false);
  const [pageIndex, setPageIndex] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [pageSize, setPageSize] = useState(12);

  // Set document title
  useEffect(() => {
    window.document.title = "Books";
  }, []);

  // Handle URL search parameter changes
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const keyword = searchParams.get("keyword") || "";
    setNameFilter(keyword);
  }, [location.search]);

  // Handle scroll to toggle sidebar visibility
  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 70);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Fetch data function with debounce
  const fetchData = useCallback(
    debounce(async () => {
      try {
        setLoading(true);
        const [authorRes, supplierRes, categoryRes, bookRes] =
          await Promise.all([
            GetAuthorApi(),
            GetSupplierApi(),
            GetCategoryApi(),
            GetAllBooksApi({
              filter: nameFilter,
              authorID: authorIdFilter,
              categoryID: categoryIdFilter,
              supplierID: supplierIdFilter,
              orDerBy: orDerByFilter,
              isDescending,
              pageIndex,
              pageSize,
            }),
          ]);

        setAuthors(authorRes?.data?.data || []);
        setSuppliers(supplierRes?.data?.data || []);
        setCategories(categoryRes?.data?.data || []);
        setBooks(bookRes?.data?.data?.bookResponseDTOs || []);
        setTotalPage(bookRes?.data?.data?.totalPage || 1);

        setAuthorMap(
          authorRes.data.data.reduce(
            (acc, item) => ({ ...acc, [item.id]: item.name }),
            {}
          )
        );
        setCategoryMap(
          categoryRes.data.data.reduce(
            (acc, item) => ({ ...acc, [item.id]: item.name }),
            {}
          )
        );
        setSupplierMap(
          supplierRes.data.data.reduce(
            (acc, item) => ({ ...acc, [item.id]: item.name }),
            {}
          )
        );
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }, 500),
    [
      nameFilter,
      authorIdFilter,
      categoryIdFilter,
      supplierIdFilter,
      orDerByFilter,
      isDescending,
      pageIndex,
      pageSize,
    ]
  );

  // Trigger data fetch
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Format currency
  const formatCurrency = (amount) =>
    new Intl.NumberFormat("vi-VN").format(amount) + " VND";

  // Handle filter and sort changes
  const handleFilterChange = (setter) => (event) => {
    setter(event.target.value);
    setPageIndex(1);
  };

  const handleSortChange = (e) => {
    const [orderBy, desc] = e.target.value.split("-");
    setOrDerByFilter(orderBy);
    setIsDescending(desc === "true");
  };

  const handlePageChange = (e, page) => setPageIndex(page);

  const handleClearFilters = () => {
    setNameFilter("");
    setAuthorIdFilter("");
    setCategoryIdFilter("");
    setSupplierIdFilter("");
  };

  return (
    <Box
      sx={{
        display: "flex",
        backgroundColor: "#f0f0f0",
        marginTop: "62px",
        padding: "0 100px 50px 100px",
      }}
    >
      {/* Sidebar Filter */}
      <Box
        sx={{
          width: "20%",
          //borderRight: "1px solid #ddd",
          padding: 2,
          backgroundColor: "white",
        }}
      >
        <Typography variant="h6" padding={2}>
          Filter Options
        </Typography>
        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel>Author</InputLabel>
          <Select
            value={authorIdFilter}
            onChange={handleFilterChange(setAuthorIdFilter)}
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
            onChange={handleFilterChange(setCategoryIdFilter)}
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
            onChange={handleFilterChange(setSupplierIdFilter)}
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
        <Button variant="contained" fullWidth onClick={handleClearFilters}>
          Clear
        </Button>
      </Box>

      {/* Book List */}
      <Box
        sx={{
          width: "80%",
          padding: 3,
          backgroundColor: "#fff",
          marginLeft: 3,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          height: "100%", // Đảm bảo chiếm toàn bộ chiều cao
        }}
      >
        {/* Sorting Options */}
        <Box
          sx={{ display: "flex", justifyContent: "flex-start", mb: 3, pt: 3 }}
        >
          <FormControl sx={{ size: "small", width: "180px", mb: 2 }}>
            <InputLabel>Sort By</InputLabel>
            <Select
              value={`${orDerByFilter}-${isDescending}`}
              onChange={handleSortChange}
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
        <Grid container spacing={2} sx={{ flexGrow: 1 }}>
          {loading ? (
            <CircularProgress />
          ) : Books.length === 0 ? (
            <Typography variant="h6" color="error" align="center">
              Không tìm thấy sách phù hợp với bộ lọc.
            </Typography>
          ) : (
            Books.map((book) => (
              <Grid xs={12} sm={6} md={3} key={book.id}>
                <Card
                  sx={{
                    boxShadow: "none",
                    flexDirection: "column",
                    height: "300px",
                    width: "200px",
                    paddingBottom: "20px",
                    "&:hover": {
                      boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.2)",
                      transform: "translateY(-5px)",
                      transition: "all 0.3s ease",
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
                        textAlign: "left",
                        height: "3rem",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        lineHeight: "1.5rem",
                      }}
                    >
                      {book.name}
                    </Typography>
                    <Box
                      sx={{
                        display: "flex",
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
                          color: "gray",
                          textDecoration: "line-through",
                          fontWeight: "light",
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
        <Pagination
          count={totalPage}
          page={pageIndex}
          onChange={handlePageChange}
          size="large"
          sx={{
            marginTop: "35px",
            display: "flex",
            justifyContent: "center",

            "& .MuiPaginationItem-root": {
              //backgroundColor: "f0f0f0", // Màu nền cho các item
              color: "black", // Màu chữ
              border: "1px solid grey",
            },
            "& .Mui-selected": {
              color: "#fff", // Màu chữ cho item được chọn]
              backgroundColor: "red", // Màu nền cho item được chọn
              border: "none",
            },
          }}
        />
      </Box>
    </Box>
  );
};
export default BooksList;
