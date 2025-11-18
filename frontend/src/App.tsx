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
import {
  fetchProducts,
  getHistoryList,
  product_data,
} from "./features/ProductsApiSlice";
import AllProducts from "./components/ProductPage/AllProducts";
import Navbar from "./components/Navbar/Navbar";
import CategoryProductPage from "./components/ProductPage/CategoryProductPage";
import Box from "@mui/material/Box";
import LinearProgress from "@mui/material/LinearProgress";
import DetailedProductCard from "./components/ProductPage/DetailedProductCard";
import CartHome from "./components/Cart/CartHome";
import {
  cartApiData,
  clearApiCart,
  clearLocalCart,
  fetchCartData,
  fetchRegions,
  getCurentUserAddress,
  saveToCart,
} from "./features/CartSlice";
import FavoriteHome from "./components/Favorite/FavoriteHome";
import { favoriteApiData, fetchFavoriteItems } from "./features/FavoriteSlice";
import FoundSearchedItemPage from "./components/ProductPage/FoundSearchedItemPage";
import Homepage from "./components/Home/Homepage";
import Footer from "./components/Home/Footer";
import CheckoutAddress from "./components/Cart/CheckoutAddress";
import ConfirmOrder from "./components/Cart/ConfirmOrder";
import MyAccount from "./components/auth/MyAccount";
import AddressBook from "./components/auth/AddressBook";
import History from "./components/ProductPage/History";
import AccountSettings from "./components/auth/AccountSettings";
import VerifyPasswordChangeOtp from "./components/otpRequest/VerifyPasswordChangeOtp";
import PasswordReset from "./components/otpRequest/PasswordReset";
import CheckoutSuccessPage from "./components/Cart/CheckoutSuccessPage";

function App() {
  const dispatch = useDispatch();
  const location = useLocation();
  const [cookie] = useCookies(["token"]);
  const { localCart, checkoutConfirmed } = useSelector(cartApiData);

  // product data slice
  const { update_user_profile_image_status, get_user_profile_status } =
    useSelector(product_data);

  // favorite data slice
  const { add_item_to_favorite_status } = useSelector(favoriteApiData);

  // cart data slice
  const { add_to_cart_status } = useSelector(cartApiData);

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

  // add to user's cart when logged in
  useEffect(() => {
    if (cookie["token"]) {
      if (localCart.length > 0) {
        localCart.map((item) =>
          dispatch(saveToCart({ token: cookie["token"], productData: item }))
        );
      }
    }
  }, [localCart, cookie]);

  // get cart data if  logged in
  useEffect(() => {
    if (cookie["token"]) {
      dispatch(fetchCartData(cookie["token"]));
      dispatch(clearLocalCart());
    }
  }, [cookie["token"]]);

  // get regions data , cities data and the user's address info if the user already has
  useEffect(() => {
    if (cookie["token"]) {
      dispatch(getCurentUserAddress(cookie["token"]));
      dispatch(fetchRegions(cookie["token"]));
    }
  }, [cookie]);

  useEffect(() => {
    if (cookie["token"]) {
      dispatch(getHistoryList(cookie["token"]));
    }
  }, [cookie]);

  useEffect(() => {
    if (checkoutConfirmed) {
      dispatch(clearApiCart(cookie["token"]));
    }
  }, [checkoutConfirmed, cookie]);

  return (
    <>
      {checkoutConfirmed && <CheckoutSuccessPage />}
      {/* check if an operation is pending or loading then show the progress bar */}
      {update_user_profile_image_status === "pending" ||
        get_user_profile_status == "pending" ||
        add_item_to_favorite_status === "pending" ||
        (add_to_cart_status === "pending" && (
          <Box sx={{ width: "100%" }}>
            <LinearProgress />
          </Box>
        ))}
      {/* end of progress bar */}

      {/* check if user is logged in */}

      <ToastContainer />
      {location.pathname !== "/checkout_address" && <Navbar />}
      <Routes>
        <Route path="/" element={<Homepage />} />
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
        <Route path="/checkout_address" element={<CheckoutAddress />} />
        <Route path="/confirm_order" element={<ConfirmOrder />} />
        <Route path="/my_account" element={<MyAccount />} />
        <Route path="/address" element={<AddressBook />} />
        <Route path="/history" element={<History />} />
        <Route path="/account_settings/:token" element={<AccountSettings />} />
        <Route
          path="/reset_password_verification/:token"
          element={<VerifyPasswordChangeOtp />}
        />
        <Route path="/reset_password/:token" element={<PasswordReset />} />
      </Routes>
      {location.pathname !== "/confirm_order" && <Footer />}
    </>
  );
}

export default App;
