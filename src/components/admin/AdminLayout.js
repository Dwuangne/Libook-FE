import React from "react";
import Logo_RemoveBG from "../../assets/Logo_Libook_RemovedBg.png"
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import DashboardIcon from "@mui/icons-material/Dashboard";
import LogoutIcon from "@mui/icons-material/Logout";
import BookIcon from '@mui/icons-material/AutoStories';
import MessageIcon from '@mui/icons-material/Chat';
import VoucherIcon from '@mui/icons-material/Discount';
import ReportIcon from '@mui/icons-material/Assessment';
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { Typography } from "@mui/material";
import { toast } from "react-toastify";
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

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("username");
    toast.success("Logout Successfully", { autoClose: 1000 });
    setTimeout(() => {
      navigate("/");
      window.scrollTo({ top: 0, behavior: "instant" });
      console.log("Logout successfully");
    }, 1000);
  };

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          width: `calc(100% - ${drawerWidth}px)`,
          ml: `${drawerWidth}px`,
        }}
      />
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
            borderRadius: "5px",
            backgroundColor: "#F8F8FF", // Set background color
            backgroundSize: "cover", // Cover the entire drawer
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
            color: "white",
            height: "70px",
          }}
        >
          <img
            src={Logo_RemoveBG}
            style={{
              width: "150px",
              height: "90px",
              pt: 1,
            }}
            alt="logo"
          />
        </Box>
        <List>
          {itemList.map((item, index) => (
            <ListItem key={item.label} sx={{ px: 2, py: 0.4 }}>
              <ListItemButton
                selected={pathname.includes(item.href)}
                onClick={() => {
                  navigate(item.href);
                }}
                sx={{
                  borderRadius: "10px",
                  border: "1px solid white",
                  "&:hover": {
                    backgroundColor: "#c7d5ff",
                    color: "#030ce9",
                    border: "2px solid #030ce9",
                  },
                  "&.Mui-selected": {
                    backgroundColor: "#030ce9",
                    color: "white",
                  },
                  "&.Mui-selected:hover": {
                    backgroundColor: "#030ce9",
                    color: "white",
                  },
                }}
              >
                <ListItemIcon sx={{ color: "inherit" }}>
                  <item.Icon />
                </ListItemIcon>
                <ListItemText>
                  <Typography sx={{ fontWeight: "600" }}>
                    {item.label}
                  </Typography>
                </ListItemText>
              </ListItemButton>
            </ListItem>
          ))}
        </List>
        <Divider color="#CDCDCE" sx={{ mt: 2 }} />
        <List>
          <ListItem sx={{ px: 2, py: 0.4 }}>
            <ListItemButton
              onClick={handleLogout}
              sx={{
                borderRadius: "10px",
                border: "1px solid white",
                "&:hover": {
                  backgroundColor: "#c7d5ff",
                  color: "#030ce9",
                  border: "2px solid #030ce9",
                },
                "&.Mui-selected": {
                  backgroundColor: "#030ce9",
                  color: "white",
                },
                "&.Mui-selected:hover": {
                  backgroundColor: "#030ce9",
                  color: "white",
                },
              }}
            >
              <ListItemIcon sx={{ color: "inherit" }}>
                <LogoutIcon />
              </ListItemIcon>
              <ListItemText>
                <Typography sx={{ fontWeight: "600" }}>Logout</Typography>
              </ListItemText>
            </ListItemButton>
          </ListItem>
        </List>
      </Drawer>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          backgroundColor: "white",
          minHeight: "100vh",
          height: "100%",
          minWidth: 650,
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
}
