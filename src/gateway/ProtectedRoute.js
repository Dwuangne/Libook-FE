import { jwtDecode } from "jwt-decode"; // Sử dụng named export
import { Navigate, Outlet } from "react-router-dom";
import { toast } from "react-toastify";

export default function ProtectedRoute({ allowedRole }) {
  const accessToken = localStorage.getItem("accessToken");
  const decodedAccessToken = accessToken ? jwtDecode(accessToken) : null;
  const role = decodedAccessToken
    ? decodedAccessToken[
        "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
      ]
    : null;

  if (!accessToken) {
    toast.warn("Please login to access this feature", { autoClose: 1500 });
    return <Navigate to="/signin" />;
  }
  return allowedRole === role ? (
    <Outlet />
  ) : role === "Admin" ? (
    <Navigate to="/admin" />
  ) : role === "Customer" ? (
    <Navigate to="/" />
  ) : (
    <Navigate to="/signin" />
  );
}
