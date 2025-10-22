import { configureStore } from "@reduxjs/toolkit";
import OtpRequestApiReducer from "../features/OtpRequestSlice";
import SignInReducer from "../features/SigninSlice";
import ProductApiReducer from "../features/ProductsApiSlice";
import CartApiReducer from "../features/CartSlice";
import FavoriteApiReducer from "../features/FavoriteSlice";
export const store = configureStore({
  reducer: {
    otp_request_api: OtpRequestApiReducer,
    signin: SignInReducer,
    product_api: ProductApiReducer,
    cart: CartApiReducer,
    favorite: FavoriteApiReducer,
  },
});
