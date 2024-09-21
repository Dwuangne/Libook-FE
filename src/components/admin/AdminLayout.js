import React from "react";
import Logo_RemoveBG from "../../assets/Logo_Libook_RemovedBg.png"
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import Dashboard from "@mui/icons-material/Dashboard";
import LogoutIcon from "@mui/icons-material/Logout";
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
const drawerWidth = 260;
const itemList = [
  {
    label: "Dashboard",
    Icon: Dashboard,
    href: "dashboard",
  },
 
];

export default function AdminLayout() {
  const { pathname } = useLocation();
  const username = localStorage.getItem("username");
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
          },
        }}
        variant="permanent"
        anchor="left"
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "left",
            justifyContent: "center",
            backgroundColor: "white",
            color: "white",
            minHeight: "120px",
          }}
        >
          <img
            src={Logo_RemoveBG}
            style={{
              width: "90px",
              height: "90px",
              my: 1,
              pt: 1,
              borderRadius: "10px",
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
                    backgroundColor: "#354DF0",
                    color: "#ff469e",
                    border: "1px solid #FBFBFD",
                  },
                  "&.Mui-selected": {
                    backgroundColor: "#ff469e",
                    color: "white",
                  },
                  "&.Mui-selected:hover": {
                    backgroundColor: "#fff4fc",
                    color: "#354DF0",
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
        <Divider color="black" sx={{ mt: 2 }} />
        <List>
          <ListItem sx={{ px: 2, py: 0.4 }}>
            <ListItemButton
              onClick={handleLogout}
              sx={{
                borderRadius: "10px",
                border: "1px solid white",
                "&:hover": {
                  backgroundColor: "#fff4fc",
                  color: "#ff469e",
                  border: "1px solid #ff469e",
                },
                "&.Mui-selected": {
                  backgroundColor: "#ff469e",
                  color: "white",
                },
                "&.Mui-selected:hover": {
                  backgroundColor: "#fff4fc",
                  color: "#ff469e",
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
          backgroundColor: "#f5f7fd",
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
