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
  ListItemIcon,
  Avatar,
  Button,
} from "@mui/material";
import {
  Search as SearchIcon,
  ShoppingCart,
  ExitToApp as LogoutIcon,
  Person as PersonIcon,
} from "@mui/icons-material";
import { styled, alpha } from "@mui/material/styles";
import { Link, useNavigate, useLocation } from "react-router-dom";
import logoImg from "../../assets/Logo_Libook_RemovedBg.png";
import { toast } from "react-toastify";

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(3),
    width: "auto",
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  border: "1px solid #ccc", // Viền
  borderRadius: "25px", // Bo tròn hơn
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("md")]: {
      width: "50ch", // Kéo dài trường tìm kiếm
    },
  },
}));

const Header = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [scrolled, setScrolled] = useState(false); // State theo dõi scroll
  const open = Boolean(anchorEl);
  const navigate = useNavigate();
  const { pathname } = useLocation();

  // useEffect(() => {
  //   // Kiểm tra nếu trang chưa được tải lại
  //   if (pathname === "/") {
  //     // Kiểm tra nếu là trang homepage
  //     if (!sessionStorage.getItem("hasReloaded")) {
  //       sessionStorage.setItem("hasReloaded", "true");
  //       window.location.reload();
  //     }
  //   }
  // }, []);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleProfile = () => {
    // Navigate to profile page or open profile modal
    navigate("/profile");
    handleClose();
  };

  const handleSignIn = () => {
    // Navigate to profile page or open profile modal
    navigate("/signin");
    handleClose();
  };
  const handleSignUp = () => {
    // Navigate to profile page or open profile modal
    navigate("/signup");
    handleClose();
  };

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("username");
    toast.success("Logout Successfully", { autoClose: 1000 });
    setIsLoggedIn(false);
    setTimeout(() => {
      navigate("/");
      window.scrollTo({ top: 0, behavior: "instant" });
      console.log("Logout successfully");
    }, 1000);
  };

  const truncateUsername = (fullUsername) => {
    const atIndex = fullUsername.indexOf("@");
    return atIndex !== -1 ? fullUsername.slice(0, atIndex) : fullUsername;
  };

  const [isLoggedIn, setIsLoggedIn] = useState(
    localStorage.getItem("accessToken") !== null
  );
  // Lấy thông tin username và avatar từ localStorage
  const fullUsername = localStorage.getItem("username") || "User";
  const displayUsername = truncateUsername(fullUsername);
  const avatarUrl = localStorage.getItem("avatarUrl") || ""; // Giả sử bạn lưu avatar
  const role = localStorage.getItem("role") || "";

  const [nameFilter, setNameFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [Books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleNameKeyChange = (id) => {
    setNameFilter((prev) => (prev === id ? null : id));
    setCurrentPage(1);
  };

  // Lắng nghe sự kiện scroll
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  if (
    pathname.includes("admin") ||
    pathname.includes("successPayment") ||
    pathname.includes("failedPayment") ||
    pathname.includes("signin") ||
    pathname.includes("signup")
  ) {
    return null;
  }

  return (
    <AppBar
      position="fixed"
      sx={{
        backgroundColor: scrolled ? "rgba(255, 255, 255, 0.95)" : "#FAFAFA",
        transition: "all 0.3s ease",
        boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
        height: "80px", // Tăng chiều cao của AppBar
        color: "#333",
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

          <Search sx={{ flexGrow: 1, maxWidth: "500px", mx: 2 }}>
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="Search book's name ..."
              inputProps={{ "aria-label": "search" }}
              sx={{ width: "100%" }}
            />
          </Search>

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
                  onClick={handleMenu}
                  color="inherit"
                  startIcon={
                    <Avatar
                      src={avatarUrl}
                      sx={{ width: 40, height: 40, backgroundColor: "black" }}
                    />
                  }
                  sx={{ fontSize: "1.1rem" }}
                >
                  {displayUsername}
                </Button>
                <Menu
                  anchorEl={anchorEl}
                  open={open}
                  onClose={handleClose}
                  MenuListProps={{
                    "aria-labelledby": "basic-button",
                  }}
                >
                  <MenuItem onClick={handleProfile}>
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
                  onClick={handleSignUp}
                >
                  Sign Up
                </Button>

                <Button
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
                  onClick={handleSignIn}
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
