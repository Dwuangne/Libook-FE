import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  InputBase,
  Menu,
  MenuItem,
  Button,
  Badge,
  Container,
} from "@mui/material";
import { Link } from "react-router-dom";
import {
  Search as SearchIcon,
  AccountCircle,
  ShoppingCart,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const Header = ({ isLoggedIn }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const navigate = useNavigate();

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    // Xử lý đăng xuất tại đây
    console.log("User logged out");
    handleClose();
    // Giả lập logout và điều hướng đến trang chủ
    navigate("/");
  };

  return (
    <AppBar position="static" sx={{ backgroundColor: "#B2C4F8" }}>
      <Container maxWidth="lg">
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          {/* Logo */}
          <Typography
            variant="h6"
            component={Link}
            to="/"
            sx={{
              color: "white",
              textDecoration: "none",
              fontWeight: "bold",
              fontSize: "1.5rem",
            }}
          >
            LiBook
          </Typography>

          {/* Search Bar */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              backgroundColor: "white",
              borderRadius: "4px",
              padding: "0.3rem 0.5rem",
              flex: 1,
              marginLeft: "2rem",
              marginRight: "2rem",
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
            {/* Profile Dropdown */}
            <div>
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleMenu}
                color="inherit"
              >
                <AccountCircle />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                open={open}
                onClose={handleClose}
              >
                {isLoggedIn ? (
                  <>
                    <MenuItem onClick={handleClose}>Profile</MenuItem>
                    <MenuItem onClick={handleLogout}>Logout</MenuItem>
                  </>
                ) : (
                  <>
                    <MenuItem
                      component={Link}
                      to="/signin"
                      onClick={handleClose}
                    >
                      Login
                    </MenuItem>
                    <MenuItem
                      component={Link}
                      to="/signup"
                      onClick={handleClose}
                    >
                      Register
                    </MenuItem>
                  </>
                )}
              </Menu>
            </div>

            {/* Cart Icon */}
            <IconButton
              size="large"
              aria-label="show cart items"
              color="inherit"
              component={Link}
              to="/cart"
            >
              <Badge badgeContent={4} color="error">
                <ShoppingCart />
              </Badge>
            </IconButton>
          </div>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Header;
