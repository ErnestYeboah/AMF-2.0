import { Route, Routes, useLocation } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SendOtpRequest from "./components/otpRequest/send_otp_request";
import VerifyOtpRequest from "./components/otpRequest/VerifyOtpRequest";
import PasswordSet from "./components/otpRequest/PasswordSet";
import Signin from "./components/auth/Signin";
import { useCookies } from "react-cookie";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts, product_data } from "./features/ProductsApiSlice";
import AllProducts from "./components/ProductPage/AllProducts";
import Navbar from "./components/Navbar/Navbar";
import CategoryProductPage from "./components/ProductPage/CategoryProductPage";
import Box from "@mui/material/Box";
import LinearProgress from "@mui/material/LinearProgress";
import DetailedProductCard from "./components/ProductPage/DetailedProductCard";

function App() {
  const dispatch = useDispatch();
  const location = useLocation();
  const {
    update_user_profile_image_status,
    get_user_profile_status,
    fetch_product_status,
    search_by_category_status,
  } = useSelector(product_data);

  const [, , removeCookie] = useCookies(["generatedUrlToken"]);
  useEffect(() => {
    // If not on /signin, remove the cookie
    if (location.pathname == "/signin") {
      removeCookie("generatedUrlToken", { path: "/" });
    }
  }, [location.pathname]); // run every time route changes

  useEffect(() => {
    dispatch(fetchProducts());
  }, []);

  return (
    <>
      {/* check if an operation is pending or loading then show the progress bar */}
      {update_user_profile_image_status === "pending" ||
        get_user_profile_status == "pending" ||
        search_by_category_status == "pending" ||
        (fetch_product_status === "pending" && (
          <Box sx={{ width: "100%" }}>
            <LinearProgress />
          </Box>
        ))}
      {/* end of progress bar */}

      {/* check if user is logged in */}

      <ToastContainer />
      <Navbar />
      <Routes>
        <Route path="/products" element={<AllProducts />} />
        <Route path={`/:token/identification`} element={<SendOtpRequest />} />
        <Route path="/:token/verify_otp" element={<VerifyOtpRequest />} />
        <Route path="/:token/set_password" element={<PasswordSet />} />
        <Route path="/signin" element={<Signin />} />
        <Route
          path="/products/category/:category"
          element={<CategoryProductPage />}
        />
        <Route
          path="/product/:product_name"
          element={<DetailedProductCard />}
        />
      </Routes>
    </>
  );
}

export default App;
