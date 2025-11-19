import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { BASE_URL } from "./OtpRequestSlice";
import { toast } from "react-toastify";
import { signInWithGoogle } from "../components/utils/firebaseConfig";

interface State {
  signin_status: "idle" | "pending" | "success" | "failed";
  token: string;
  error: string;
  isAuthenticated: boolean;
}

const initialState: State = {
  signin_status: "idle",
  token: "",
  error: "",
  isAuthenticated: false,
};

export const handleGoogleSignIn: any = createAsyncThunk(
  "google_signin",
  async (_, { rejectWithValue }) => {
    try {
      const token = await signInWithGoogle();
      const response = await axios.post(
        `${BASE_URL}/auth/firebase_login/`,
        { token },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
    } catch (e: string | any) {
      if (e.response && e.response.data) {
        return rejectWithValue(e.response.data);
      } else {
        return rejectWithValue(e.message);
      }
    }
  }
);

export const signinWithCredentials: any = createAsyncThunk(
  "signin",
  async (payload) => {
    const response = await axios.post(`${BASE_URL}/users/login/`, payload, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    console.log(response.data);
    return response.data;
  }
);

export const SignInSlice = createSlice({
  name: "signin",
  initialState,
  reducers: {
    removeToken(state) {
      state.token = "";
    },
  },
  extraReducers(builder) {
    builder
      // google sign in cases
      .addCase(handleGoogleSignIn.pending, (state) => {
        state.signin_status = "pending";
      })
      .addCase(handleGoogleSignIn.fulfilled, (state, action) => {
        state.signin_status = "success";
        state.isAuthenticated = true;
        state.token = action.payload.token;
        toast.success("Signed in successfully", {
          hideProgressBar: true,
          autoClose: 1000,
        });
      })
      .addCase(handleGoogleSignIn.rejected, (state, action) => {
        state.signin_status = "failed";
        state.error = action.payload.error as string;
        toast.error(``, {
          hideProgressBar: true,
          autoClose: 1000,
        });
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
