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

import { Add as AddIcon } from '@mui/icons-material';

export default function BookManagement() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const [books, setBooks] = useState([]);
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
    const [pageSize, setPageSize] = useState(12);
    const [totalPages, setTotalPages] = useState(1);

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
                    pageIndex: pageIndex,
                    pageSize: pageSize,
                }),
            ]);

            const authorData = authorRes?.data?.data || [];
            const supplierData = supplierRes?.data?.data || [];
            const categoryData = categoryRes?.data?.data || [];
            const bookData = bookRes?.data?.data.bookResponseDTOs || [];
            const totalPages = bookRes?.data?.data.totalPage || 1;

            setAuthors(authorData);
            setSuppliers(supplierData);
            setCategories(categoryData);
            setBooks(bookData);
            setTotalPages(totalPages);

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
        fetchData().then(() => {
            setLoading(false);
        });
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

    const handlePageChange = (e, page) => {
        setPageIndex(page);
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
            sx={{
                flexGrow: 1,
                transition: 'margin-left 0.3s',
                minHeight: "100vh",
                backgroundColor: "#FFFFFF", // Subtle background color
            }}
        >
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '10px 30px',
                    boxShadow: '0 5px 10px rgba(0, 0, 0, 0.05)', // Subtle shadow for depth
                }}
            >
                <Typography
                    sx={{
                        fontSize: 20,
                        fontWeight: '600',
                        color: "#3F51B5", // Matching color with primary theme
                    }}
                >
                    Book List
                </Typography>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    sx={{
                        backgroundColor: "#3F51B5", // Consistent primary color
                        color: "white",
                        borderRadius: "20px",
                        fontSize: 12,
                        fontWeight: "bold",
                        padding: "4px 10px", // Adjust padding to fit the text better
                        whiteSpace: "nowrap", // Prevent text from wrapping
                        width: "80px", // Adjust width to ensure "Add New Book" fits
                        transition: "all 0.4s ease-in-out",
                        border: "2px solid #3F51B5",
                        "&:hover": {
                            backgroundColor: "white",
                            color: "#3F51B5",
                            border: "2px solid #3F51B5",
                        }
                    }}
                    onClick={() => navigate("/admin/bookdetails")} // Di chuyển onClick ra ngoài sx
                >
                    Add
                </Button>

            </Box>

            {/* Book Grid */}
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
                        <FormControl variant="outlined" sx={{ minWidth: "100px", mb: 2 }}>
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
                            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%" }}>
                                <CircularProgress size={60} thickness={4} color="primary" />
                            </Box>
                        ) : (
                            books.map((book) => (
                                <Grid item xs={6} sm={4} md={2.4} key={book.id}>
                                    <Card
                                        sx={{
                                            boxShadow: "none",
                                            flexDirection: "column",
                                            height: "300px",
                                            width: "200px",
                                            "&:hover": {
                                                boxShadow: "0px 6px 30px rgba(0, 0, 0, 0.15)",
                                                transform: "translateY(-8px)",
                                                transition: "transform 0.25s ease, box-shadow 0.25s ease",
                                            },
                                        }}
                                        onClick={() =>
                                            navigate(
                                                `/admin/bookdetails/${book.name.toLowerCase().replace(/\s/g, "-")}`,
                                                { state: { bookId: book.id } },
                                                window.scrollTo({ top: 0, behavior: "smooth" })
                                            )
                                        }
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
                                                    width: "100%",
                                                    height: "3rem",
                                                    overflow: "hidden",
                                                    textOverflow: "ellipsis",
                                                    lineHeight: "1.5rem",
                                                    whiteSpace: "normal",
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
                                                    variant="h6"
                                                    color="error"
                                                    sx={{ fontWeight: "bold" }}
                                                >
                                                    {formatCurrency(book.price - (book.price * book.precentDiscount) / 100)}
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
                            color="primary"
                            count={totalPages}
                            page={pageIndex}
                            onChange={handlePageChange}
                        />
                    </Box>
                </Box>

            </Box>
        </Box>
    );
}
