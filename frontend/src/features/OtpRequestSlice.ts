import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";
// THE API
export const BASE_URL = "http://127.0.0.1:8000/api";

interface State {
  send_otp_request_status: "idle" | "pending" | "success" | "failed";
  verify_otp_request_status: "idle" | "pending" | "success" | "failed";
  set_new_password_status: "idle" | "pending" | "success" | "failed";
  message: string;
  error: string;
}

const initialState: State = {
  send_otp_request_status: "idle",
  verify_otp_request_status: "idle",
  set_new_password_status: "idle",
  error: "",
  message: "",
};

export const sendOtpRequest: any = createAsyncThunk(
  "get_otp",
  async (email, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/users/request_otp/`,
        { email: email },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      return response.data;
    } catch (err: string | any) {
      if (err.response && err.response.data) {
        return rejectWithValue(err.response.data);
      } else {
        return rejectWithValue(err.message);
      }
    }
  }
);

export const verifyOtpRequest: any = createAsyncThunk(
  "verify_otp",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/users/verify_otp/`,
        payload,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      return response.data;
    } catch (err: string | any) {
      if (err.response && err.response.data) {
        return rejectWithValue(err.response.data);
      } else {
        return rejectWithValue(err.message);
      }
    }
  }
);

export const setNewPassword: any = createAsyncThunk(
  "set_password",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/users/set_password/`,
        payload,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      return response.data;
    } catch (err: string | any) {
      if (err.response && err.response.data) {
        return rejectWithValue(err.response.data);
      } else {
        return rejectWithValue(err.message);
      }
    }
  }
);

export const OtpRequestSlice = createSlice({
  name: "otp_request_api",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(sendOtpRequest.pending, (state) => {
        state.send_otp_request_status = "pending";
      })
      .addCase(sendOtpRequest.fulfilled, (state, action) => {
        state.send_otp_request_status = "success";
        state.message = action.payload.message;
        toast.success(action.payload.message, {
          hideProgressBar: true,
        });
      })
      .addCase(sendOtpRequest.rejected, (state, action) => {
        state.send_otp_request_status = "failed";
        state.error = action.payload as string;
        toast.error("something happened, check your newtork and try again");
      })

      //   for verifying otp
      .addCase(verifyOtpRequest.pending, (state) => {
        state.verify_otp_request_status = "pending";
      })
      .addCase(verifyOtpRequest.fulfilled, (state, action) => {
        state.verify_otp_request_status = "success";
        toast.success(action.payload.message, {
          hideProgressBar: true,
        });
      })
      .addCase(verifyOtpRequest.rejected, (state, action) => {
        state.verify_otp_request_status = "failed";
        state.error = action.payload.error as string;
        toast.error(state.error, {
          hideProgressBar: true,
        });
      })

      //   for setting new password
      .addCase(setNewPassword.pending, (state) => {
        state.verify_otp_request_status = "pending";
      })
      .addCase(setNewPassword.fulfilled, (state, action) => {
        state.verify_otp_request_status = "success";
        toast.success(action.payload.message, {
          hideProgressBar: true,
        });
      })
      .addCase(setNewPassword.rejected, (state, action) => {
        state.verify_otp_request_status = "failed";
        state.error = action.payload.error as string;
        toast.error(state.error, {
          hideProgressBar: true,
        });
      });
  },
});

export default OtpRequestSlice.reducer;
export const otp_request_data = (state: { otp_request_api: State }) =>
  state.otp_request_api;
