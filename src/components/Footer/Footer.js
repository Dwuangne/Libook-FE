import React from "react";
import {
  Container,
  Divider,
  Typography,
  Input,
  Button,
  IconButton,
} from "@mui/material";
import TwitterIcon from "@mui/icons-material/Twitter";
import InstagramIcon from "@mui/icons-material/Instagram";
import FacebookIcon from "@mui/icons-material/Facebook";
import { Link, useLocation } from "react-router-dom";

const Footer = () => {
  const { pathname } = useLocation();
  if (
    pathname.includes("admin") ||
    pathname.includes("successPayment") ||
    pathname.includes("failedPayment") ||
    pathname.includes("signin") ||
    pathname.includes("signup")
  ) {
    return <></>;
  }
  return (
    <div
      style={{
        backgroundColor: "#f0f0f0", // Màu nền xám cho margin
        padding: "60px 100px 0px 100px", // Padding để tạo khoảng cách với nội dung
      }}
    >
      <div
        style={{
          backgroundColor: "white",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          paddingTop: "30px",
          borderRadius: "8px",
        }}
      >
        <Container maxWidth="lg">
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
              gap: "1rem",
            }}
          >
            {/* Libook Section */}
            <div
              style={{
                display: "flex",
                flex: 1,
                flexDirection: "column",
                textAlign: "left",
                gap: "0.3rem",
                borderRight: "2px solid rgba(0, 0, 0, 0.1)", // Thêm border chỉ bên phải
                paddingRight: "1rem", // Thêm padding bên phải để tránh nội dung bị dính vào viền
              }}
            >
              <Typography variant="h5" sx={{ fontWeight: "bold" }}>
                LiBook
              </Typography>
              <Typography variant="body1" sx={{ marginTop: "1rem" }}>
                Lorem, ipsum dolor sit amet consectetur adipisicing elit.
                Dolorum atque vero in. Dolores similique ducimus error aperiam.
                Nam, debitis at!
              </Typography>
            </div>

            {/* Quick Links Section */}

            <div
              style={{
                display: "flex",
                flex: 1,
                flexDirection: "column",
                textAlign: "left",
                gap: "0.3rem",
                borderRight: "2px solid rgba(0, 0, 0, 0.1)", // Thêm border chỉ bên phải
                paddingRight: "1rem", // Thêm padding bên phải để tránh nội dung bị dính vào viền
              }}
            >
              <Typography variant="h5" sx={{ mb: 0.25, fontWeight: "bold" }}>
                Quick Links
              </Typography>

              <Link
                to="/"
                style={{ textDecoration: "none" }}
                onClick={() => window.scrollTo(0, 0)}
              >
                <Typography
                  sx={{
                    textDecoration: "none",
                    color: "black",
                    cursor: "pointer",
                    fontWeight: "500",
                    paddingTop: "10px",
                    transition:
                      "color 0.2s ease-in-out, scale 0.3s ease-in-out",
                    fontSize: "1rem",
                    "&:hover": {
                      scale: "1.02",
                      color: "#003ce9",
                    },
                  }}
                >
                  Home
                </Typography>
              </Link>
              <Link
                to="/promotion"
                style={{ textDecoration: "none" }}
                onClick={() => window.scrollTo(0, 0)}
              >
                <Typography
                  sx={{
                    textDecoration: "none",
                    color: "black",
                    cursor: "pointer",
                    fontWeight: "500",
                    transition:
                      "color 0.2s ease-in-out, scale 0.3s ease-in-out",
                    fontSize: "1rem",
                    "&:hover": {
                      scale: "1.02",
                      color: "#003ce9",
                    },
                  }}
                >
                  About
                </Typography>
              </Link>
              <Link
                to="/policy"
                style={{ textDecoration: "none" }}
                onClick={() => window.scrollTo(0, 0)}
              >
                <Typography
                  sx={{
                    textDecoration: "none",
                    color: "black",
                    cursor: "pointer",
                    fontWeight: "500",
                    transition:
                      "color 0.2s ease-in-out, scale 0.3s ease-in-out",
                    fontSize: "1rem",
                    "&:hover": {
                      scale: "1.02",
                      color: "#003ce9",
                    },
                  }}
                >
                  Categories
                </Typography>
              </Link>
            </div>

            {/* Support Section */}
            <div
              style={{
                display: "flex",
                flex: 1,
                flexDirection: "column",
                textAlign: "left",
                gap: "0.3rem",
                borderRight: "2px solid rgba(0, 0, 0, 0.1)", // Thêm border chỉ bên phải
                paddingRight: "1rem", // Thêm padding bên phải để tránh nội dung bị dính vào viền
              }}
            >
              <Typography
                variant="h5"
                sx={{ mb: 0.25, fontWeight: "bold", gap: "1rem" }}
              >
                Support
              </Typography>

              <Link
                to="/introduction"
                style={{ textDecoration: "none" }}
                onClick={() => window.scrollTo(0, 0)}
              >
                <Typography
                  sx={{
                    textDecoration: "none",
                    color: "black",
                    cursor: "pointer",
                    fontWeight: "500",
                    paddingTop: "10px",
                    transition:
                      "color 0.2s ease-in-out, scale 0.3s ease-in-out",
                    fontSize: "1rem",
                    "&:hover": {
                      scale: "1.02",
                      color: "#003ce9",
                    },
                  }}
                >
                  Company
                </Typography>
              </Link>
              <Link
                to="/promotion"
                style={{ textDecoration: "none" }}
                onClick={() => window.scrollTo(0, 0)}
              >
                <Typography
                  sx={{
                    textDecoration: "none",
                    color: "black",
                    cursor: "pointer",
                    fontWeight: "500",
                    transition:
                      "color 0.2s ease-in-out, scale 0.3s ease-in-out",
                    fontSize: "1rem",
                    "&:hover": {
                      scale: "1.02",
                      color: "#003ce9",
                    },
                  }}
                >
                  Blog
                </Typography>
              </Link>
              <Link
                to="/policy"
                style={{ textDecoration: "none" }}
                onClick={() => window.scrollTo(0, 0)}
              >
                <Typography
                  sx={{
                    textDecoration: "none",
                    color: "black",
                    cursor: "pointer",
                    fontWeight: "500",
                    transition:
                      "color 0.2s ease-in-out, scale 0.3s ease-in-out",
                    fontSize: "1rem",
                    "&:hover": {
                      scale: "1.02",
                      color: "#003ce9",
                    },
                  }}
                >
                  Contact Us
                </Typography>
              </Link>
            </div>

            {/* Newsletter Section */}
            <div
              style={{
                flex: 1,
                textAlign: "left",
              }}
            >
              <Typography variant="h5" sx={{ fontWeight: "bold" }}>
                Newsletter
              </Typography>
              <Typography sx={{ marginTop: "1rem", marginBottom: "1rem" }}>
                Please leave your email to receive new information of new
                products, as well as offers from LiBook.
              </Typography>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: "1rem",
                }}
              >
                <Input
                  placeholder="Email"
                  disableUnderline
                  sx={{
                    backgroundColor: "#F5F5F5",
                    padding: "0.3rem",
                    borderRadius: "4px",
                    flex: 1, // Đảm bảo Input chiếm hết không gian
                    marginRight: "0.5rem",
                    height: "30px",
                    border: "1px solid gray",
                  }}
                />
                <Button
                  variant="contained"
                  sx={{
                    backgroundColor: "gray",
                    color: "white",
                    height: "30px",
                    width: "20px", // Thiết lập chiều rộng cố định cho Button
                    padding: "0", // Giảm padding để giữ kích thước nhỏ
                  }}
                >
                  →
                </Button>
              </div>
            </div>
          </div>

          <Divider />

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginTop: "0.5rem",
              flexWrap: "wrap",
            }}
          >
            <Typography variant="body1">
              Privacy Policy &nbsp; | &nbsp; Support
            </Typography>
            <Typography variant="body1">
              © 2024 - LiBook. All rights reserved
            </Typography>
            <div>
              <IconButton color="inherit" aria-label="Twitter">
                <TwitterIcon fontSize="large" />
              </IconButton>
              <IconButton color="inherit" aria-label="Instagram">
                <InstagramIcon fontSize="large" />
              </IconButton>
              <IconButton color="inherit" aria-label="Facebook">
                <FacebookIcon fontSize="large" />
              </IconButton>
            </div>
          </div>
        </Container>
      </div>
    </div>
  );
};

export default Footer;
