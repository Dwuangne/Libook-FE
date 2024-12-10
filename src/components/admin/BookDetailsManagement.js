import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Switch,
  FormControlLabel,
  Autocomplete,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Paper,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import { toast } from "react-toastify";
import {
  UploadImagesToFirebase,
  DeleteImageFromFirebase,
} from "../../FirebaseImage/FirebaseFunction";
import { useNavigate, useLocation } from "react-router-dom";

import { AddBookApi, GetBookByIdApi, UpdateBookApi } from "../../api/BookApi";
import { GetAuthorApi } from "../../api/AuthorApi";
import { GetSupplierApi } from "../../api/Supplier";
import { GetCategoryApi } from "../../api/CategoryApi";
import {
  AddBookImageApi,
  DeleteBookImageByIdApi,
} from "../../api/BookImageApi";

const MAX_IMAGES = 5;
const MAX_SIZE_MB = 2; // Limit the size to 2MB (for example)
const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];

export default function BookDetailsManagement() {

    const { state } = useLocation();
    const bookId = state?.bookId;
    const [uploading, setUploading] = useState(false); // State for uploading process
    const [loading, setLoading] = useState(false);
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [uploadedUrls, setUploadedUrls] = useState([]); // Uploaded image URLs from Firebase
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false); // State for delete confirmation popup
    const [imageToDelete, setImageToDelete] = useState(null); // Store image to be deleted
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();
    const combinedImages = [...uploadedUrls, ...selectedFiles.map(fileObj => fileObj.url)];

    //Add new product
    const [name, setName] = useState('');
    const [price, setPrice] = useState(0);
    const [remain, setRemain] = useState(0);
    const [percentDiscount, setPercentDiscount] = useState(0);
    const [authorId, setAuthorId] = useState('');
    const [categoryId, setCategoryId] = useState('');
    const [supplierId, setSupplierId] = useState('');
    // const [isActive, setIsActive] = useState(true);
    const [description, setDescription] = useState('');

    //Mapper
    const [uploadedUrlsMap, setUploadedUrlsMap] = useState([]);

    const [authors, setAuthors] = useState([]);
    const [categories, setCategories] = useState([]);
    const [suppliers, setSuppliers] = useState([]);
    const [book, setBook] = useState({});

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
            if (bookId) {
                const bookDetailRes = await GetBookByIdApi(bookId);
                const bookDetailData = bookDetailRes?.data.data || {};
                setName(bookDetailData.name);
                setPrice(bookDetailData.price);
                setRemain(bookDetailData.remain);
                setPercentDiscount(bookDetailData.precentDiscount);
                setAuthorId(bookDetailData.authorId);
                setCategoryId(bookDetailData.categoryId);
                setSupplierId(bookDetailData.supplierId);
                setDescription(bookDetailData.description);
                setUploadedUrls(bookDetailData.bookImages.map((image) => image.bookImageUrl));

                const uploadedUrlsMap = bookDetailData.bookImages.reduce((x, item) => {
                    x[item.id] = item.bookImageUrl;
                    return x;
                }, {});
                setUploadedUrlsMap(uploadedUrlsMap);

            }

        } catch (err) {
            console.log(err);
        }
    };
    useEffect(() => {
        setLoading(true);
        fetchData().then(() => {
            setLoading(false);
        });
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
            // If the image is already uploaded to Firebase and DB
            try {
                await DeleteImageFromFirebase(imageToDelete);
                await DeleteBookImageByIdApi(Object.keys(uploadedUrlsMap).find(key => uploadedUrlsMap[key] === imageToDelete));
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
            const fileUpload = selectedFiles.map(fileObj => fileObj.file);
            const urls = await UploadImagesToFirebase(fileUpload);
            setUploadedUrls(prevUrls => [...prevUrls, ...urls]);
            setSelectedFiles([]);
            return urls;
        } catch (err) {
            console.error(err.message);
            return [];
        }

    }

    setDeleteDialogOpen(false);
    setImageToDelete(null);
  };

  const handleUploadImage = async (selectedFiles) => {
    try {
      const fileUpload = selectedFiles.map((fileObj) => fileObj.file);
      const urls = await UploadImagesToFirebase(fileUpload);
      setUploadedUrls((prevUrls) => [...prevUrls, ...urls]);
      setSelectedFiles([]);
      return urls;
    } catch (err) {
      console.error(err.message);
      return [];
    }
  };

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
    if (selectedFiles.length === 0 && uploadedUrls.length === 0) {
      errors.image = "Image is required";
      valid = false;
    }

    setErrors(errors); // Save the errors to state
    return valid;
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN").format(amount) + " VND";
  };

  const handleSaveBook = () => {
    if (bookId) {
      handleUpdateBook();
    } else {
      handleAddBook();
    }
  };
  //Add book
  const handleAddBook = async () => {
    if (!validateForm()) {
      return; // If form is invalid, don't proceed
    }
    // Gửi bookData đến API
    try {
      setUploading(true);
      const uploadedUrlsFromImages = await handleUploadImage(selectedFiles);
      const bookImages = uploadedUrlsFromImages.map((url) => ({
        bookImageUrl: url,
      }));

      await AddBookApi(
        name,
        description,
        price,
        percentDiscount,
        remain,
        authorId,
        categoryId,
        supplierId,
        bookImages
      );
      toast.success("Book added successfully.", { autoClose: 1500 });
    } catch (error) {
      toast.error("Error adding book:", error);
    } finally {
      setUploading(false);
      navigate("/admin/books");
    }
  };
  const handleUpdateBook = async () => {
    if (!validateForm()) {
      return; // If form is invalid, don't proceed
    }

    try {
      setUploading(true);
      const uploadedUrlsFromImages = await handleUploadImage(selectedFiles);

      // Gọi API cho từng URL và lưu kết quả vào một mảng promise
      const saveImagePromises = uploadedUrlsFromImages.map((url) =>
        AddBookImageApi(url, bookId)
      );
      // Thực hiện tất cả các lời gọi API song song
      await Promise.all(saveImagePromises);

      await UpdateBookApi(
        bookId,
        name,
        description,
        price,
        percentDiscount,
        remain,
        authorId,
        categoryId,
        supplierId
      );
    } catch (error) {
      toast.error("Error updating book:", error);
    } finally {
      setUploading(false);
      navigate("/admin/books");
    }
  };
  return (
    <Box sx={{ flexGrow: 1, minHeight: "100vh", backgroundColor: "#FFFFFF" }}>
      {/* Header Section */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          p: 2,
          boxShadow: "0 5px 10px rgba(0, 0, 0, 0.05)",
        }}
      >
        <Typography sx={{ fontSize: 20, fontWeight: 600, color: "#3F51B5" }}>
          Add Book
        </Typography>
      </Box>

      {/* Form Section */}
      <Box sx={{ p: 3, borderRadius: "8px" }}>
        <Grid container spacing={3}>
          {/* Name */}
          <Grid item xs={12} md={2}>
            <Typography
              variant="subtitle1"
              sx={{ fontWeight: 500, textAlign: "left" }}
            >
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
            <Typography
              variant="subtitle1"
              sx={{ fontWeight: 500, textAlign: "left" }}
            >
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
            <Typography
              variant="subtitle1"
              sx={{ fontWeight: 500, textAlign: "left" }}
            >
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
            <Typography
              variant="subtitle1"
              sx={{ fontWeight: 500, textAlign: "left" }}
            >
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
            <Typography
              variant="subtitle1"
              sx={{ fontWeight: 500, textAlign: "left" }}
            >
              Author
            </Typography>
          </Grid>
          <Grid item xs={12} md={4}>
            <Autocomplete
              options={authors}
              getOptionLabel={(option) => option?.name || ""}
              value={authors.find((author) => author.id === authorId) || null}
              onChange={(e, newValue) =>
                newValue ? setAuthorId(newValue.id) : setAuthorId("")
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Author"
                  variant="outlined"
                  size="small"
                  error={!!errors.authorId} // Shows error state
                  helperText={errors.authorId} // Displays error message
                />
              )}
            />
          </Grid>

          {/* Selling price */}
          <Grid item xs={12} md={2}>
            <Typography
              variant="subtitle1"
              sx={{ fontWeight: 500, textAlign: "left" }}
            >
              Selling price:
            </Typography>
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography
              sx={{ fontWeight: 800, textAlign: "left", color: "red" }}
            >
              {formatCurrency(
                price && percentDiscount
                  ? price * (1 - percentDiscount / 100)
                  : 0
              )}
            </Typography>
          </Grid>

          <Grid item xs={12} md={2}>
            <Typography
              variant="subtitle1"
              sx={{ fontWeight: 500, textAlign: "left" }}
            >
              Category
            </Typography>
          </Grid>
          <Grid item xs={12} md={4}>
            <Autocomplete
              options={categories || []}
              getOptionLabel={(option) => option?.name || ""}
              value={
                categories.find((category) => category.id === categoryId) ||
                null
              }
              onChange={(e, newValue) =>
                newValue ? setCategoryId(newValue.id) : setCategoryId("")
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Category"
                  variant="outlined"
                  size="small"
                  error={!!errors.categoryId} // Shows error state
                  helperText={errors.categoryId} // Displays error message
                />
              )}
            />
          </Grid>

          <Grid item xs={12} md={2}>
            <Typography
              variant="subtitle1"
              sx={{ fontWeight: 500, textAlign: "left" }}
            >
              Supplier
            </Typography>
          </Grid>
          <Grid item xs={12} md={4}>
            <Autocomplete
              options={suppliers || []}
              getOptionLabel={(option) => option?.name || ""}
              value={
                suppliers.find((supplier) => supplier.id === supplierId) || null
              }
              onChange={(e, newValue) =>
                newValue ? setSupplierId(newValue.id) : setSupplierId("")
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Supplier"
                  variant="outlined"
                  size="small"
                  error={!!errors.supplierId} // Shows error state
                  helperText={errors.supplierId} // Displays error message
                />
              )}
            />
          </Grid>

          <Grid item xs={12} md={2} sx={{ textAlign: "left" }}>
            <Typography
              variant="subtitle1"
              sx={{
                fontWeight: 500,
                color: "#424242",
                textAlign: "left",
              }}
            >
              Upload Images
            </Typography>
            <Typography
              variant="caption"
              color="textSecondary"
              sx={{ textAlign: "left" }}
            >
              Max 5 images
            </Typography>
          </Grid>
          <Grid item xs={12} md={4}>
            <Button
              variant="outlined"
              component="label"
              sx={{
                width: "100%",
                mb: 2,
                borderColor: "#3F51B5",
                color: "#3F51B5",
                "&:hover": {
                  backgroundColor: "#3F51B5",
                  color: "white",
                },
              }}
              disabled={
                uploading ||
                uploadedUrls.length + selectedFiles.length >= MAX_IMAGES
              }
            >
              {uploading ? "Uploading..." : "Select Images"}
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
                  <Paper
                    elevation={2}
                    sx={{
                      position: "relative",
                      height: 100,
                      width: 100,
                      borderRadius: "8px",
                      overflow: "hidden",
                      transition: "transform 0.3s",
                      "&:hover": {
                        transform: "scale(1.05)",
                      },
                    }}
                  >
                    <img
                      src={url}
                      alt={`Uploaded ${index}`}
                      style={{
                        height: "100%",
                        width: "100%",
                        objectFit: "cover",
                      }}
                    />
                    <Button
                      onClick={() => openDeleteDialog(url)}
                      sx={{
                        position: "absolute",
                        top: 0,
                        right: 0,
                        minWidth: "24px",
                        width: "24px",
                        height: "24px",
                        p: 0,
                        backgroundColor: "rgba(255, 0, 0, 0.7)",
                        color: "white",
                        "&:hover": {
                          backgroundColor: "red",
                        },
                      }}
                    >
                      ×
                    </Button>
                  </Paper>
                </Grid>
              ))}
            </Grid>
            {errors.image && (
              <Typography variant="caption" color="error">
                {errors.image}
              </Typography>
            )}
          </Grid>

          {/* Description */}
          <Grid item xs={12} md={2}>
            <Typography
              variant="subtitle1"
              sx={{ fontWeight: 500, textAlign: "left" }}
            >
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
        {/* Save Button */}
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <Button
            variant="contained"
            sx={{
              backgroundColor: "#3F51B5",
              color: "white",
              borderRadius: "28px",
              fontSize: 16,
              fontWeight: "bold",
              padding: "10px 48px",
              textTransform: "none",
              boxShadow: "0 4px 6px rgba(63, 81, 181, 0.25)",
              transition: "all 0.3s ease-in-out",
              "&:hover": {
                backgroundColor: "#283593",
                boxShadow: "0 6px 10px rgba(63, 81, 181, 0.3)",
              },
            }}
            disabled={uploading}
            onClick={handleSaveBook}
          >
            {uploading ? "Uploading..." : "Save Book"}
          </Button>
        </Box>
      </Box>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        PaperProps={{
          sx: {
            borderRadius: "12px",
            padding: "12px",
          },
        }}
      >
        <DialogTitle sx={{ color: "#1a237e" }}>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this image?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setDeleteDialogOpen(false)}
            sx={{ color: "#757575" }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirmDelete}
            variant="contained"
            color="error"
            sx={{ borderRadius: "20px" }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
