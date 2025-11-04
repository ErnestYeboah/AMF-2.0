import { useEffect, useRef, useState } from "react";
import TextField from "@mui/material/TextField";
import "./otp_section.css";
import Logo from "../Logo";
import { useCookies } from "react-cookie";
import { Link, useNavigate } from "react-router-dom";
import {
  otp_request_data,
  sendOtpRequest,
} from "../../features/OtpRequestSlice";
import { useDispatch, useSelector } from "react-redux";
import Box from "@mui/material/Box";
import LinearProgress from "@mui/material/LinearProgress";
import { nanoid } from "@reduxjs/toolkit";

const SendOtpRequest = () => {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [, setCookie] = useCookies(["email"]);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { send_otp_request_status, message } = useSelector(otp_request_data);
  const verifyOtpRef = useRef(nanoid());

  const send_otp_request = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (email && email.includes("@") && email.endsWith("gmail.com")) {
      dispatch(sendOtpRequest(email));
      return true;
    } else {
      setEmailError("Please enter a valid email address");
      return false;
    }
  };

  useEffect(() => {
    if (send_otp_request_status === "success") {
      if (message.includes("User already exists")) {
        navigate("/signin");
        return;
      } else {
        setCookie("email", email, { path: "/" });
        navigate(`/${verifyOtpRef.current}/verify_otp`);
      }
    }
  }, [send_otp_request_status, navigate]);
  return (
    <>
      {send_otp_request_status === "pending" && (
        <Box sx={{ width: "100%" }}>
          <LinearProgress />
        </Box>
      )}
      <div className="identification_section">
        <div className="title">
          <Logo />
          <h2>Welcome to Amaeton Fashion House</h2>
          <p>Type your email address to create an account.</p>
        </div>
        <form onSubmit={send_otp_request} method="post">
          <TextField
            fullWidth
            id="outlined-basic"
            label="Enter your email address"
            variant="outlined"
            value={email}
            required
            disabled={send_otp_request_status === "pending"}
            onChange={(e) => setEmail(e.currentTarget.value)}
          />
          {emailError && (
            <p className="text-[.7rem] text-red-500">{emailError}</p>
          )}
          <button
            type="submit"
            disabled={send_otp_request_status === "pending"}
          >
            Continue
          </button>
          <p>
            Already have an account ,{" "}
            <Link className="text-[var(--accent-color)]" to={"/signin"}>
              Sign In
            </Link>
          </p>

          <p>
            By continuing you agree to Amaeton Fashion House terms and
            conditions.
          </p>
        </form>
      </div>
    </>
  );
};

export default SendOtpRequest;
