import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { BASE_URL } from "./OtpRequestSlice";
import { toast } from "react-toastify";
import { signInWithGoogle } from "../firebaseConfig";

interface State {
  signin_status: "idle" | "pending" | "success" | "failed";
  google_signin_status: "idle" | "pending" | "success" | "failed";
  google_token: string;
  token: string;
  error: string;
  isAuthenticated: boolean;
}

const initialState: State = {
  signin_status: "idle",
  google_signin_status: "idle",
  token: "",
  google_token: "",
  error: "",
  isAuthenticated: false,
};

export const signinWithCredentials: any = createAsyncThunk(
  "signin",
  async (payload) => {
    const response = await axios.post(`${BASE_URL}/auth/`, payload, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    console.log(response.data);
    return response.data;
  }
);

export const handleGoogleSignIn: any = createAsyncThunk(
  "google_sign",
  async (_, { rejectWithValue }) => {
    try {
      const token = await signInWithGoogle();
      const response = await axios.post(`${BASE_URL}/auth/firebase_login/`, {
        token,
      });

      console.log(response.data);

      return response.data.token;
    } catch (e: string | any) {
      if (e.response.message || e.response) {
        return rejectWithValue(e.response.data);
      } else {
        return rejectWithValue("No Internet connection");
      }
    }
  }
);

export const SignInSlice = createSlice({
  name: "signin",
  initialState,
  reducers: {
    removeToken(state) {
      state.token = "";
      state.google_token = "";
    },
  },
  extraReducers(builder) {
    builder
      // for google signin
      .addCase(handleGoogleSignIn.pending, (state) => {
        state.google_signin_status = "pending";
      })
      .addCase(handleGoogleSignIn.fulfilled, (state, action) => {
        state.google_signin_status = "success";
        state.google_token = action.payload;
        toast.success("Logged in successfully", {
          hideProgressBar: true,
        });
      })
      .addCase(handleGoogleSignIn.rejected, (state, action) => {
        state.google_signin_status = "failed";
        state.error = action.payload.error as string;
        toast.error(state.error, { hideProgressBar: true });
      })

      .addCase(signinWithCredentials.pending, (state) => {
        state.signin_status = "pending";
      })
      .addCase(signinWithCredentials.fulfilled, (state, action) => {
        state.signin_status = "success";
        state.isAuthenticated = true;
        state.token = action.payload.token;
        toast.success("Signed in successfully", {
          hideProgressBar: true,
          autoClose: 1000,
        });
      })
      .addCase(signinWithCredentials.rejected, (state, action) => {
        state.signin_status = "failed";
        state.error = action.error.message || "";
        toast.error(`Invalid email address or password`, {
          hideProgressBar: true,
          autoClose: 1000,
        });
      });
  },
});

export default SignInSlice.reducer;
export const { removeToken } = SignInSlice.actions;
export const signinSliceData = (state: { signin: State }) => state.signin;
