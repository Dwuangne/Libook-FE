import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Snackbar,
  Alert,
} from "@mui/material";
import {
  GetProvinceApi,
  GetDistrictByProvinceApi,
  GetWardByDistrictApi,
} from "../../../api/AddressApi";
import {
  GetOrderInfoAdressByUserIdApi,
  postOrderInfoApi,
} from "../../../api/OrderInfoApi";

const AddressSelector = ({ onAddressSelect }) => {
  const [orderInfos, setOrderInfos] = useState([]);
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingDistricts, setLoadingDistricts] = useState(false);
  const [loadingWards, setLoadingWards] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    type: "success",
  });
  const [userId, setUserId] = useState("");

  // Form state
  const [newAddress, setNewAddress] = useState({
    name: "",
    phone: "",
    provinceId: "",
    districtId: "",
    wardId: "",
    address: "",
  });

  // Fetch existing addresses
  const fetchOrderInfos = async () => {
    const currentUserId = localStorage.getItem("userId"); // Lấy userId từ localStorage
    if (!currentUserId) {
      setSnackbar({
        open: true,
        message: "UserId không tồn tại, vui lòng kiểm tra lại.",
        type: "error",
      });
      return;
    }
    setLoading(true);
    try {
      const response = await GetOrderInfoAdressByUserIdApi(currentUserId);
      setOrderInfos(
        Array.isArray(response.data.data) ? response.data.data : []
      );
    } catch (error) {
      if (error.response && error.response.status === 404) {
        setSnackbar({
          open: true,
          message: "Không tìm thấy dữ liệu địa chỉ.",
          type: "error",
        });
      } else {
        setSnackbar({
          open: true,
          message: "Không thể tải danh sách địa chỉ.",
          type: "error",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  // Fetch provinces
  const fetchProvinces = async () => {
    try {
      const response = await GetProvinceApi();
      setProvinces(Array.isArray(response.data.data) ? response.data.data : []);
    } catch (error) {
      console.error("Error fetching provinces:", error);
    }
  };

  // Fetch districts
  const fetchDistricts = async (provinceId) => {
    setLoadingDistricts(true);
    try {
      const response = await GetDistrictByProvinceApi(provinceId);
      setDistricts(Array.isArray(response.data.data) ? response.data.data : []);
    } catch (error) {
      console.error("Error fetching districts:", error);
    } finally {
      setLoadingDistricts(false);
    }
  };

  // Fetch wards
  const fetchWards = async (districtId) => {
    setLoadingWards(true);
    try {
      const response = await GetWardByDistrictApi(districtId);
      setWards(Array.isArray(response.data.data) ? response.data.data : []);
    } catch (error) {
      console.error("Error fetching wards:", error);
    } finally {
      setLoadingWards(false);
    }
  };

  // Handle province change
  const handleProvinceChange = async (event) => {
    const provinceId = event.target.value;
    setNewAddress((prev) => ({
      ...prev,
      provinceId,
      districtId: "",
      wardId: "",
    }));
    setDistricts([]);
    setWards([]);
    if (provinceId) {
      await fetchDistricts(provinceId);
    }
  };

  // Handle district change
  const handleDistrictChange = async (event) => {
    const districtId = event.target.value;
    setNewAddress((prev) => ({ ...prev, districtId, wardId: "" }));
    setWards([]);
    if (districtId) {
      await fetchWards(districtId);
    }
  };

  // Handle ward change
  const handleWardChange = (event) => {
    setNewAddress((prev) => ({ ...prev, wardId: event.target.value }));
  };

  // Handle form submission
  const handleAddAddress = async () => {
    setLoading(true);
    const currentUserId = localStorage.getItem("userId"); // Lấy userId từ localStorage
    if (!currentUserId) {
      setSnackbar({
        open: true,
        message: "Không thể xác định userId.",
        type: "error",
      });
      setLoading(false);
      return;
    }
    try {
      const { name, phone, provinceId, districtId, wardId, address } =
        newAddress;

      await postOrderInfoApi(
        name,
        phone,
        provinceId,
        districtId,
        wardId,
        address,
        currentUserId
      );

      await fetchOrderInfos();
      setSnackbar({
        open: true,
        message: "Địa chỉ mới đã được thêm.",
        type: "success",
      });
      setDialogOpen(false);
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Không thể thêm địa chỉ.",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  // Effect to initialize userId and fetch initial data
  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    if (storedUserId) {
      setUserId(storedUserId);
      fetchOrderInfos();
    }
    fetchProvinces();
  }, []);

  return (
    <Box>
      <Typography variant="h6">Chọn địa chỉ nhận hàng</Typography>
      {loading ? (
        <CircularProgress />
      ) : (
        <FormControl fullWidth margin="normal">
          <InputLabel id="address-select-label">Địa chỉ</InputLabel>
          <Select
            labelId="address-select-label"
            value={selectedAddress}
            onChange={(e) => {
              setSelectedAddress(e.target.value);
              onAddressSelect(
                orderInfos.find((info) => info.id === e.target.value)
              );
            }}
          >
            {orderInfos.map((info) => (
              <MenuItem key={info.id} value={info.id}>
                {`${info.name} - ${info.address} - ${info.phone}`}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      )}
      <Button variant="contained" onClick={() => setDialogOpen(true)}>
        Thêm địa chỉ mới
      </Button>

      {/* Add Address Dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
        <DialogTitle>Thêm địa chỉ mới</DialogTitle>
        <DialogContent>
          <TextField
            label="Họ tên"
            fullWidth
            margin="normal"
            value={newAddress.name}
            onChange={(e) =>
              setNewAddress((prev) => ({ ...prev, name: e.target.value }))
            }
          />
          <TextField
            label="Số điện thoại"
            fullWidth
            margin="normal"
            value={newAddress.phone}
            onChange={(e) =>
              setNewAddress((prev) => ({ ...prev, phone: e.target.value }))
            }
          />
          <FormControl fullWidth margin="normal">
            <InputLabel>Tỉnh/Thành</InputLabel>
            <Select
              value={newAddress.provinceId}
              onChange={handleProvinceChange}
            >
              {provinces.map((province) => (
                <MenuItem key={province.code} value={province.code}>
                  {province.fullName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl
            fullWidth
            margin="normal"
            disabled={loadingDistricts || !districts.length}
          >
            <InputLabel>Quận/Huyện</InputLabel>
            <Select
              value={newAddress.districtId}
              onChange={handleDistrictChange}
            >
              {districts.map((district) => (
                <MenuItem key={district.code} value={district.code}>
                  {district.fullName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl
            fullWidth
            margin="normal"
            disabled={loadingWards || !wards.length}
          >
            <InputLabel>Phường/Xã</InputLabel>
            <Select value={newAddress.wardId} onChange={handleWardChange}>
              {wards.map((ward) => (
                <MenuItem key={ward.code} value={ward.code}>
                  {ward.fullName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            label="Địa chỉ chi tiết"
            fullWidth
            margin="normal"
            value={newAddress.address}
            onChange={(e) =>
              setNewAddress((prev) => ({ ...prev, address: e.target.value }))
            }
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Hủy</Button>
          <Button variant="contained" onClick={handleAddAddress}>
            Thêm
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.type}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AddressSelector;
