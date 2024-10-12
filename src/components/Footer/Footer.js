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
        backgroundColor: "#fafafa", // Màu nền xám cho margin
        padding: "0 83px", // Padding để tạo khoảng cách với nội dung
      }}
    >
      <div
        style={{
          backgroundColor: "#B2C4F8",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          // boxShadow: "1px 1px 3px rgba(0,0,0.16)",
          padding: "1rem 0",
          borderRadius: "5px",
        }}
      >
        <Container maxWidth="lg">
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
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
                boxShadow: "0.2px 0.15px 0.15px rgba(0,0,0.16)",
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                LiBook
              </Typography>
              <Typography variant="body2" sx={{ marginTop: "1rem" }}>
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
                boxShadow: "0.2px 0.15px 0.15px rgba(0,0,0.16)",
              }}
            >
              <Typography variant="h6" sx={{ mb: 0.25, fontWeight: "bold" }}>
                Quick Links
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
                boxShadow: "0.2px 0.15px 0.15px rgba(0,0,0.16)",
              }}
            >
              <Typography
                variant="h6"
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
              <Typography variant="h6" sx={{ fontWeight: "bold" }}>
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
                    padding: "0.5rem",
                    borderRadius: "4px",
                    flex: 1,
                    marginRight: "0.5rem",
                  }}
                />
                <Button
                  variant="contained"
                  sx={{ backgroundColor: "gray", color: "white" }}
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
            <Typography variant="body2">
              Privacy Policy &nbsp; | &nbsp; Support
            </Typography>
            <Typography variant="body2">
              © 2024 - LiBook. All rights reserved
            </Typography>
            <div>
              <IconButton color="inherit" aria-label="Twitter">
                <TwitterIcon />
              </IconButton>
              <IconButton color="inherit" aria-label="Instagram">
                <InstagramIcon />
              </IconButton>
              <IconButton color="inherit" aria-label="Facebook">
                <FacebookIcon />
              </IconButton>
            </div>
          </div>
        </Container>
      </div>
    </div>
  );
};

export default Footer;
