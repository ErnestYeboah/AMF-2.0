import { useCookies } from "react-cookie";
import Logo from "../Logo";
import { useDispatch, useSelector } from "react-redux";
import "./otp_section.css";
import { product_data } from "../../features/ProductsApiSlice";
import { Input } from "antd";
import type { GetProps } from "antd";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  changeProgressState,
  otp_request_data,
  sendResetPasswordOtp,
  verifyResetPasswordOtp,
} from "../../features/OtpRequestSlice";
import LinearProgress from "@mui/material/LinearProgress";
import Box from "@mui/material/Box";
import { nanoid } from "@reduxjs/toolkit";
type OTPProps = GetProps<typeof Input.OTP>;

// TIMER TO ALLOW RESEND OTP
const TIMER = 60;

const VerifyPasswordChangeOtp = () => {
  const { userProfile } = useSelector(product_data);
  const { verify_reset_otp_request_status, send_reset_password_otp_status } =
    useSelector(otp_request_data);
  const [cookie] = useCookies(["token"]);
  const [countdown, setCountdown] = useState(TIMER);
  const [allowToResend, setAllowToResend] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  let timer: any;

  const passwordResetUrlRef = useRef(nanoid());

  useEffect(() => {
    if (send_reset_password_otp_status === "success") {
      dispatch(changeProgressState());
    }
  }, [send_reset_password_otp_status]);

  const onChange: OTPProps["onChange"] = (text) => {
    dispatch(
      verifyResetPasswordOtp({
        token: cookie["token"],
        email: userProfile[0]?.email,
        otp: text,
      })
    );
  };

  useEffect(() => {
    if (verify_reset_otp_request_status === "success") {
      navigate(`/reset_password/${passwordResetUrlRef.current}`);
    }
  }, [verify_reset_otp_request_status]);

  const sharedProps: OTPProps = {
    onChange,
  };

  useEffect(() => {
    if (countdown > 0) {
      timer = setInterval(() => {
        setCountdown((c) => c - 1);
      }, 1000);
    } else {
      clearInterval(timer);
      setAllowToResend(true);
    }

    return () => {
      clearInterval(timer);
    };
  }, [countdown]);

  return (
    <>
      {verify_reset_otp_request_status === "pending" && (
        <Box sx={{ width: "100%" }}>
          <LinearProgress />
        </Box>
      )}
      <div>
        <div className="otp_verify_section">
          <Logo />

          <p>Security code to reset password</p>
          <p>We have sent a verification code to </p>
          <p>
            <b>{userProfile[0]?.email}</b>
          </p>

          <div className="my-[1rem]">
            <Input.OTP
              className="otp"
              size="large"
              length={6}
              {...sharedProps}
            />
          </div>
          {!allowToResend ? (
            <p>
              Didn't receive the verification code? It could take a bit of time,
              request a new code in{" "}
              <span className="text-[var(--accent-color)]">{countdown}</span>
            </p>
          ) : (
            <button
              onClick={() =>
                dispatch(
                  sendResetPasswordOtp({
                    token: cookie["token"],
                    email: userProfile[0]?.email,
                  })
                )
              }
            >
              Request a new code
            </button>
          )}
        </div>
      </div>
    </>
  );
};

export default VerifyPasswordChangeOtp;
