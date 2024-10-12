import React, { useState } from "react";
import { toast } from "react-toastify";
import { signUpApi } from "../../api/UserApi";
import { useNavigate } from "react-router-dom";

//UI
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import Input from "@mui/material/Input";
import IconButton from "@mui/material/IconButton";
import Eye from "@mui/icons-material/Visibility";
import EyeOff from "@mui/icons-material/VisibilityOff";
import { Box, CircularProgress, Typography } from "@mui/material";

import InputAdornment from "@mui/material/InputAdornment";

const Register = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const passwordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log("form subbmited ", username, password, confirmPassword);

    if (confirmPassword !== password) {
      toast.error("Confirm password must be the same as password", {
        autoClose: 1500,
      });
      return;
    }
    if (password.length < 8 || confirmPassword.length < 8) {
      toast.error(
        "Password's length and confirm password is at least 8 character",
        {
          autoClose: 3000,
        }
      );
      return;
    }
    if (username === "" || password === "" || confirmPassword === "") {
      toast.error("Please input all fields", { autoClose: 1500 });
      return;
    }

    try {
      signUpApi(username, password)
        .then((response) => {
          console.log("Sign Up Successfully", response);
          toast.success(`Sign Up Successfully`, { autoClose: 1500 });
          setTimeout(() => {
            setLoading(true);
          }, 2000);
          setTimeout(() => {
            navigate("/signin");
          }, 5000);
        })
        .catch((error) => {
          console.error("Sign Up Failed", error);
          const errorMessage = error.response?.data || "Sign Up Failed.";
          toast.error(errorMessage, { autoClose: 1500 });
          setLoading(false);
        });
    } catch (err) {
      console.error("Error fetching user data", err);
      toast.error("Error checking username availability", { autoClose: 1500 });
    }
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          maxWidth: "100vw",
          backgroundColor: "#f5f5f5",
        }}
      >
        <CircularProgress sx={{ color: "#030ce9" }} size={100} />
      </Box>
    );
  }

  return (
    <div style={{ marginTop: "0.2rem" }}>
      <div
        style={{
          minHeight: "100vh",
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Box
          sx={{
            width: "50%", // Cùng kích thước với form đăng nhập
            animation: "slideSignup 1s ease-in-out",
            "@keyframes slideSignup": {
              from: {
                transform: "translateX(35%)",
              },
              to: {
                transform: "translateX(0)",
              },
            },
          }}
        >
          <div
            style={{
              backgroundColor: "#ffffff",
              borderRadius: "10px",
              padding: "4%", // Giữ cùng giá trị với form đăng nhập
              margin: "1rem 0",
              boxShadow: "0 2rem 3rem rgba(132, 139, 200, 0.25)",
              border: "3px solid #030ce9",
            }}
          >
            <div style={{ textAlign: "center", marginBottom: "3rem" }}>
              <h1
                style={{ color: "black", fontSize: "2.5em", fontWeight: "700" }}
              >
                Sign Up
              </h1>
            </div>
            <form onSubmit={handleSubmit}>
              <FormControl sx={{ mb: 3 }} fullWidth>
                <Typography
                  sx={{
                    color: "black",
                    textAlign: "left",
                    paddingBottom: 1,
                    fontWeight: "700",
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <span>
                    Email address <span style={{ color: "red" }}>*</span>
                  </span>{" "}
                  <span
                    style={{ fontSize: "14px", fontWeight: 0, opacity: 0.3 }}
                  >
                    (Example: abc123@example.com)
                  </span>
                </Typography>
                <Input
                  id="username"
                  type="email"
                  placeholder="Email Address"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  disableUnderline
                  sx={{
                    border: "1px solid #030ce9",
                    borderRadius: "30px",
                    padding: "8px 14px",
                    fontSize: "18px",
                    width: "100%",
                    boxSizing: "border-box",
                    backgroundColor: "#fff",
                    boxShadow: "0px 3px 6px rgba(0, 0, 0, 0.16)",
                    transition: "box-shadow 0.3s ease",
                    "&:hover": {
                      backgroundColor: "#F8F8F8",
                      boxShadow: "0px 3px 6px rgba(0, 0, 0, 0.24)",
                      animation: `glow 1.5s infinite`,
                    },
                    "&.Mui-focused": {
                      backgroundColor: "#F8F8F8",
                      boxShadow: "0px 3px 6px rgba(0, 0, 0, 0.32)",
                      animation: `glow 1.5s infinite`,
                      outline: "none",
                    },
                    "@keyframes glow": {
                      "0%": {
                        boxShadow: "0 0 3px #030ce9",
                      },
                      "50%": {
                        boxShadow: "0 0 5px #030ce9",
                      },
                      "100%": {
                        boxShadow: "0 0 3px #030ce9",
                      },
                    },
                  }}
                />
              </FormControl>

              <FormControl sx={{ mb: 3 }} fullWidth>
                <Typography
                  sx={{
                    color: "black",
                    textAlign: "left",
                    paddingBottom: 1,
                    fontWeight: "700",
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <span>
                    Password <span style={{ color: "red" }}>*</span>
                  </span>{" "}
                  <span
                    style={{ fontSize: "14px", fontWeight: 0, opacity: 0.3 }}
                  >
                    (At least 8 characters)
                  </span>
                </Typography>
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disableUnderline
                  sx={{
                    border: "1px solid #030ce9",
                    borderRadius: "30px",
                    padding: "5px 14px",
                    fontSize: "18px",
                    width: "100%",
                    boxSizing: "border-box",
                    backgroundColor: "#fff",
                    boxShadow: "0px 3px 6px rgba(0, 0, 0, 0.16)",
                    transition: "box-shadow 0.3s ease",
                    "&:hover": {
                      backgroundColor: "#F8F8F8",
                      boxShadow: "0px 3px 6px rgba(0, 0, 0, 0.24)",
                      animation: `glow 1.5s infinite`,
                    },
                    "&.Mui-focused": {
                      backgroundColor: "#F8F8F8",
                      boxShadow: "0px 3px 6px rgba(0, 0, 0, 0.32)",
                      animation: `glow 1.5s infinite`,
                      outline: "none",
                    },
                    "@keyframes glow": {
                      "0%": {
                        boxShadow: "0 0 3px #030ce9",
                      },
                      "50%": {
                        boxShadow: "0 0 5px #030ce9",
                      },
                      "100%": {
                        boxShadow: "0 0 3px #030ce9",
                      },
                    },
                  }}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        color="primary"
                        onClick={passwordVisibility}
                        edge="end"
                      >
                        {showPassword ? <EyeOff /> : <Eye />}
                      </IconButton>
                    </InputAdornment>
                  }
                />
              </FormControl>

              <FormControl sx={{ mb: 3 }} fullWidth>
                <Typography
                  sx={{
                    color: "black",
                    textAlign: "left",
                    paddingBottom: 1,
                    fontWeight: "700",
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <span>
                    Confirm Password <span style={{ color: "red" }}>*</span>
                  </span>{" "}
                  <span
                    style={{ fontSize: "14px", fontWeight: 0, opacity: 0.3 }}
                  >
                    (Re-type your password)
                  </span>
                </Typography>
                <Input
                  id="confirmPassword"
                  type={showPassword ? "text" : "password"}
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disableUnderline
                  sx={{
                    border: "1px solid #030ce9",
                    borderRadius: "30px",
                    padding: "5px 14px",
                    fontSize: "18px",
                    width: "100%",
                    boxSizing: "border-box",
                    backgroundColor: "#fff",
                    boxShadow: "0px 3px 6px rgba(0, 0, 0, 0.16)",
                    transition: "box-shadow 0.3s ease",
                    "&:hover": {
                      backgroundColor: "#F8F8F8",
                      boxShadow: "0px 3px 6px rgba(0, 0, 0, 0.24)",
                      animation: `glow 1.5s infinite`,
                    },
                    "&.Mui-focused": {
                      backgroundColor: "#F8F8F8",
                      boxShadow: "0px 3px 6px rgba(0, 0, 0, 0.32)",
                      animation: `glow 1.5s infinite`,
                      outline: "none",
                    },
                    "@keyframes glow": {
                      "0%": {
                        boxShadow: "0 0 3px #030ce9",
                      },
                      "50%": {
                        boxShadow: "0 0 5px #030ce9",
                      },
                      "100%": {
                        boxShadow: "0 0 3px #030ce9",
                      },
                    },
                  }}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        color="primary"
                        onClick={passwordVisibility}
                        edge="end"
                      >
                        {showPassword ? <EyeOff /> : <Eye />}
                      </IconButton>
                    </InputAdornment>
                  }
                />
              </FormControl>

              <div style={{ textAlign: "center", marginTop: "1rem" }}>
                <Button
                  variant="contained"
                  type="submit"
                  sx={{
                    backgroundColor: "white",
                    color: "#030ce9",
                    borderRadius: "30px",
                    fontWeight: "bold",
                    fontSize: 16,
                    width: "15vw",
                    transition:
                      "background-color 0.4s ease-in-out, color 0.4s ease-in-out, border 0.3s ease-in-out",
                    border: "2px solid #030ce9",
                    "&:hover": {
                      backgroundColor: "#030ce9",
                      color: "white",
                      border: "2px solid black",
                    },
                  }}
                >
                  Create Account
                </Button>
                <div
                  style={{
                    marginTop: "1rem",
                    color: "black",
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "center",
                    fontSize: "14px",
                  }}
                >
                  Already have an account?{" "}
                  <Typography
                    onClick={() => (
                      navigate("/signin"),
                      window.scrollTo({
                        top: 0,
                        behavior: "instant",
                      })
                    )}
                    sx={{
                      color: "black",
                      fontWeight: "bold",
                      cursor: "pointer",
                      transition:
                        "color 0.3s ease-in-out, scale 0.3s ease-in-out",
                      paddingLeft: "10px",
                      "&:hover": {
                        color: "#030ce9",
                        scale: "1.08",
                      },
                    }}
                  >
                    Sign in now
                  </Typography>
                </div>
              </div>
            </form>
          </div>
        </Box>
      </div>
    </div>
  );
};

export default Register;
