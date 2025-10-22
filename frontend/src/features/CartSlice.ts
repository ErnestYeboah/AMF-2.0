import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { BASE_URL } from "./OtpRequestSlice";
import { toast } from "react-toastify";

export type Cart = {
  id: number;
  product_id: number;
  name: string;
  category: string;
  size: string;
  quantity: number;
  price: number;
  total_price: string;
};

export type LocalCartState = {
  image: string | undefined;
  id: string;
  name: string | undefined;
  product_id: number | undefined;
  category: string | undefined;
  size: string;
  price: number | undefined;
  old_price: number | undefined;
  quantity: number;
  total_price: number;
};

// get local cart
function loadLocalCart() {
  try {
    const savedCart = localStorage.getItem("cart");
    return savedCart ? JSON.parse(savedCart) : [];
  } catch (e) {
    console.log(e);
  }
}

function saveToLocalCart(cart: LocalCartState[]) {
  localStorage.setItem("cart", JSON.stringify(cart));
}

interface State {
  add_to_cart_status: "idle" | "pending" | "success" | "failed";
  fetch_data_status: "idle" | "pending" | "success" | "failed";
  update_item_quantity_status: "idle" | "pending" | "success" | "failed";
  remove_item_from_cart_status: "idle" | "pending" | "success" | "failed";
  cart: Cart[];
  localCart: LocalCartState[];
}

const initialState: State = {
  add_to_cart_status: "idle",
  fetch_data_status: "idle",
  update_item_quantity_status: "idle",
  remove_item_from_cart_status: "idle",
  cart: [],
  localCart: loadLocalCart(),
};

type Payload = {
  productData: Cart;
  token: string;
};

export const saveToCart: any = createAsyncThunk(
  "save_to_cart",
  async (payload: Payload) => {
    const { token, productData } = payload;
    const response = await axios.post(`${BASE_URL}/cart/`, productData, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${token}`,
      },
    });

    return response.data;
  }
);

export const fetchCartData: any = createAsyncThunk(
  "fetch_cart",
  async (token: string) => {
    if (token) {
      const response = await axios.get(`${BASE_URL}/cart/`, {
        headers: {
          Authorization: `Token ${token}`,
          "Content-Type": "application/json",
        },
      });

      return response.data;
    }
  }
);

type ItemPayload = {
  token: string;
  id: number;
  quantity: string;
};
export const updateItemQuantity: any = createAsyncThunk(
  "update_quantity",
  async (payload: ItemPayload) => {
    const { id, token, quantity } = payload;
    if (id) {
      const response = await axios.patch(
        `${BASE_URL}/cart/${id}/`,
        { quantity: quantity },
        {
          headers: {
            Authorization: `Token ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log(response.data);
      return response.data;
    }
  }
);

export const removeFromCart: any = createAsyncThunk(
  "remove_from_cart",
  async (payload: { id: string; token: string }) => {
    const { id, token } = payload;
    if (id) {
      const response = await axios.delete(`${BASE_URL}/cart/${id}/`, {
        headers: {
          Authorization: `Token ${token}`,
        },
      });

      return { data: response.data, id: id };
    }
  }
);

type Status = "error" | "success";
function showToast(status: Status, message: string) {
  return status === "error"
    ? toast.error(message, { hideProgressBar: true })
    : toast.success(message, { hideProgressBar: true });
}

export const CartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    setCartEmptyIfLoggedOut(state) {
      state.cart = [];
    },

    addItemToLocalCart(state, action) {
      state.localCart.push(action.payload);
      saveToLocalCart(state.localCart);
      showToast("success", "item has been added to your cart");
    },

    removeFromLocalCart(state, action) {
      const itemToRemoveIndex = state.localCart.findIndex(
        (item) => item.id === action.payload
      );
      state.localCart.splice(itemToRemoveIndex, 1);
      saveToLocalCart(state.localCart);
      showToast("success", "item removed successfully");
    },

    updateItemQuantityFromLocalCart(state, action) {
      const itemToEditIndex = state.localCart.findIndex(
        (item) => item.id === action.payload.id
      );

      state.localCart.splice(itemToEditIndex, 1, action.payload);
      saveToLocalCart(state.localCart);
      showToast("success", "changes have been applied successfully");
    },
  },
  extraReducers(builder) {
    builder
      .addCase(saveToCart.pending, (state) => {
        state.add_to_cart_status = "pending";
      })
      .addCase(saveToCart.fulfilled, (state, action) => {
        state.add_to_cart_status = "success";
        state.cart.push(action.payload);
        toast.success("Item has been added to cart", { hideProgressBar: true });
      })
      .addCase(saveToCart.rejected, (state) => {
        state.add_to_cart_status = "failed";
        showToast("error", "something happened , could not add to cart");
      })
      // fetching cart data status
      .addCase(fetchCartData.pending, (state) => {
        state.fetch_data_status = "pending";
      })
      .addCase(fetchCartData.fulfilled, (state, action) => {
        state.fetch_data_status = "success";
        state.cart = action.payload;
      })
      .addCase(fetchCartData.rejected, (state) => {
        state.fetch_data_status = "failed";
        showToast(
          "error",
          "Could not retrieve items in cart, check your internet connection and try again"
        );
      })

      // update item quantity
      .addCase(updateItemQuantity.pending, (state) => {
        state.update_item_quantity_status = "pending";
      })
      .addCase(updateItemQuantity.fulfilled, (state, action) => {
        state.update_item_quantity_status = "success";
        const foundItemIndex = state.cart.findIndex(
          (item) => item.name === action.payload.name
        );
        state.cart.splice(foundItemIndex, 1, action.payload);
        showToast("success", "changes applied successfully");
      })
      .addCase(updateItemQuantity.rejected, (state) => {
        state.update_item_quantity_status = "failed";
        showToast(
          "error",
          "could not update quantity , check your internet connection and try again"
        );
      })

      // remove item cart
      .addCase(removeFromCart.pending, (state) => {
        state.remove_item_from_cart_status = "pending";
      })
      .addCase(removeFromCart.fulfilled, (state, action) => {
        state.remove_item_from_cart_status = "success";
        const ItemToRemove = state.cart.findIndex(
          (item) => item.id === action.payload.id
        );
        state.cart.splice(ItemToRemove, 1);
        showToast("success", "item has been successfully removed");
      })
      .addCase(removeFromCart.rejected, (state) => {
        state.remove_item_from_cart_status = "failed";
        showToast(
          "error",
          "could not remove item , check your internet connection and try again "
        );
      });
  },
});

export default CartSlice.reducer;
export const {
  setCartEmptyIfLoggedOut,
  addItemToLocalCart,
  removeFromLocalCart,
  updateItemQuantityFromLocalCart,
} = CartSlice.actions;
export const cartApiData = (state: { cart: State }) => state.cart;
