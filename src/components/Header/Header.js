import React, { useState, useEffect } from "react";
import {
  AppBar,
  Box,
  Typography,
  Toolbar,
  IconButton,
  InputBase,
  Menu,
  MenuItem,
  Badge,
  Container,
  ListItemIcon,
  Avatar, // Thêm Avatar để hiển thị ảnh đại diện
} from "@mui/material";
import {
  Search as SearchIcon,
  ShoppingCart,
  AccountCircle,
} from "@mui/icons-material";
import LogoutIcon from "@mui/icons-material/Logout";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";

import { Link, useNavigate, useLocation } from "react-router-dom";
import logoImg from "../../assets/logo_1.png";
import { toast } from "react-toastify";
import { GetAllBooksApi } from "../../api/BookApi";

const Header = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [scrolled, setScrolled] = useState(false); // State theo dõi scroll
  const open = Boolean(anchorEl);
  const navigate = useNavigate();

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClick = (event) => {
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
  const { pathname } = useLocation();
  const [nameFilter, setNameFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [Books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);

  // const fetchData = async () => {
  //   try {
  //     const bookRes = await Promise.all(
  //       GetAllBooksApi({
  //         filter: nameFilter,
  //       })
  //     );
  //     const bookData = bookRes?.data?.data || [];

  //     setBooks(bookData);
  //     console.log(bookData);
  //   } catch (err) {
  //     console.log(err);
  //   }
  // };
  // useEffect(() => {
  //   setLoading(true);
  //   setTimeout(() => {
  //     setLoading(false);
  //   }, 2000);
  //   fetchData();
  // }, [nameFilter]);

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
    <div>
      <AppBar
        position="sticky"
        zIndex={1000}
        sx={{
          backgroundColor: "#B2C4F8",
          transition: "all 0.3s ease",
          boxShadow: scrolled ? "0 2px 4px rgba(0,0,0,0.2)" : "none",
          height: scrolled ? "60px" : "70px",
        }}
      >
        <Container maxWidth="lg" maxHeight="lg">
          <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
            {/* Logo */}
            <Link to="/" style={{ textDecoration: "none" }}>
              <img
                src={logoImg}
                alt="LiBook"
                style={{
                  height: scrolled ? "40px" : "60px",
                  transition: "all 0.3s ease",
                }}
              />
            </Link>

            {/* Search Bar */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                backgroundColor: "white",
                borderRadius: "10px",
                padding: scrolled ? "0.1rem 0.2rem" : "0.2rem 0.4rem",
                flex: 1,
                marginLeft: "1rem",
                marginRight: "1rem",
                maxWidth: scrolled ? "200px" : "300px",
                height: scrolled ? "20px" : "30px",
                transition: "all 0.3s ease",
              }}
            >
              <InputBase
                placeholder="Search…"
                inputProps={{ "aria-label": "search" }}
                sx={{ flex: 1 }}
              />
              <IconButton type="submit" sx={{ p: "10px" }} aria-label="search">
                <SearchIcon />
              </IconButton>
            </div>

            {/* Profile and Cart */}
            <div style={{ display: "flex", alignItems: "center" }}>
              {/* Cart Icon */}
              <IconButton
                size="large"
                aria-label="show cart items"
                color="black"
                component={Link}
                to="/cart"
              >
                <Badge>
                  <ShoppingCart />
                </Badge>
              </IconButton>
              {/* Profile Dropdown */}

              {isLoggedIn ? (
                <Box sx={{ display: "flex", alignItems: "right" }}>
                  <ListItemIcon
                    sx={{
                      justifyContent: "center",
                      fontSize: 60,
                      color: "#3949AB",
                      cursor: "pointer",
                    }}
                    onClick={handleClick}
                  >
                    <Typography
                      sx={{
                        color: "black",
                        textDecoration: "underline",
                        textUnderlineOffset: 2,
                      }}
                    >
                      {displayUsername}
                    </Typography>
                  </ListItemIcon>
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
                        <AccountCircle fontSize="small" />
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
                </Box>
              ) : (
                <Box sx={{ display: "flex", alignItems: "right" }}>
                  <ListItemIcon
                    sx={{
                      justifyContent: "center",
                      fontSize: 60,
                      color: "#3949AB",
                      cursor: "pointer",
                    }}
                    onClick={handleClick}
                  >
                    <AccountCircle />
                  </ListItemIcon>
                  <Menu
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleClose}
                    MenuListProps={{
                      "aria-labelledby": "basic-button",
                    }}
                  >
                    <MenuItem onClick={handleSignIn}>Log In</MenuItem>
                    <MenuItem onClick={handleSignUp}>Sign Up</MenuItem>
                  </Menu>
                </Box>
              )}
            </div>
          </Toolbar>
        </Container>
      </AppBar>
    </div>
  );
};

export default Header;
