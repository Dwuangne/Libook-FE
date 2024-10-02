import React, { useState, useEffect } from "react";
import {
    Grid,
    TextField,
    FormControlLabel,
    Switch,
    Typography,
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Autocomplete
} from '@mui/material';
import { toast } from "react-toastify";
import { uploadImagesToFirebase, deleteImageFromFirebase } from '../../FirebaseImage/FirebaseFunction';
import { useNavigate } from 'react-router-dom';

import { AddBookApi } from '../../api/BookApi';
import { GetAuthorApi } from '../../api/AuthorApi';
import { GetSupplierApi } from '../../api/Supplier';
import { GetCategoryApi } from '../../api/CategoryApi';

const MAX_IMAGES = 5;
const MAX_SIZE_MB = 2; // Limit the size to 2MB (for example)
const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];

export default function BookDetailsManagement() {
    const [uploading, setUploading] = useState(false); // State for uploading process
    const [loading, setLoading] = useState(false);
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [uploadedUrls, setUploadedUrls] = useState([]); // Uploaded image URLs from Firebase
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false); // State for delete confirmation popup
    const [imageToDelete, setImageToDelete] = useState(null); // Store image to be deleted
    const [errors, setErrors] = useState({});
    const navigator = useNavigate();
    const combinedImages = [...uploadedUrls, ...selectedFiles.map(fileObj => fileObj.url)];

    //Add new product
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [remain, setRemain] = useState('');
    const [percentDiscount, setPercentDiscount] = useState('');
    const [authorId, setAuthorId] = useState('');
    const [categoryId, setCategoryId] = useState('');
    const [supplierId, setSupplierId] = useState('');
    const [isActive, setIsActive] = useState(true);
    const [description, setDescription] = useState('');

    const [authors, setAuthors] = useState([]);
    const [categories, setCategories] = useState([]);
    const [suppliers, setSuppliers] = useState([]);

    const fetchData = async () => {
        try {
            const [authorRes, supplierRes, categoryRes] =
                await Promise.all([
                    GetAuthorApi(),
                    GetSupplierApi(),
                    GetCategoryApi(),
                ]);

            const authorData = authorRes?.data?.data || [];
            const supplierData = supplierRes?.data?.data || [];
            const categoryData = categoryRes?.data?.data || [];

            setAuthors(authorData);
            setSuppliers(supplierData);
            setCategories(categoryData);

            console.log("data", authorData);
            console.log(supplierData);
            console.log(categoryData);
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
    }, []);
    // Handle image file selection and auto-upload to Firebase
    const handleImageChange = async (e) => {

        const files = Array.from(e.target.files);
        for (const file of files) {
            // Check file type
            if (!allowedTypes.includes(file.type)) {
                toast.error(`Unsupported file type: ${file.type}. Only JPEG and PNG are allowed.`);
                return;
            }
            // Check file size (converting to MB)
            const fileSizeMB = file.size / (1024 * 1024);
            if (fileSizeMB > MAX_SIZE_MB) {
                toast.error(`File size exceeds ${MAX_SIZE_MB}MB: ${file.name}`);
                return;
            }
        }
        if (selectedFiles.length + uploadedUrls.length + files.length > MAX_IMAGES) {
            toast.error(`You can only upload ${MAX_IMAGES} images.`, { autoClose: 2000 });
            return;
        };
        const newSelectedFiles = files.map(file => ({
            file, // Lưu đối tượng file thực tế
            url: URL.createObjectURL(file) // Tạo URL tạm thời để hiển thị (không dùng để upload)
        }));

        setSelectedFiles((prevFiles) => [...prevFiles, ...newSelectedFiles]);
    };

    // Handle delete confirmation
    const openDeleteDialog = (imageUrl) => {
        setImageToDelete(imageUrl);
        setDeleteDialogOpen(true);
    };

    // Confirm delete image
    const handleConfirmDelete = async () => {
        if (uploadedUrls.includes(imageToDelete)) {
            // If the image is already uploaded to Firebase
            try {
                await deleteImageFromFirebase(imageToDelete);
                setUploadedUrls(uploadedUrls.filter(url => url !== imageToDelete));
                console.log('Image deleted from Firebase:', imageToDelete);
            } catch (err) {
                console.error(err.message);
            }
        } else {
            // If the image is still in selectedFiles (not yet uploaded)
            setSelectedFiles(selectedFiles.filter(fileObj => fileObj.url !== imageToDelete));
            console.log('Image deleted from selected files:', imageToDelete);
        }

        setDeleteDialogOpen(false);
        setImageToDelete(null);
    };

    const handleUploadImage = async (selectedFiles) => {
        try {
            setUploading(true);
            const fileUpload = selectedFiles.map(fileObj => fileObj.file);
            const urls = await uploadImagesToFirebase(fileUpload);
            setUploadedUrls(prevUrls => [...prevUrls, ...urls]);
            setSelectedFiles([]);
            return urls;
        } catch (err) {
            console.error(err.message);
            return [];
        } finally {
            setUploading(false);
        }
    }

    const validateForm = () => {
        let valid = true;
        let errors = {};

        if (!name || name.length < 3) {
            errors.name = "Name has to be a minimum of 3 characters";
            valid = false;
        }

        if (!description) {
            errors.description = "Description is required";
            valid = false;
        }

        if (!price || price <= 0) {
            errors.price = "Price must be greater than 0";
            valid = false;
        }

        if (!percentDiscount || percentDiscount < 0 || percentDiscount > 100) {
            errors.percentDiscount = "Percent discount must be between 0 and 100";
            valid = false;
        }

        if (!remain || remain <= 0) {
            errors.remain = "Remain must be greater than 0";
            valid = false;
        }

        if (!authorId) {
            errors.authorId = "Author is required";
            valid = false;
        }

        if (!categoryId) {
            errors.categoryId = "Category is required";
            valid = false;
        }

        if (!supplierId) {
            errors.supplierId = "Supplier is required";
            valid = false;
        }

        if (!description) {
            errors.description = "Description is required";
            valid = false;
        }

        setErrors(errors); // Save the errors to state
        return valid;
    };


    //Add book
    const handleAddBook = async () => {
        if (!validateForm()) {
            return; // If form is invalid, don't proceed
        }
        // Gửi bookData đến API
        try {
            const uploadedUrlsFromImages = await handleUploadImage(selectedFiles);
            const bookImages = uploadedUrlsFromImages.map(url => ({ bookImageUrl: url }));

            await AddBookApi(name, description, price, percentDiscount, remain, isActive, authorId, categoryId, supplierId, bookImages);
            toast.success("Book added successfully.", { autoClose: 1500 });

        } catch (error) {

            toast.error('Error adding book:', error);
        }finally{
            navigator("/admin/books");
        }
    };
    return (
        <Box sx={{ flexGrow: 1, minHeight: "100vh", backgroundColor: "#FFFFFF" }}>
            {/* Header Section */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2, boxShadow: '0 5px 10px rgba(0, 0, 0, 0.05)' }}>
                <Typography sx={{ fontSize: 20, fontWeight: 600, color: "#3F51B5" }}>Add Book</Typography>
            </Box>

            {/* Form Section */}
            <Box sx={{ p: 3, borderRadius: '8px' }}>
                <Grid container spacing={3}>
                    {/* Name */}
                    <Grid item xs={12} md={2}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 500, textAlign: 'left' }}>
                            Name
                        </Typography>
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <TextField
                            fullWidth
                            variant="outlined"
                            size="small"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            error={!!errors.name} // Shows error state
                            helperText={errors.name} // Displays error message
                        />
                    </Grid>
                    {/* Price */}
                    <Grid item xs={12} md={2}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 500, textAlign: 'left' }}>
                            Price
                        </Typography>
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <TextField
                            fullWidth
                            variant="outlined"
                            size="small"
                            type="number"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            error={!!errors.price}
                            helperText={errors.price}
                        />
                    </Grid>

                    {/* Remain */}
                    <Grid item xs={12} md={2}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 500, textAlign: 'left' }}>
                            Remain
                        </Typography>
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <TextField
                            fullWidth
                            variant="outlined"
                            size="small"
                            type="number"
                            value={remain}
                            onChange={(e) => setRemain(e.target.value)}
                            error={!!errors.remain} // Shows error state
                            helperText={errors.remain} // Displays error message
                        />
                    </Grid>

                    {/* Percent Discount */}
                    <Grid item xs={12} md={2}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 500, textAlign: 'left' }}>
                            Discount (%)
                        </Typography>
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <TextField
                            fullWidth
                            variant="outlined"
                            size="small"
                            type="number"
                            value={percentDiscount}
                            onChange={(e) => setPercentDiscount(e.target.value)}
                            error={!!errors.percentDiscount} // Shows error state
                            helperText={errors.percentDiscount} // Displays error message
                        />
                    </Grid>

                    <Grid item xs={12} md={2}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 500, textAlign: 'left' }}>Author</Typography>
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <Autocomplete
                            options={authors}
                            getOptionLabel={(option) => option?.name || ""}
                            // value={option.name}
                            onChange={(e, newValue) => setAuthorId(newValue.id)}
                            renderInput={(params) => <TextField {...params} label="Author" variant="outlined" size="small"
                                error={!!errors.authorId} // Shows error state
                                helperText={errors.authorId} // Displays error message
                            />}
                        />
                    </Grid>

                    <Grid item xs={12} md={2}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 500, textAlign: 'left' }}>Category</Typography>
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <Autocomplete
                            options={categories || []}
                            getOptionLabel={(option) => option?.name || ""}
                            // value={option.name}
                            onChange={(e, newValue) => setCategoryId(newValue.id)}
                            renderInput={(params) => <TextField {...params} label="Category" variant="outlined" size="small"
                                error={!!errors.categoryId} // Shows error state
                                helperText={errors.categoryId} // Displays error message
                            />}
                        />
                    </Grid>

                    <Grid item xs={12} md={2}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 500, textAlign: 'left' }}>Supplier</Typography>
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <Autocomplete
                            options={suppliers || []}
                            getOptionLabel={(option) => option?.name || ""}
                            // value={option.name}
                            onChange={(e, newValue) => setSupplierId(newValue.id)}
                            renderInput={(params) => <TextField {...params} label="Supplier" variant="outlined" size="small"
                                error={!!errors.supplierId} // Shows error state
                                helperText={errors.supplierId} // Displays error message
                            />}
                        />
                    </Grid>

                    {/* Is Active */}
                    <Grid item xs={12} md={2}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 500, textAlign: 'left' }}>
                            Active
                        </Typography>
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={isActive}
                                    onChange={(e) => setIsActive(e.target.checked)}
                                    sx={{
                                        "& .MuiSwitch-switchBase.Mui-checked": {
                                            color: "#3F51B5",
                                        },
                                        "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                                            backgroundColor: "#3F51B5",
                                        },
                                    }}
                                />
                            }
                        />
                    </Grid>


                    {/* Image Upload */}
                    <Grid item xs={12} md={2}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 500, textAlign: 'left' }}>
                            Upload Images (Max 5)
                        </Typography>
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <Button
                            variant="contained"
                            component="label"
                            sx={{ width: '100%', mb: 2, backgroundColor: '#3F51B5', color: 'white' }}
                            disabled={uploading || uploadedUrls.length >= MAX_IMAGES}
                        >
                            {uploading ? 'Uploading...' : 'Select Images'}
                            <input
                                type="file"
                                accept="image/*"
                                multiple
                                hidden
                                onChange={handleImageChange}
                            />
                        </Button>
                        <Grid container spacing={2}>
                            {combinedImages.map((url, index) => (
                                <Grid item key={index} xs={6} sm={4}>
                                    <Box
                                        sx={{
                                            position: 'relative',
                                            height: 100,
                                            width: 100,
                                            borderRadius: '8px',
                                            overflow: 'hidden',
                                            border: '1px solid #ddd',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            mb: 1,
                                        }}
                                    >
                                        <img
                                            src={url}
                                            alt={`Uploaded ${index}`}
                                            style={{ height: '100%', width: '100%', objectFit: 'cover' }}
                                        />
                                        <Button
                                            onClick={() => openDeleteDialog(url)}
                                            sx={{
                                                position: 'absolute',
                                                top: 0,
                                                right: 0,
                                                color: 'white',
                                                backgroundColor: 'red',
                                                borderRadius: '20%',
                                                padding: '3px',
                                                minWidth: 'unset',
                                            }}
                                        >
                                            &times;
                                        </Button>
                                    </Box>
                                </Grid>
                            ))}
                        </Grid>
                    </Grid>

                    {/* Description */}
                    <Grid item xs={12} md={2}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 500, textAlign: 'left' }}>
                            Description
                        </Typography>
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <TextField
                            fullWidth
                            variant="outlined"
                            size="small"
                            multiline
                            rows={4}
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            error={!!errors.description} // Shows error state
                            helperText={errors.description} // Displays error message
                        />
                    </Grid>
                </Grid>
                {/* Add Book Button */}
                <Grid item xs={12} md={4} sx={{ mt: 2, display: "flex", justifyContent: "center" }}>
                    <Button
                        variant="contained"
                        sx={{
                            backgroundColor: "#3F51B5",
                            color: "white",
                            borderRadius: "20px",
                            fontSize: 15,
                            fontWeight: "bold",
                            padding: "4px 10px",
                            whiteSpace: "nowrap",
                            width: "150px",
                            transition: "all 0.4s ease-in-out",
                            border: "2px solid #3F51B5",
                            "&:hover": {
                                backgroundColor: "white",
                                color: "#3F51B5",
                                border: "2px solid #3F51B5",
                            }
                        }}
                        onClick={handleAddBook}
                    >
                        Save
                    </Button>
                </Grid>


            </Box>

            {/* Delete Confirmation Dialog */}
            <Dialog
                open={deleteDialogOpen}
                onClose={() => setDeleteDialogOpen(false)}
            >
                <DialogTitle>Confirm Delete</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to delete this image?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
                    <Button onClick={handleConfirmDelete} color="primary">Delete</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
