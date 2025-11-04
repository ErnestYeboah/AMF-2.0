import { useDispatch, useSelector } from "react-redux";
import {
  product_data,
  toggleDeleteAccountModalView,
} from "../../features/ProductsApiSlice";
import Logo from "../Logo";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useRef } from "react";
import { nanoid } from "@reduxjs/toolkit";
import { useCookies } from "react-cookie";
import {
  otp_request_data,
  sendResetPasswordOtp,
} from "../../features/OtpRequestSlice";
import Box from "@mui/material/Box";
import LinearProgress from "@mui/material/LinearProgress";
import DeleteAccountModal from "./DeleteAccountModal";

const AccountSettings = () => {
  const { userProfile } = useSelector(product_data);

  const { send_reset_password_otp_status } = useSelector(otp_request_data);
  const navigate = useNavigate();
  const urlTokenRef = useRef(nanoid());
  const [cookie] = useCookies(["token"]);
  const dispatch = useDispatch();
  const { token: urlToken } = useParams();

  useEffect(() => {
    if (urlToken !== cookie["token"]?.slice(0, 6)) {
      navigate("/signin");
    }
  }, [cookie, urlToken]);

  const requestResetPasswordOtp = () => {
    dispatch(
      sendResetPasswordOtp({
        token: cookie["token"],
        email: userProfile[0]?.email,
      })
    );
  };

  useEffect(() => {
    if (send_reset_password_otp_status === "success") {
      navigate(`/reset_password_verification/${urlTokenRef.current}`);
    }
  }, [send_reset_password_otp_status]);

  return (
    <>
      {send_reset_password_otp_status === "pending" && (
        <Box sx={{ width: "100%" }}>
          <LinearProgress />
        </Box>
      )}
      <div className="account_settings_wrapper">
        <Logo />

        <div className="actions">
          <h2>
            <span className="text-[var(--accent-color)]">Hello</span>{" "}
            {userProfile[0]?.email}
          </h2>
          <button
            disabled={send_reset_password_otp_status === "pending"}
            onClick={requestResetPasswordOtp}
          >
            Change Password
          </button>
          <button
            onClick={() => dispatch(toggleDeleteAccountModalView(true))}
            className="delete_btn"
          >
            Delete Account
          </button>
        </div>
      </div>
      <DeleteAccountModal />
    </>
  );
};

export default AccountSettings;
