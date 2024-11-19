import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { loginApi, loginGoogleApi } from "../../api/UserApi";
import { jwtDecode } from "jwt-decode";

import { useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";

//Redux
import { useDispatch, useSelector } from "react-redux";
import { login } from "../../redux/AuthSlice"; // Import Redux slice

// UI Components
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import Input from "@mui/material/Input";
import IconButton from "@mui/material/IconButton";
import Eye from "@mui/icons-material/Visibility";
import EyeOff from "@mui/icons-material/VisibilityOff";
import Divider from "@mui/material/Divider";
import { Box, CircularProgress, Typography } from "@mui/material";

const Login = () => {
  window.document.title = "Sign In";

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const dispatch = useDispatch();
  const { isLoggedIn, user } = useSelector((state) => state.auth);

  const passwordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Điều hướng khi đã đăng nhập
  useEffect(() => {
    if (isLoggedIn) {
      if (user.role === "Admin") {
        navigate("/admin");
      } else if (user.role === "Customer") {
        navigate("/");
      }
    }
  }, [isLoggedIn, user, navigate]);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!username) {
      toast.error("The username is required", { autoClose: 1500 });
      return;
    }
    if (!password) {
      toast.error("The password is required", { autoClose: 1500 });
      return;
    }

    setLoading(true);
    loginApi(username, password)
      .then((res) => {
        const accessToken = res?.data?.data?.jwtToken;
        const decodedToken = jwtDecode(accessToken);

        // Dispatch Redux action để cập nhật trạng thái đăng nhập
        dispatch(
          login({
            token: accessToken,
            username:
              decodedToken[
                "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"
              ],
            role: decodedToken[
              "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
            ],
          })
        );

        toast.success("Login successfully", { autoClose: 1500 });
      })
      .catch((err) => {
        console.error("Sign In Failed", err);
        const errorMessage = err.response?.data || "Sign In Failed.";
        toast.error(errorMessage, { autoClose: 1500 });
      })
      .finally(() => setLoading(false));
  };

  const handleGoogleLogin = (token) => {
    setLoading(true);
    loginGoogleApi(token)
      .then((res) => {
        const accessToken = res?.data?.data?.jwtToken;
        const decodedToken = jwtDecode(accessToken);

        // Dispatch Redux action để cập nhật trạng thái đăng nhập
        dispatch(
          login({
            token: accessToken,
            username:
              decodedToken[
                "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"
              ],
            role: decodedToken[
              "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
            ],
          })
        );

        toast.success("Google Login successfully", { autoClose: 1500 });
      })
      .catch((err) => {
        console.error("Google Login Failed", err);
        const errorMessage = err.response?.data || "Google Sign In Failed.";
        toast.error(errorMessage, { autoClose: 1500 });
      })
      .finally(() => setLoading(false));
  };

  return (
    <div style={{ marginTop: "3rem" }}>
      {loading ? (
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
          <CircularProgress sx={{ color: "#003ce9" }} size={90} />
        </Box>
      ) : (
        <div
          style={{
            height: "85vh",
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
            backgroundPosition: "center",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Box
            sx={{
              width: "50%",
              animation: "slideLogin 1s ease-in-out",
              "@keyframes slideLogin": {
                from: { transform: "translateX(-50%)" },
                to: { transform: "translateX(0)" },
              },
            }}
          >
            <div
              style={{
                backgroundColor: "#ffffff",
                borderRadius: "10px",
                padding: "4%",
                boxShadow: "0 2rem 3rem rgba(132, 139, 200, 0.25)",
                border: "3px solid #030ce9",
              }}
            >
              <div style={{ textAlign: "center", marginBottom: "2rem" }}>
                <h1
                  style={{
                    color: "black",
                    fontSize: "2.5em",
                    fontWeight: "700",
                  }}
                >
                  Sign In
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
                    }}
                  >
                    Username
                  </Typography>
                  <Input
                    id="username"
                    type="text"
                    placeholder="Username"
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
                    }}
                  >
                    Password
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
                      <IconButton
                        sx={{ color: "#030ce9" }}
                        onClick={passwordVisibility}
                        edge="end"
                      >
                        {showPassword ? <EyeOff /> : <Eye />}
                      </IconButton>
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
                      fontSize: 16,
                      fontWeight: "bold",
                      width: "10vw",
                      marginBottom: "1rem",
                      transition:
                        "background-color 0.4s ease-in-out, color 0.4s ease-in-out, border 0.3s ease-in-out",
                      border: "2px solid #030CE9 ",
                      "&:hover": {
                        backgroundColor: "#030ce9",
                        color: "white",
                        border: "2px solid black",
                      },
                    }}
                  >
                    Login
                  </Button>
                  <Divider sx={{ my: 3 }}>or</Divider>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      width: "100%", // Chiếm toàn bộ chiều rộng của container cha
                      marginTop: "1rem", // Cách phía trên một khoảng
                    }}
                  >
                    <GoogleLogin
                      onSuccess={(response) =>
                        handleGoogleLogin(response.credential)
                      }
                      onError={() => {
                        console.log("Login Failed");
                      }} // Thay bằng toast báo lỗi
                      style={{
                        borderRadius: "30px",
                        border: "2px solid #030CE9",
                      }}
                    />
                  </Box>
                  <div
                    style={{
                      marginTop: "1rem",
                      color: "black",
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "center",
                    }}
                  >
                    Don't have an account?
                    <Typography
                      onClick={() => (
                        navigate("/signup"),
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
                          color: "#030CE9",
                          scale: "1.08",
                        },
                      }}
                    >
                      Sign up now
                    </Typography>
                  </div>
                </div>
              </form>
            </div>
          </Box>
        </div>
      )}
    </div>
  );
};

export default Login;
