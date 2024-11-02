import React, { useState, useEffect } from "react";
import {
    Container,
    Typography,
    Button,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    IconButton,
    Box,
    CircularProgress,
    TablePagination,
    InputAdornment,
} from '@mui/material';
import { toast } from "react-toastify";
import { Add as AddIcon, Edit as EditIcon, Close as CloseIcon, Search as SearchIcon } from '@mui/icons-material';

import { GetAllVouchersApi, UpdateRemainVoucherApi, AddVoucherApi } from "../../api/VoucherApi";


export default function VoucherManagement() {
    const [loading, setLoading] = useState(false);
    const [vouchers, setVouchers] = useState([]);
    const [open, setOpen] = useState(false);
    const [editingVoucher, setEditingVoucher] = useState(null);
    const [addingVoucher, setAddingVoucher] = useState(null);
    const [errors, setErrors] = useState({});
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [searchKeyword, setSearchKeyword] = useState("");

    const filteredVoucher = vouchers.filter((item) =>
        item.title.toLowerCase().includes(searchKeyword.toLowerCase())
    );

    const indexOfLastItem = (page + 1) * rowsPerPage;
    const indexOfFirstItem = indexOfLastItem - rowsPerPage;
    const currentItems = filteredVoucher.slice(indexOfFirstItem, indexOfLastItem);

    const fetchData = async () => {
        try {
            const voucherRes = await GetAllVouchersApi();
            const voucherData = voucherRes?.data?.data || [];
            setVouchers(voucherData);
            console.log(voucherData);
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
    ]);

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat("vi-VN").format(amount) + " VND";
    };

    const handleAdd = () => {
        setOpen(true);
        setEditingVoucher(null);
    };

    const handleClose = () => {
        setOpen(false);
        setAddingVoucher(null);
        setEditingVoucher(null);
    };

    const handleEdit = (voucher) => {
        console.log("Editing voucher:", voucher);
        setEditingVoucher(voucher);
        setOpen(true);
    };

    const handleSaveBook = async () => {
        console.log("Saving book:", editingVoucher);
        try {
            setLoading(true);
            if (editingVoucher) {
                if (validateForm(editingVoucher)) {
                    console.log(editingVoucher);
                    await UpdateRemainVoucherApi(editingVoucher.voucherId, editingVoucher.remain);
                    handleClose();
                    fetchData();
                }
            } else {
                if (validateForm(addingVoucher)) {
                    console.log(addingVoucher);
                    await AddVoucherApi(addingVoucher.title, addingVoucher.startDate, addingVoucher.endDate, addingVoucher.discount, addingVoucher.remain);
                    handleClose();
                    fetchData();
                }
            }
        } catch (error) {
            toast.error('Error save book', error);
        } finally {
            setLoading(false);
        }
    };

    const validateForm = (voucher) => {
        let valid = true;
        let errors = {};

        if (!voucher || !voucher.title || voucher.title.length < 3) {
            errors.title = "Title has to be a minimum of 3 characters";
            valid = false;
        }

        if (!voucher || !voucher.discount || voucher.discount <= 0) {
            errors.discount = "Discount must be greater than 0";
            valid = false;
        }

        if (!voucher || !voucher.remain || voucher.remain <= 0) {
            errors.remain = "Remain must be greater than 0";
            valid = false;
        }

        if (!voucher || !voucher.startDate || new Date(voucher.startDate) < new Date()) {
            errors.startDate = "Start date must be after the current date.";
            valid = false;
        }

        if (!voucher || !voucher.endDate || new Date(voucher.endDate) < new Date(voucher.startDate)) {
            errors.endDate = "End date must be after the start date.";
            valid = false;
        }
        setErrors(errors); // Save the errors to state
        return valid;
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleSearchChange = (event) => {
        const value = event.target.value;
        setSearchKeyword(value);
        setPage(0); // Reset to the first page when search changes
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
                    Voucher List
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
                    onClick={handleAdd} // Di chuyển onClick ra ngoài sx
                >
                    Add
                </Button>
            </Box>
            <Container maxWidth="lg">
                {loading ? (
                    <Box display="flex" justifyContent="center" alignItems="center" height="50vh">
                        <CircularProgress />
                    </Box>
                ) : (

                    <TableContainer
                        component={Paper}
                        sx={{
                            marginTop: '20px',
                            borderRadius: '12px',
                            boxShadow: '2px 4px 6px rgba(0,0,0,0.8)',
                            padding: '16px'
                        }}
                    >
                        <Box
                            display="flex"
                            justifyContent="left"
                            alignItems="center"
                            sx={{ marginBottom: '16px' }}
                        >
                            <TextField
                                variant="outlined"
                                size="small"
                                value={searchKeyword}
                                onChange={handleSearchChange}
                                placeholder="Tìm kiếm theo mã voucher"
                                sx={{
                                    width: { xs: '100%', sm: '60%', md: '40%' },
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: '8px',
                                        '&.Mui-focused': {
                                            boxShadow: '0 0 0 3px rgba(0,0,0,0.2)',
                                        }
                                    }
                                }}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <SearchIcon
                                                color="action"
                                                sx={{ color: '#3F51B5' }}
                                            />
                                        </InputAdornment>
                                    ),
                                    endAdornment: searchKeyword && (
                                        <InputAdornment position="end">
                                            <IconButton
                                                onClick={() => setSearchKeyword("")}
                                                size="small"
                                                edge="end"
                                            >
                                                <CloseIcon color="error" />
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        </Box>
                        <Table sx={{ minWidth: 650 }}>
                            <TableHead>
                                <TableRow sx={{
                                    backgroundColor: '#3F51B5',
                                    '& .MuiTableCell-root': {
                                        color: 'white',
                                        fontWeight: 'bold'
                                    },
                                    borderRadius: '8px',
                                }}>
                                    <TableCell sx={{ fontWeight: 'bold' }}>Title</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold' }}>Discount</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold' }}>Start Date</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold' }}>End Date</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold' }}>Remain</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold' }}>Action</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {currentItems.map((voucher) => (
                                    <TableRow
                                        key={voucher.voucherId}
                                        hover
                                        sx={{
                                            '&:last-child td, &:last-child th': { border: 0 },
                                            '&:hover': {
                                                backgroundColor: '#fff1f5',
                                                transition: 'background-color 0.3s ease'
                                            }
                                        }}
                                    >
                                        <TableCell>{voucher.title}</TableCell>
                                        <TableCell>{formatCurrency(voucher.discount)}</TableCell>
                                        <TableCell>{new Date(voucher.startDate).toLocaleDateString()}</TableCell>
                                        <TableCell>{new Date(voucher.endDate).toLocaleDateString()}</TableCell>
                                        <TableCell>{voucher.remain}</TableCell>
                                        <TableCell>
                                            <IconButton onClick={() => handleEdit(voucher)} color="primary">
                                                <EditIcon />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                            <TablePagination
                                rowsPerPageOptions={[5, 10, 25]}
                                component="div"
                                count={filteredVoucher.length}
                                rowsPerPage={rowsPerPage}
                                page={page}
                                onPageChange={handleChangePage}
                                onRowsPerPageChange={handleChangeRowsPerPage}
                                sx={{
                                    '& .MuiTablePagination-toolbar': {
                                        justifyContent: 'center',
                                        backgroundColor: '#fff',
                                        borderTop: '1px solid #e0e0e0',
                                        borderRadius: '0 0 12px 12px'
                                    }
                                }}
                                labelRowsPerPage="Num row:"
                                labelDisplayedRows={({ from, to, count }) =>
                                    `${from}-${to} trên ${count}`
                                }
                            />
                        </Table>
                    </TableContainer>
                )}
            </Container>
            <Dialog
                open={open}
                onClose={handleClose}
                PaperProps={{
                    sx: {
                        borderRadius: '16px',
                        maxWidth: '500px',
                        width: '100%',
                        boxShadow: '0px 6px 18px rgba(0, 0, 0, 0.15)',
                    },
                }}
            >
                <DialogTitle
                    sx={{
                        m: 0,
                        p: 3,
                        bgcolor: '#3F51B5',
                        color: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                    }}
                >
                    <Typography sx={{ fontWeight: 'bold', fontSize: 20 }} >
                        {editingVoucher ? 'Edit Voucher' : 'Add New Voucher'}
                    </Typography>
                    <IconButton
                        aria-label="close"
                        onClick={handleClose}
                        sx={{ color: 'white' }}
                    >
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>

                <DialogContent sx={{ p: 3 }}>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="title"
                        label="Title"
                        type="text"
                        fullWidth
                        variant="outlined"
                        value={editingVoucher ? editingVoucher?.title : addingVoucher?.title || ''}
                        onChange={(e) =>
                            setAddingVoucher({ ...addingVoucher, title: e.target.value })
                        }
                        disabled={!!editingVoucher}
                        sx={{
                            mb: 2,
                            mt: 2,
                            '& .MuiOutlinedInput-root': { borderRadius: '8px' },
                        }}
                        error={!!errors.title}
                        helperText={errors.title}
                    />
                    <TextField
                        margin="dense"
                        id="discount"
                        label="Discount"
                        type="number"
                        fullWidth
                        variant="outlined"
                        value={editingVoucher ? editingVoucher?.discount : addingVoucher?.discount || ''}
                        onChange={(e) =>
                            setAddingVoucher({ ...addingVoucher, discount: e.target.value })
                        }
                        disabled={!!editingVoucher}
                        sx={{ mb: 2 }}
                        error={!!errors.discount}
                        helperText={errors.discount}
                    />
                    <TextField
                        margin="dense"
                        id="startDate"
                        label="Start Date"
                        type="date"
                        fullWidth
                        variant="outlined"
                        value={
                            editingVoucher
                                ? editingVoucher.startDate.substring(0, 10)
                                : addingVoucher?.startDate?.substring(0, 10) || ''
                        }
                        onChange={(e) =>
                            setAddingVoucher({ ...addingVoucher, startDate: e.target.value })
                        }
                        disabled={!!editingVoucher}
                        InputLabelProps={{ shrink: true }}
                        sx={{ mb: 2 }}
                        error={!!errors.startDate}
                        helperText={errors.startDate}
                    />
                    <TextField
                        margin="dense"
                        id="endDate"
                        label="End Date"
                        type="date"
                        fullWidth
                        variant="outlined"
                        value={
                            editingVoucher?.endDate
                                ? editingVoucher.endDate.substring(0, 10)
                                : addingVoucher?.endDate?.substring(0, 10) || ''
                        }
                        onChange={(e) =>
                            setAddingVoucher({ ...addingVoucher, endDate: e.target.value })
                        }
                        disabled={!!editingVoucher}
                        InputLabelProps={{ shrink: true }}
                        sx={{ mb: 2 }}
                        error={!!errors.endDate}
                        helperText={errors.endDate}
                    />
                    <TextField
                        margin="dense"
                        id="remain"
                        label="Remain"
                        type="number"
                        fullWidth
                        variant="outlined"
                        value={
                            editingVoucher ? editingVoucher?.remain : addingVoucher?.remain || ''
                        }
                        onChange={(e) =>
                            editingVoucher
                                ? setEditingVoucher({ ...editingVoucher, remain: e.target.value })
                                : setAddingVoucher({ ...addingVoucher, remain: e.target.value })
                        }
                        sx={{ mb: 2 }}
                        error={!!errors.remain}
                        helperText={errors.remain}
                    />
                </DialogContent>

                <DialogActions sx={{ p: 3, justifyContent: 'flex-end' }}>
                    <Button
                        onClick={handleClose}
                        sx={{
                            textTransform: 'none',
                            color: '#3F51B5',
                            backgroundColor: 'transparent',
                            '&:hover': { backgroundColor: '#E8EAF6' },
                        }}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSaveBook}
                        variant="contained"
                        sx={{
                            textTransform: 'none',
                            backgroundColor: '#3F51B5',
                            color: 'white',
                            boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.2)',
                            '&:hover': { backgroundColor: '#303F9F' },
                        }}
                    >
                        {editingVoucher ? 'Save Changes' : 'Add Voucher'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box >
    );
}