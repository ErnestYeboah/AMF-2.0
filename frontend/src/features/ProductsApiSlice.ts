import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { BASE_URL } from "./OtpRequestSlice";
import { toast } from "react-toastify";

export type History = {
  id: number;
  product_id: number;
  product_name: string;
};

export type Product = {
  id: number;
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
  search_by_name_status: "idle" | "pending" | "success" | "failed";
  get_user_profile_status: "idle" | "pending" | "success" | "failed";
  update_user_profile_image_status: "idle" | "pending" | "success" | "failed";
  get_history_list_status: "idle" | "pending" | "success" | "failed";
  delete_account_status: "idle" | "pending" | "success" | "failed";
  products: Product[];
  userProfile: User[];
  categoryProducts: Product[];
  searchedProducts: Product[];
  profileModalState: "hidden" | "visible";
  clothing_size: string;
  shoe_size: string;
  search_value: string;
  history: History[];
  deleteAccountModalView: boolean;
  currentView: number;
}

const initialState: State = {
  fetch_product_status: "idle",
  search_by_category_status: "idle",
  search_by_name_status: "idle",
  get_user_profile_status: "idle",
  update_user_profile_image_status: "idle",
  get_history_list_status: "idle",
  delete_account_status: "idle",
  products: [],
  searchedProducts: [],
  userProfile: [],
  categoryProducts: [],
  profileModalState: "hidden",
  clothing_size: "",
  shoe_size: "",
  search_value: "",
  history: [],
  deleteAccountModalView: false,
  currentView: 0,
};

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

export const deleteUserAccount: any = createAsyncThunk(
  "delete_account",
  async (payload: { token: string; id: string }) => {
    const { id, token } = payload;
    if (token) {
      const response = await axios.delete(`${BASE_URL}/users/${id}/`, {
        headers: {
          Authorization: `Token ${token}`,
        },
      });

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

export const searchByName: any = createAsyncThunk(
  "search_name",
  async (payload: string) => {
    if (payload) {
      const response = await axios.get(
        `${BASE_URL}/products?search=${payload}`,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      return response.data;
    }
  }
);

export const getHistoryList: any = createAsyncThunk(
  "get_history",
  async (token: string) => {
    if (token) {
      const response = await axios.get(`${BASE_URL}/history/`, {
        headers: {
          Authorization: `Token ${token}`,
        },
      });

      return response.data;
    }
  }
);

type HistoryPayload = {
  token: string;
  values: { product_id: string; product_name: string };
};
export const updateHistoryList: any = createAsyncThunk(
  "update_history_list",
  async (payload: HistoryPayload) => {
    const { token, values } = payload;
    if (token) {
      const response = await axios.post(`${BASE_URL}/history/`, values, {
        headers: {
          Authorization: `Token ${token}`,
          "Content-Type": "application/json",
        },
      });
      return response.data;
    }
  }
);

export const ProductApiSlice = createSlice({
  name: "product_api",
  initialState,
  reducers: {
    getClothingSize(state, action) {
      state.clothing_size = action.payload;
    },
    getShoeSize(state, action) {
      state.shoe_size = action.payload;
    },
    toggleProfileModal(state, action: { payload: "visible" | "hidden" }) {
      state.profileModalState = action.payload;
    },
    getSearchValue(state, action) {
      state.search_value = action.payload;
    },

    toggleDeleteAccountModalView(state, action) {
      state.deleteAccountModalView = action.payload;
      state.currentView = 0;
    },

    slideToConfirmDeleteModal(state) {
      state.currentView = 1;
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
        state.update_user_profile_image_status = "pending";
      })
      .addCase(updateProfileImage.fulfilled, (state, action) => {
        state.update_user_profile_image_status = "success";
        state.userProfile[0].profile_image = action.payload.profile_image;
      })
      .addCase(updateProfileImage.rejected, (state) => {
        state.update_user_profile_image_status = "failed";
        toast.error("Couldn't set profile image , try again later");
      })

      //   delete user account
      .addCase(deleteUserAccount.pending, (state) => {
        state.delete_account_status = "pending";
      })
      .addCase(deleteUserAccount.fulfilled, (state) => {
        state.delete_account_status = "success";
        toast.success("Account has been deleted", { hideProgressBar: true });
        state.userProfile = [];
      })
      .addCase(deleteUserAccount.rejected, (state) => {
        state.delete_account_status = "failed";
        toast.error("Couldn't delete account  , try again later");
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
      })

      //   search by item name
      .addCase(searchByName.pending, (state) => {
        state.search_by_name_status = "pending";
      })
      .addCase(searchByName.fulfilled, (state, action) => {
        state.search_by_name_status = "success";
        state.searchedProducts = action.payload;
      })
      .addCase(searchByName.rejected, (state) => {
        state.search_by_name_status = "failed";
      })

      //   get history list
      .addCase(getHistoryList.pending, (state) => {
        state.get_history_list_status = "pending";
      })
      .addCase(getHistoryList.fulfilled, (state, action) => {
        state.get_history_list_status = "success";
        state.history = action.payload;
      })
      .addCase(getHistoryList.rejected, (state) => {
        state.get_history_list_status = "failed";
      })

      //   update history list
      .addCase(updateHistoryList.pending, (state) => {
        state.get_history_list_status = "pending";
      })
      .addCase(updateHistoryList.fulfilled, (state, action) => {
        state.history.push(action.payload);
      })
      .addCase(updateHistoryList.rejected, (state) => {
        state.get_history_list_status = "failed";
      });
  },
});

export default ProductApiSlice.reducer;
export const {
  toggleProfileModal,
  getClothingSize,
  getShoeSize,
  getSearchValue,
  toggleDeleteAccountModalView,
  slideToConfirmDeleteModal,
} = ProductApiSlice.actions;

export const product_data = (state: { product_api: State }) =>
  state.product_api;
