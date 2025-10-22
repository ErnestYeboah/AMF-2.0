import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { BASE_URL } from "./OtpRequestSlice";
import { toast } from "react-toastify";

export type Favorite = {
  id?: string;
  name: string;
  added_on: Date;
  category: string;
  product_id: number;
  price: number;
};

interface State {
  fetch_favorite_items_status: "idle" | "pending" | "success" | "failed";
  add_item_to_favorite_status: "idle" | "pending" | "success" | "failed";
  remove_item_from_favorite_status: "idle" | "pending" | "success" | "failed";
  favorites: Favorite[];
}

const initialState: State = {
  fetch_favorite_items_status: "idle",
  add_item_to_favorite_status: "idle",
  remove_item_from_favorite_status: "idle",
  favorites: [],
};

type Payload = {
  token: string;
  favoriteData: Favorite;
};
export const addToFavoriteApi: any = createAsyncThunk(
  "add_to_favorite",
  async (payload: Payload) => {
    const { token, favoriteData } = payload;
    const response = await axios.post(`${BASE_URL}/favorite/`, favoriteData, {
      headers: {
        Authorization: `Token ${token}`,
        "Content-Type": "application/json",
      },
    });

    return response.data;
  }
);

export const fetchFavoriteItems: any = createAsyncThunk(
  "fetch_favorite",
  async (token: string) => {
    const response = await axios.get(`${BASE_URL}/favorite/`, {
      headers: {
        Authorization: `Token ${token}`,
      },
    });

    console.log(response.data);
    return response.data;
  }
);

type RemovePayload = {
  id: string;
  token: string;
};
export const removeFromFavorite: any = createAsyncThunk(
  "remove_item",
  async (payload: RemovePayload) => {
    const { id, token } = payload;

    if (id) {
      const response = await axios.delete(`${BASE_URL}/favorite/${id}/`, {
        headers: {
          Authorization: `Token ${token}`,
        },
      });

      return { id: id, data: response.data };
    }
  }
);

function showToast(message: string, status: "error" | "success") {
  if (status === "error") {
    toast.error(message, { hideProgressBar: true });
  } else {
    toast.success(message, { hideProgressBar: true });
  }
}

export const FavoriteApiSlice = createSlice({
  name: "favorite",
  initialState,
  reducers: {
    clearFavoriteWhenSignedOut(state) {
      state.favorites = [];
    },
  },
  extraReducers(builder) {
    builder
      // adding to favorite
      .addCase(addToFavoriteApi.pending, (state) => {
        state.add_item_to_favorite_status = "pending";
      })
      .addCase(addToFavoriteApi.fulfilled, (state, action) => {
        state.add_item_to_favorite_status = "success";
        state.favorites.push(action.payload);
        showToast("added to favorite successfully", "success");
      })
      .addCase(addToFavoriteApi.rejected, (state) => {
        state.add_item_to_favorite_status = "failed";
        showToast(
          "something happened ,either item already exist or check your internet connection ",
          "error"
        );
      })
      //   fetching favorite items
      .addCase(fetchFavoriteItems.pending, (state) => {
        state.fetch_favorite_items_status = "pending";
      })
      .addCase(fetchFavoriteItems.fulfilled, (state, action) => {
        state.fetch_favorite_items_status = "success";
        state.favorites = action.payload;
      })
      .addCase(fetchFavoriteItems.rejected, (state) => {
        state.fetch_favorite_items_status = "failed";
        showToast(
          "something happened ,could not fetch items in favorite",
          "error"
        );
      })

      //   remove favorite items
      .addCase(removeFromFavorite.pending, (state) => {
        state.remove_item_from_favorite_status = "pending";
      })
      .addCase(removeFromFavorite.fulfilled, (state, action) => {
        state.remove_item_from_favorite_status = "success";
        const foundDeletedItemIndex = state.favorites.findIndex(
          (item) => item.id === action.payload.id
        );
        state.favorites.splice(foundDeletedItemIndex, 1);
        showToast("item has been removed from favorite", "success");
      })
      .addCase(removeFromFavorite.rejected, (state) => {
        state.remove_item_from_favorite_status = "failed";
        showToast(
          "something happened ,could not remove item , check your network and try again",
          "error"
        );
      });
  },
});

export default FavoriteApiSlice.reducer;
export const favoriteApiData = (state: { favorite: State }) => state.favorite;
export const { clearFavoriteWhenSignedOut } = FavoriteApiSlice.actions;
