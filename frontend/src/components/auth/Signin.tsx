import { Input, Space } from "antd";
import "../otpRequest/otp_section.css";
import Logo from "../Logo";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  signinSliceData,
  signinWithCredentials,
} from "../../features/SigninSlice";
import { message } from "antd";
import { useCookies } from "react-cookie";
import { nanoid } from "@reduxjs/toolkit";

const Signin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [messageApi, contextHolder] = message.useMessage();
  const { signin_status, token } = useSelector(signinSliceData);
  const dispatch = useDispatch();
  const [, setCookie] = useCookies(["token"]);
  const [, setGeneratedUrlTokenCookie] = useCookies(["generatedUrlToken"]);
  const navigate = useNavigate();
  const idRef = useRef(nanoid());

  const signin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // shen signing in the params are username and password , so enter the email as the username
    dispatch(signinWithCredentials({ username: email, password: password }));
  };

  const success = () => {
    messageApi.open({
      type: "loading",
      content: "Authenticating user, please wait..",
      duration: 0,
    });
  };

  function generateUrlToken() {
    const urlToken = idRef.current;
    setGeneratedUrlTokenCookie("generatedUrlToken", urlToken, { path: "/" });
  }

  useEffect(() => {
    if (signin_status == "pending") {
      success();
    } else if (signin_status == "success" && token) {
      messageApi.destroy();
      setCookie("token", token);
      navigate("/");
    } else if (signin_status == "failed") {
      messageApi.destroy();
    }
  }, [signin_status, token]);

  return (
    <div className="signin_section">
      <Logo />
      <div className="welcome text-center">
        <h2>
          <b>Welcome to Amaeton Fashion House</b>
        </h2>
        <p>Type your email address and password to continue</p>
      </div>
      <form
        onSubmit={signin}
        className={
          signin_status === "pending"
            ? "pointer-events-none mt-[2rem] opacity-20"
            : "mt-[2rem]"
        }
      >
        <Space direction="vertical">
          <Input
            className="input"
            type="email"
            placeholder="Enter your email address"
            required
            value={email}
            autoComplete="on"
            onChange={(e) => setEmail(e.currentTarget.value)}
          />
        </Space>
        <Space direction="vertical">
          <Input.Password
            className="input"
            placeholder="Enter your password"
            required
            value={password}
            onChange={(e) => setPassword(e.currentTarget.value)}
          />
        </Space>
        <p>
          Do not have an account ,{" "}
          <Link
            onClick={generateUrlToken}
            className="text-[var(--accent-color)]"
            to={`/${idRef.current}/identification`}
          >
            Sign Up
          </Link>
        </p>
        <button>Sign In</button>
        {contextHolder}
      </form>
    </div>
  );
};

export default Signin;
