import React, { useState } from "react";
import Logo_RemoveBG from "../../assets/Logo_Libook_RemovedBg.png";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import {
  Dashboard as DashboardIcon,
  Logout as LogoutIcon,
  AutoStories as BookIcon,
  Chat as MessageIcon,
  Discount as VoucherIcon,
  Assessment as ReportIcon,
  Menu as MenuIcon,
  PersonOutline as PersonOutlineIcon,
  AccountCircle as AccountCircleIcon,
} from "@mui/icons-material";
import {
  Typography, Menu, MenuItem, AppBar, Box,
  CssBaseline, Divider, Drawer, List, ListItem, 
  ListItemButton, ListItemIcon, ListItemText,
} from "@mui/material";
import { toast } from "react-toastify";
const drawerWidthOpen = 240; // Chiều rộng khi menu mở
const drawerWidthClosed = 0; // Chiều rộng khi menu đóng
const drawerWidth = 240;
const itemList = [
  {
    label: "Dashboard",
    Icon: DashboardIcon,
    href: "dashboard",
  },
  {
    label: "Book",
    Icon: BookIcon,
    href: "books",
  },
  {
    label: "Voucher",
    Icon: VoucherIcon,
    href: "vouchers",
  },
  {
    label: "Message",
    Icon: MessageIcon,
    href: "messages",
  },
  {
    label: "Report",
    Icon: ReportIcon,
    href: "reports",
  },
];

export default function AdminLayout() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [isDrawerOpen, setIsDrawerOpen] = useState(true); // State để quản lý việc đóng mở menu
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleProfile = () => {
    // Navigate to profile page or open profile modal
    handleClose();
  };

  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("username");
    toast.success("Logout Successfully", { autoClose: 1000 });
    setTimeout(() => {
      navigate("/");
      window.scrollTo({ top: 0, behavior: "instant" });
      console.log("Logout successfully");
    }, 500);
  };

  const truncateUsername = (fullUsername) => {
    const atIndex = fullUsername.indexOf("@");
    return atIndex !== -1 ? fullUsername.slice(0, atIndex) : fullUsername;
  };

  // Assume we get the username from localStorage or a state management solution
  const fullUsername = localStorage.getItem("username") || "User";
  const displayUsername = truncateUsername(fullUsername);

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          width: `calc(100% - ${isDrawerOpen ? drawerWidthOpen : drawerWidthClosed}px)`,
          ml: `${isDrawerOpen ? drawerWidthOpen : drawerWidthClosed}px`,
          backgroundColor: "#3949AB", // Indigo
        }}
      />
      <Drawer
        sx={{
          width: isDrawerOpen ? drawerWidthOpen : drawerWidthClosed,
          flexShrink: 0,
          transition: "width 0.3s", // Thêm transition để mượt mà
          "& .MuiDrawer-paper": {
            width: isDrawerOpen ? drawerWidthOpen : drawerWidthClosed,
            transition: "width 0.3s", // Thêm transition cho phần Drawer
            boxSizing: "border-box",
            borderRadius: "5px",
            backgroundColor: "#b2c4f8",
            backgroundSize: "cover",
          },
        }}
        variant="permanent"
        anchor="left"
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "top",
            color: "#3949AB", // Indigo
            height: "55px",
            marginTop: "10px",
          }}
        >
          <img
            src={Logo_RemoveBG}
            style={{
              width: "100px",
              height: "50px",
            }}
            alt="logo"
          />
        </Box>
        <List>
          {itemList.map((item) => (
            <ListItem key={item.label} sx={{ px: 2, py: 0.4 }}>
              <ListItemButton
                selected={pathname.includes(item.href)}
                onClick={() => navigate(item.href)}
                sx={{
                  borderRadius: "10px",
                  "&:hover": {
                    backgroundColor: "#5C6BC0",
                    color: "#FFF",
                    border: "2px solid #5C6BC0",
                  },
                  "&.Mui-selected": {
                    backgroundColor: "#3949AB",
                    color: "white",
                  },
                  "&.Mui-selected:hover": {
                    backgroundColor: "#3949AB",
                    color: "white",
                  },
                }}
              >
                <ListItemIcon sx={{ color: "inherit" }}>
                  <item.Icon />
                </ListItemIcon>
                {isDrawerOpen && (
                  <ListItemText>
                    <Typography sx={{ fontWeight: "600" }}>
                      {item.label}
                    </Typography>
                  </ListItemText>
                )}
              </ListItemButton>
            </ListItem>
          ))}
        </List>
        <Divider color="#E0E0E0" sx={{ mt: 2 }} />
      </Drawer>
      <Box
        sx={{
          flexGrow: 1,
          transition: "margin-left 0.3s", // Mượt mà khi nội dung giãn ra
          backgroundColor: "#FAFAFA",
          minHeight: "100vh",
          height: "100%",
          minWidth: 650,
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "top",
            padding: 1,
            backgroundColor: "#E8EAF6",
          }}
        >
          <ListItemIcon
            sx={{
              justifyContent: "center",
              fontSize: 60,
              color: "#3949AB",
              cursor: "pointer",
            }}
            onClick={toggleDrawer}
          >
            <MenuIcon />
          </ListItemIcon>

          <Box sx={{ display: "flex", alignItems: "right" }}>
            <Typography sx={{ color: "#3949AB" }}>
              Welcome, {displayUsername}
            </Typography>
            <ListItemIcon
              sx={{
                justifyContent: "center",
                fontSize: 60,
                color: "#3949AB",
                cursor: "pointer",
              }}
              onClick={handleClick}
            >
              <PersonOutlineIcon />
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
                  <AccountCircleIcon fontSize="small" />
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
        </Box>
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            minHeight: "100vh",
            height: "100%",
            minWidth: 650,
          }}
        >
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}
