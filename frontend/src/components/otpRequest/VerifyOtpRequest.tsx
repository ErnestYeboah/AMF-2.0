import { Input } from "antd";
import type { GetProps } from "antd";
import Logo from "../Logo";
import { useCookies } from "react-cookie";
import "./otp_section.css";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  otp_request_data,
  sendOtpRequest,
  verifyOtpRequest,
} from "../../features/OtpRequestSlice";
import Box from "@mui/material/Box";
import LinearProgress from "@mui/material/LinearProgress";
import { useNavigate, useParams } from "react-router-dom";
import { nanoid } from "@reduxjs/toolkit";
type OTPProps = GetProps<typeof Input.OTP>;

// TIMER TO ALLOW RESEND OTP
const TIMER = 60;

const VerifyOtpRequest = () => {
  const [cookie] = useCookies(["email"]);
  const [countdown, setCountdown] = useState(TIMER);
  const [allowToResend, setAllowToResend] = useState(false);
  const { verify_otp_request_status, send_otp_request_status } =
    useSelector(otp_request_data);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [verifyOtpGeneratedUrlToken] = useCookies([
    "verifyOtpGeneratedUrlToken",
  ]);

  const [, setPasswordGeneratedUrlToken] = useCookies([
    "setPasswordGeneratedUrlToken",
  ]);
  // for url generated token
  const setPasswordTokenRef = useRef(nanoid());

  let timer: any;
  const { token: verifyOtpUrlToken } = useParams();

  // VERIFY IF URL TOKEN MATCHES THE COOKIE TOKEN
  useEffect(() => {
    if (
      verifyOtpGeneratedUrlToken["verifyOtpGeneratedUrlToken"] !==
      verifyOtpUrlToken
    ) {
      navigate("/:token/identification");
    }
  }, [verifyOtpUrlToken]);

  const onChange: OTPProps["onChange"] = (text) => {
    console.log("onChange:", text);
    dispatch(verifyOtpRequest({ email: cookie["email"], otp: text }));
  };

  useEffect(() => {
    if (verify_otp_request_status == "success") {
      setPasswordGeneratedUrlToken(
        "setPasswordGeneratedUrlToken",
        setPasswordTokenRef.current
      );
      navigate(`/${setPasswordTokenRef}/set_password`);
    }
  }, [verify_otp_request_status, navigate]);

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
    <div className="otp_verify_section">
      <Logo />
      {verify_otp_request_status === "pending" ||
        (send_otp_request_status === "pending" && (
          <Box sx={{ width: "100%" }}>
            <LinearProgress />
          </Box>
        ))}
      <p>Verify your email address</p>
      <p>We have sent a verification code to </p>
      <p>
        <b>{cookie["email"]}</b>
      </p>

      <div className="my-[1rem]">
        <Input.OTP className="otp" size="large" length={6} {...sharedProps} />
      </div>
      {!allowToResend ? (
        <p>
          Didn't receive the verification code? It could take a bit of time,
          request a new code in{" "}
          <span className="text-[var(--accent-color)]">{countdown}</span>
        </p>
      ) : (
        <button onClick={() => dispatch(sendOtpRequest(cookie["email"]))}>
          Request a new code
        </button>
      )}
    </div>
  );
};

export default VerifyOtpRequest;
