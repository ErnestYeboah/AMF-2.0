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
import CartHome from "./components/Cart/CartHome";
import { cartApiData, fetchCartData } from "./features/CartSlice";
import FavoriteHome from "./components/Favorite/FavoriteHome";
import { favoriteApiData, fetchFavoriteItems } from "./features/FavoriteSlice";
import FoundSearchedItemPage from "./components/ProductPage/FoundSearchedItemPage";

function App() {
  const dispatch = useDispatch();
  const location = useLocation();
  const [cookie] = useCookies(["token"]);

  // product data slice
  const {
    update_user_profile_image_status,
    get_user_profile_status,
    fetch_product_status,
    search_by_category_status,
  } = useSelector(product_data);

  // favorite data slice
  const { add_item_to_favorite_status, fetch_favorite_items_status } =
    useSelector(favoriteApiData);

  // cart data slice
  const { add_to_cart_status, fetch_data_status } = useSelector(cartApiData);

  const [, , removeCookie] = useCookies(["generatedUrlToken"]);

  useEffect(() => {
    // If not on /signin, remove the cookie
    if (location.pathname == "/signin") {
      removeCookie("generatedUrlToken", { path: "/" });
    }
  }, [location.pathname]); // run every time route changes

  // get all products here to prevent uneccsary rendering
  useEffect(() => {
    dispatch(fetchProducts());
  }, []);

  // get all favorite if logged in
  useEffect(() => {
    if (cookie["token"]) {
      dispatch(fetchFavoriteItems(cookie["token"]));
    }
  }, [cookie]);

  // get cart data if  logged in
  useEffect(() => {
    if (cookie["token"]) {
      dispatch(fetchCartData(cookie["token"]));
    }
  }, [cookie["token"]]);

  return (
    <>
      {/* check if an operation is pending or loading then show the progress bar */}
      {update_user_profile_image_status === "pending" ||
        get_user_profile_status == "pending" ||
        search_by_category_status == "pending" ||
        fetch_data_status === "pending" ||
        fetch_favorite_items_status === "pending" ||
        add_item_to_favorite_status === "pending" ||
        add_to_cart_status === "pending" ||
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
        <Route path="/favorite" element={<FavoriteHome />} />
        <Route
          path="/products/category/:category"
          element={<CategoryProductPage />}
        />
        <Route
          path="/product/:product_name"
          element={<DetailedProductCard />}
        />
        <Route path="/cart" element={<CartHome />} />
        <Route
          path="/products/search/:name"
          element={<FoundSearchedItemPage />}
        />
      </Routes>
    </>
  );
}

export default App;
