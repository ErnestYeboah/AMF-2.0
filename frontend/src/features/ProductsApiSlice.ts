import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { BASE_URL } from "./OtpRequestSlice";
import { toast } from "react-toastify";

export type Product = {
  brief_note: string;
  category: string;
  description: string;
  image: string;
  is_available: boolean;
  name: string;
  old_price: number;
  price: number;
};

interface User {
  id: string;
  email: string;
  profile_image: string;
}

interface State {
  fetch_product_status: "idle" | "pending" | "success" | "failed";
  search_by_category_status: "idle" | "pending" | "success" | "failed";
  get_user_profile_status: "idle" | "pending" | "success" | "failed";
  update_user_profile_image_status: "idle" | "pending" | "success" | "failed";
  products: Product[];
  userProfile: User[];
  categoryProducts: Product[];
  profileModalState: "hidden" | "visible";
}

export const getUserProfile: any = createAsyncThunk(
  "user_profile",
  async (token: string) => {
    if (token) {
      const response = await axios.get(`${BASE_URL}/me/`, {
        headers: {
          Authorization: `Token ${token}`,
          "Content-Type": "application/json",
        },
      });

      return response.data;
    }
  }
);
export const updateProfileImage: any = createAsyncThunk(
  "update_user_profile",
  async (payload: { id: string; token: string; profile_image: string }) => {
    const { token, profile_image, id } = payload;
    if (id) {
      const response = await axios.patch(
        `${BASE_URL}/me/${id}/`,
        { profile_image: profile_image },
        {
          headers: {
            Authorization: `Token ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return response.data;
    }
  }
);

export const fetchProducts: any = createAsyncThunk(
  "fetch_products",
  async () => {
    const response = await axios.get(`${BASE_URL}/products/`);

    return response.data;
  }
);

export const searchByCategory: any = createAsyncThunk(
  "search_category",
  async (params: string) => {
    if (params) {
      const response = await axios.get(
        `${BASE_URL}/products?category=${params}`
      );
      return response.data;
    }
  }
);

const initialState: State = {
  fetch_product_status: "idle",
  search_by_category_status: "idle",
  get_user_profile_status: "idle",
  update_user_profile_image_status: "idle",
  products: [],
  userProfile: [],
  categoryProducts: [],
  profileModalState: "hidden",
};

export const ProductApiSlice = createSlice({
  name: "product_api",
  initialState,
  reducers: {
    toggleProfileModal(state, action: { payload: "visible" | "hidden" }) {
      state.profileModalState = action.payload;
    },
  },
  extraReducers(builder) {
    builder
      // get user profile of authenticated user
      .addCase(getUserProfile.pending, (state) => {
        state.get_user_profile_status = "pending";
      })
      .addCase(getUserProfile.fulfilled, (state, action) => {
        state.get_user_profile_status = "success";
        state.userProfile = action.payload;
      })
      .addCase(getUserProfile.rejected, (state) => {
        state.get_user_profile_status = "failed";
      })

      //   updating profile image
      .addCase(updateProfileImage.pending, (state) => {
        state.get_user_profile_status = "pending";
      })
      .addCase(updateProfileImage.fulfilled, (state, action) => {
        state.update_user_profile_image_status = "success";
        state.userProfile[0].profile_image = action.payload.profile_image;
      })
      .addCase(updateProfileImage.rejected, (state) => {
        state.update_user_profile_image_status = "failed";
        toast.error("Couldn't set profile image , try again later");
      })

      //   fetching products data
      .addCase(fetchProducts.pending, (state) => {
        state.fetch_product_status = "pending";
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.fetch_product_status = "success";
        state.products = action.payload;
      })
      .addCase(fetchProducts.rejected, (state) => {
        state.fetch_product_status = "failed";
        toast.error(
          "unable to fetch products , check your internet connection",
          { hideProgressBar: true }
        );
      })

      //   search by category
      .addCase(searchByCategory.pending, (state) => {
        state.search_by_category_status = "pending";
      })
      .addCase(searchByCategory.fulfilled, (state, action) => {
        state.search_by_category_status = "success";
        state.categoryProducts = action.payload;
      })
      .addCase(searchByCategory.rejected, (state) => {
        state.search_by_category_status = "failed";
        toast.error(
          "unable to fetch products , check your internet connection",
          { hideProgressBar: true }
        );
      });
  },
});

export default ProductApiSlice.reducer;
export const { toggleProfileModal } = ProductApiSlice.actions;
export const product_data = (state: { product_api: State }) =>
  state.product_api;
