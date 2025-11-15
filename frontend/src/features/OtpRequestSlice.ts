import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";
// THE API
export const BASE_URL = "http://127.0.0.1:8000/api";
// export const BASE_URL = "https://amaetonfashionhouse.pythonanywhere.com/api";

interface State {
  send_otp_request_status: "idle" | "pending" | "success" | "failed";
  verify_otp_request_status: "idle" | "pending" | "success" | "failed";
  verify_reset_otp_request_status: "idle" | "pending" | "success" | "failed";
  set_new_password_status: "idle" | "pending" | "success" | "failed";
  reset_password_status: "idle" | "pending" | "success" | "failed";
  send_reset_password_otp_status: "idle" | "pending" | "success" | "failed";
  message: string;
  error: string;
}

const initialState: State = {
  send_otp_request_status: "idle",
  verify_otp_request_status: "idle",
  verify_reset_otp_request_status: "idle",
  set_new_password_status: "idle",
  reset_password_status: "idle",
  send_reset_password_otp_status: "idle",
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
type ResetOtpPayload = {
  email: string;
  token: string;
  password: string;
  confirm_password: string;
  otp: string;
};
export const sendResetPasswordOtp: any = createAsyncThunk(
  "reset_password_otp",
  async (payload: ResetOtpPayload, { rejectWithValue }) => {
    try {
      const { token, email } = payload;
      if (token) {
        const response = await axios.post(
          `${BASE_URL}/users/request_password_change_otp/`,
          { email },
          {
            headers: {
              Authorization: `Token ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        return response.data;
      }
    } catch (e: string | any) {
      if (e.response.data && e.response) {
        if (e.response.statusText == "Internal Server Error") {
          return rejectWithValue("No internet connection , please try again");
        } else {
          return rejectWithValue(e.response.data);
        }
      } else {
        return rejectWithValue("No internet connection , please try again");
      }
    }
  }
);

export const verifyResetPasswordOtp: any = createAsyncThunk(
  "verify_reset_password_otp",
  async (payload: ResetOtpPayload, { rejectWithValue }) => {
    try {
      const { token, email, otp } = payload;
      if (token) {
        const response = await axios.post(
          `${BASE_URL}/users/verify_password_change_otp/`,
          { email, otp },
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
    } catch (e: string | any) {
      if (e.response.data && e.response) {
        return rejectWithValue(e.response.data);
      } else {
        return rejectWithValue(e.message);
      }
    }
  }
);

export const resetPassword: any = createAsyncThunk(
  "reset_password",
  async (payload: ResetOtpPayload, { rejectWithValue }) => {
    try {
      const { token, email, password, confirm_password } = payload;
      if (token) {
        const response = await axios.post(
          `${BASE_URL}/users/change_password/`,
          { email, password, confirm_password },
          {
            headers: {
              Authorization: `Token ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        return response.data;
      }
    } catch (e: string | any) {
      if (e.response.data && e.response) {
        return rejectWithValue(e.response.data);
      } else {
        return rejectWithValue(e.message);
      }
    }
  }
);

export const OtpRequestSlice = createSlice({
  name: "otp_request_api",
  initialState,
  reducers: {
    changeProgressState(state) {
      state.send_reset_password_otp_status = "idle";
    },
    changeSendOtpRequestState(state) {
      state.send_otp_request_status = "idle";
    },
  },
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
        state.error = action.payload.error as string;
        toast.error(state.error, { hideProgressBar: true });
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
      })
      // send reset password otp
      .addCase(sendResetPasswordOtp.pending, (state) => {
        state.send_reset_password_otp_status = "pending";
      })
      .addCase(sendResetPasswordOtp.fulfilled, (state) => {
        state.send_reset_password_otp_status = "success";
      })
      .addCase(sendResetPasswordOtp.rejected, (state, action) => {
        state.send_reset_password_otp_status = "failed";
        toast.error(action.payload.error, { hideProgressBar: true });
      })
      // verify reset password otp
      .addCase(verifyResetPasswordOtp.pending, (state) => {
        state.verify_reset_otp_request_status = "pending";
      })
      .addCase(verifyResetPasswordOtp.fulfilled, (state) => {
        state.verify_reset_otp_request_status = "success";
      })
      .addCase(verifyResetPasswordOtp.rejected, (state, action) => {
        state.verify_reset_otp_request_status = "failed";
        toast.error(action.payload.error, { hideProgressBar: true });
      })
      // rseet your password
      .addCase(resetPassword.pending, (state) => {
        state.reset_password_status = "pending";
      })
      .addCase(resetPassword.fulfilled, (state, action) => {
        state.reset_password_status = "success";
        toast.success(action.payload.message, { hideProgressBar: true });
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.reset_password_status = "failed";
        toast.error(action.payload.error, { hideProgressBar: true });
      });
  },
});

export default OtpRequestSlice.reducer;
export const { changeProgressState, changeSendOtpRequestState } =
  OtpRequestSlice.actions;
export const otp_request_data = (state: { otp_request_api: State }) =>
  state.otp_request_api;
