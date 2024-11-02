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
    TextField,
    InputAdornment,
    IconButton,
    Dialog,
    DialogContent,
    DialogTitle,
    DialogActions,
    Autocomplete,
} from "@mui/material";
import Grid from "@mui/material/Grid2";

import { Add as AddIcon, Search as SearchIcon, FilterList as FilterListIcon } from '@mui/icons-material';

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
    const [keyWord, setKeyWord] = useState("");
    const [filter, setFilter] = useState({});
    const [filterDialogOpen, setFilterDialogOpen] = useState(false);
    const [pageSize, setPageSize] = useState(12);
    const [totalPage, setTotalPage] = useState(1);

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
            const totalPage = bookRes?.data?.data.totalPage || 1;

            setAuthors(authorData);
            setSuppliers(supplierData);
            setCategories(categoryData);
            setBooks(bookData);
            setTotalPage(totalPage);

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

    const handleSearch = () => {
        setNameFilter(keyWord);
    };

    const handleSortChange = (e) => {
        const [orderBy, desc] = e.target.value.split("-");
        setOrDerByFilter(orderBy);
        setIsDescending(desc === "true");
    };

    const applyFilters = () => {
        setAuthorIdFilter(filter.authorId);
        setCategoryIdFilter(filter.categoryId);
        setSupplierIdFilter(filter.supplierId);
        setPageIndex(1);
        setFilterDialogOpen(false); // Close the dialog after applying filters
    };

    const handleClearFilters = () => {
        setAuthorIdFilter(null);
        setCategoryIdFilter(null);
        setSupplierIdFilter(null);
        setFilter({});
    };

    const handleOpenFilterDialog = () => {
        setFilterDialogOpen(true);
    };

    const handleCloseFilterDialog = () => {
        setFilterDialogOpen(false);
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
                    boxShadow: '0 5px 10px rgba(0, 0, 0, 0.1)', // Subtle shadow for depth
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

            <Box
                sx={{
                    backgroundColor: "#ffffff",
                    padding: "0 px",
                    display: "flex",
                    marginTop: "20px",
                    justifyContent: "center",
                    flexDirection: "column",
                    alignItems: "center",
                    marginX: "auto", // Căn giữa nội dung
                }}
            >
                {/* Search and Filter Section */}
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 2,
                        width: "30%",
                        maxWidth: "500px",
                        mb: 3,
                        backgroundColor: "#fff",
                        padding: "8px",
                        borderRadius: "8px",
                        boxShadow: "0px 4px 6px rgba(0,0,0,0.1)",
                    }}
                >
                    <TextField
                        fullWidth
                        variant="outlined"
                        size="small"
                        placeholder="Search books by name"
                        value={keyWord}
                        onChange={(e) => setKeyWord(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                handleSearch();
                            }
                        }}
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                borderRadius: '8px',
                                '&.Mui-focused': {
                                    boxShadow: '0 0 0 3px rgba(0,0,0,0.1)',
                                },
                            },
                        }}
                    />
                    <IconButton onClick={handleSearch} color="primary">
                        <SearchIcon sx={{ color: '#3F51B5' }}/>
                    </IconButton>
                    <IconButton onClick={handleOpenFilterDialog} color="primary">
                        <FilterListIcon sx={{ color: '#3F51B5' }}/>
                    </IconButton>
                </Box>


                {/* Book List */}
                <Box
                    sx={{
                        width: "100%",
                        maxWidth: "1500px", // Giới hạn chiều rộng tối đa cho danh sách sách
                        backgroundColor: "#fff",
                        padding: 3,
                        borderRadius: "8px",
                        boxShadow: "2px 4px 6px rgba(0,0,0,0.2)",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                    }}
                >
                    {/* Book Grid */}
                    <Grid container spacing={2} sx={{ flexGrow: 1, justifyContent: "center" }}>
                        {loading ? (
                            <CircularProgress />
                        ) : books.length === 0 ? (
                            <Typography variant="h6" color="error" align="center">
                                Không tìm thấy sách phù hợp với bộ lọc.
                            </Typography>
                        ) : (
                            books.map((book) => (
                                <Grid xs={12} sm={6} md={3} key={book.id}>
                                    <Card
                                        sx={{
                                            boxShadow: "none",
                                            flexDirection: "column",
                                            height: "300px",
                                            width: "200px",
                                            "&:hover": {
                                                boxShadow: "0px 6px 30px rgba(0, 0, 0, 0.15)",
                                                transform: "translateY(-5px)",
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
                        }}
                    />
                </Box>
            </Box>

            {/* Filter Dialog */}
            <Dialog open={filterDialogOpen} onClose={handleCloseFilterDialog} fullWidth maxWidth="sm">
                <DialogTitle sx={{ fontWeight: 'bold', fontSize: '1.5rem', color: '#3F51B5' }}>
                    Filter
                </DialogTitle>
                <DialogContent dividers>
                    {/* Author Autocomplete */}
                    <Autocomplete
                        options={authors}
                        getOptionLabel={(option) => option.name}
                        value={authors.find((author) => author.id === filter.authorId) || null}
                        onChange={(e, newValue) =>
                            setFilter((prevFilter) => ({
                                ...prevFilter,
                                authorId: newValue ? newValue.id : '',
                            }))
                        }
                        renderInput={(params) => (
                            <TextField {...params} label="Author" variant="outlined" fullWidth />
                        )}
                        sx={{ mb: 2 }}
                    />

                    {/* Category Autocomplete */}
                    <Autocomplete
                        options={categories}
                        getOptionLabel={(option) => option.name}
                        value={categories.find((category) => category.id === filter.categoryId) || null}
                        onChange={(e, newValue) =>
                            setFilter((prevFilter) => ({
                                ...prevFilter,
                                categoryId: newValue ? newValue.id : '',
                            }))
                        }
                        renderInput={(params) => (
                            <TextField {...params} label="Category" variant="outlined" fullWidth />
                        )}
                        sx={{ mb: 2 }}
                    />

                    {/* Supplier Autocomplete */}
                    <Autocomplete
                        options={suppliers}
                        getOptionLabel={(option) => option.name}
                        value={suppliers.find((supplier) => supplier.id === filter.supplierId) || null}
                        onChange={(e, newValue) =>
                            setFilter((prevFilter) => ({
                                ...prevFilter,
                                supplierId: newValue ? newValue.id : '',
                            }))
                        }
                        renderInput={(params) => (
                            <TextField {...params} label="Supplier" variant="outlined" fullWidth />
                        )}
                        sx={{ mb: 2 }}
                    />
                </DialogContent>

                <DialogActions>
                    <Button onClick={handleClearFilters} color="secondary" variant="outlined">
                        Clear Filters
                    </Button>
                    <Button
                        onClick={() => {
                            applyFilters(); // function to trigger filtering
                            handleCloseFilterDialog();
                        }}
                        color="primary"
                        variant="contained"
                        sx={{ backgroundColor: '#3F51B5', color: '#fff', '&:hover': { backgroundColor: '#303f9f' } }}
                    >
                        Apply
                    </Button>
                </DialogActions>
            </Dialog>

        </Box>
    );
}
