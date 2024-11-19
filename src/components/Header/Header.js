import React, { useState, useEffect } from "react";
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  InputBase,
  Menu,
  MenuItem,
  Container,
  Avatar,
  Button,
  ListItemIcon,
} from "@mui/material";
import {
  Search as SearchIcon,
  ShoppingCart,
  ExitToApp as LogoutIcon,
  Person as PersonIcon,
} from "@mui/icons-material";
import { styled, alpha } from "@mui/material/styles";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux"; // Import từ Redux
import { logout } from "../../redux/AuthSlice"; // Slice logout
import logoImg from "../../assets/Logo_Libook_RemovedBg.png";
import { Search } from "lucide-react";

const StyledSearch = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: "25px",
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": { backgroundColor: alpha(theme.palette.common.white, 0.25) },
  border: "1px solid #ccc",
  width: "100%",
  [theme.breakpoints.up("sm")]: { width: "auto" },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  padding: theme.spacing(1),
  paddingLeft: `calc(1em + ${theme.spacing(4)})`,
  width: "100%",
  [theme.breakpoints.up("md")]: { width: "50ch" },
}));

const Header = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const dispatch = useDispatch();
  const { isLoggedIn, username, avatarUrl } = useSelector(
    (state) => state.auth
  ); // Lấy dữ liệu từ Redux

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const truncateUsername = (fullUsername) => {
    const atIndex = fullUsername.indexOf("@");
    return atIndex !== -1 ? fullUsername.slice(0, atIndex) : fullUsername;
  };
  const NameOfUser = truncateUsername(
    useSelector((state) => state.auth.user.username)
  );
  console.log(">>>>>>>>>>>>>> username", NameOfUser);

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    if (searchQuery.trim() !== "") {
      navigate(`/bookslist?keyword=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleLogout = () => {
    dispatch(logout()); // Gọi action logout
    navigate("/");
  };

  if (
    pathname.includes("admin") ||
    pathname.includes("signin") ||
    pathname.includes("signup") ||
    pathname.includes("successPayment") ||
    pathname.includes("failedPayment")
  ) {
    return null;
  }

  return (
    <AppBar
      position="fixed"
      sx={{
        backgroundColor: scrolled ? "rgba(255, 255, 255, 0.95)" : "#FAFAFA",
        boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
        color: "#333",
        height: "80px",
      }}
    >
      <Container maxWidth="lg">
        <Toolbar
          sx={{
            display: "flex",
            justifyContent: "space-between",
            height: "100%",
            paddingTop: "2px",
            paddingBottom: "8px",
          }}
        >
          <Link
            to="/"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            style={{
              textDecoration: "none",
              display: "flex",
              alignItems: "center",
            }}
          >
            <img
              src={logoImg}
              alt="LiBook"
              style={{
                height: "60px", // Tăng kích thước logo
                transition: "all 0.3s ease",
              }}
            />
          </Link>

          <Box
            component="form"
            onSubmit={handleSearchSubmit}
            sx={{
              flexGrow: 1,
              maxWidth: "500px",
              height: "40px",
              display: "flex",
              alignItems: "center",
              borderRadius: "25px", // Đảm bảo cả ô tìm kiếm có viền tròn
              position: "relative",
              border: "1px solid grey",
            }}
          >
            {/* Ô nhập liệu */}
            <StyledInputBase
              placeholder="Search book's name ..."
              inputProps={{ "aria-label": "search" }}
              onChange={(e) => setSearchQuery(e.target.value)}
              sx={{
                width: "100%", // Đảm bảo ô nhập chiếm toàn bộ không gian bên trong Search
                paddingLeft: "16px", // Khoảng cách bên trái, cho phép người dùng thấy chữ dễ dàng
                "& .MuiInputBase-input": {
                  marginLeft: "0", // Bỏ margin mặc định nếu có
                },
                border: "none", // Bỏ viền bên trong input
              }}
            />

            {/* Icon Tìm kiếm */}
            <IconButton
              type="submit"
              sx={{
                position: "absolute", // Đặt icon tuyệt đối bên trong ô tìm kiếm
                right: "8px", // Căn icon sát bên phải
                top: "50%", // Căn icon theo chiều dọc
                transform: "translateY(-50%)", // Căn giữa chiều dọc
                backgroundColor: "black",
                width: "32px", // Kích thước icon
                height: "32px",
                "&:hover": {
                  backgroundColor: "#333333", // Thêm hiệu ứng hover
                },
                transition: "background-color 0.2s",
              }}
            >
              <SearchIcon sx={{ color: "white", fontSize: "1.2rem" }} />
            </IconButton>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center" }}>
            <IconButton
              size="large"
              aria-label="show cart items"
              color="inherit"
              component={Link}
              to="/cart"
              sx={{ mr: 2 }}
            >
              <ShoppingCart sx={{ fontSize: 28 }} />
            </IconButton>
            {isLoggedIn ? (
              <>
                <Button
                  onClick={(e) => setAnchorEl(e.currentTarget)}
                  color="inherit"
                  startIcon={
                    <Avatar
                      src={avatarUrl}
                      sx={{ width: 40, height: 40, backgroundColor: "black" }}
                    />
                  }
                  sx={{ fontSize: "1.1rem" }}
                >
                  {NameOfUser}
                </Button>
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={() => setAnchorEl(null)}
                >
                  <MenuItem onClick={() => navigate("/profile")}>
                    <ListItemIcon>
                      <PersonIcon fontSize="small" />
                    </ListItemIcon>
                    Profile
                  </MenuItem>
                  <MenuItem onClick={handleLogout}>
                    <ListItemIcon>
                      <LogoutIcon fontSize="small" />
                    </ListItemIcon>
                    Logout
                  </MenuItem>
                </Menu>
              </>
            ) : (
              <>
                <Button
                  onClick={() => navigate("/signup")}
                  sx={{
                    color: "black",
                    fontWeight: "bold",
                    textTransform: "none",
                    borderRadius: "20px",
                    padding: "8px 16px",
                    fontSize: "1rem",
                    "&:hover": {
                      backgroundColor: "#030ce9",
                      color: "white",
                    },
                  }}
                >
                  Sign Up
                </Button>
                <Button
                  onClick={() => navigate("/signin")}
                  sx={{
                    color: "black",
                    fontWeight: "bold",
                    textTransform: "none",
                    borderRadius: "20px",
                    padding: "8px 16px",
                    fontSize: "1rem",
                    ml: 2,
                    "&:hover": {
                      backgroundColor: "#030ce9",
                      color: "white",
                    },
                  }}
                >
                  Log In
                </Button>
              </>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Header;
