import React, { useState } from "react";
import { toast } from "react-toastify";
import { loginApi } from "../../api/UserApi";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";

//UI
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import Input from "@mui/material/Input";
import IconButton from "@mui/material/IconButton";
import Eye from "@mui/icons-material/Visibility";
import EyeOff from "@mui/icons-material/VisibilityOff";
import { Box, CircularProgress, Typography } from "@mui/material";

const Login = () => {
  window.document.tiltle = "Sign In";
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const passwordVisibility = () => {
    setShowPassword(!showPassword);
  };

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

    loginApi(username, password)
      .then((res) => {
        const accessToken = res?.data?.data;
        console.log(accessToken);
        const decodedAccessToken = jwtDecode(accessToken.jwtToken);
        console.log(decodedAccessToken);
        const username = decodedAccessToken?.username;
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("username", username);

        console.log("Sign In Successfully", res);
        toast.success("Login successfully", { autoClose: 1500 });

        setTimeout(() => {
          setLoading(true);
        }, 2000);
        setTimeout(() => {
          console.log("Decoded Access Token", decodedAccessToken);
          console.log("Login success", res);
          const role = decodedAccessToken["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
          console.log("Role:", role);

          if (role === "admin") {
              navigate("/admin");
          } else if (role === "Customer") {
              navigate("/");
          } else {
              navigate("/signin");
          }
          
        }, 5000);
      })
      .catch((err) => {
        console.error("Sign In Failed", err);
        const errorMessage = err.response?.data || "Sign In Failed.";
        toast.error(errorMessage, { autoClose: 1500 });
        setLoading(false);
      });
  };

  return (
    <div style={{ marginTop: "1rem" }}>
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
          <CircularProgress sx={{ color: "#ff469e" }} size={90} />
        </Box>
      ) : (
        <div
          style={{
            // backgroundImage:
            //     "url('https://png.pngtree.com/thumb_back/fh260/background/20190221/ourmid/pngtree-simple-cartoon-childlike-mother-and-baby-image_11542.jpg')",
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
                from: {
                  transform: "translateX(-50%)",
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
                  Sign In{" "}
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
                    type="username"
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

                {/* <Typography sx={{textAlign: "left", "&:hover":{color: "#ff469e", cursor: "pointer"}}}>Forgot Password?</Typography> */}

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
