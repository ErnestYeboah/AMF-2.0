import { Input, Space } from "antd";
import "./otp_section.css";
import Logo from "../Logo";
import { useCookies } from "react-cookie";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import CheckIcon from "@mui/icons-material/Check";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { product_data } from "../../features/ProductsApiSlice";
import {
  otp_request_data,
  resetPassword,
} from "../../features/OtpRequestSlice";

const PasswordReset = () => {
  const [cookie] = useCookies(["token"]);
  const { userProfile } = useSelector(product_data);
  const { reset_password_status } = useSelector(otp_request_data);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [password_legth_status, setPasswordLengthStatus] = useState("");
  const [password_matches, setPasswordMatches] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  function errorMessage(message: string) {
    toast.error(message, {
      hideProgressBar: true,
      autoClose: 1000,
    });
  }
  const changePassword = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (password) {
      if (password !== confirmPassword) {
        errorMessage("password do not match");
        return false;
      } else if (password_legth_status && password_matches !== "green") {
        errorMessage("Please complete password requirements to continue");
        return false;
      } else {
        dispatch(
          resetPassword({
            token: cookie["token"],
            email: userProfile[0]?.email,
            password: password,
            confirm_password: confirmPassword,
          })
        );
        return true;
      }
    } else {
      errorMessage("Please create a new password to continue");
    }
  };

  useEffect(() => {
    if (reset_password_status === "success") {
      navigate("/my_account");
    }
  }, [reset_password_status]);

  const getPassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    const typing_password = e.currentTarget.value;
    setPassword(e.currentTarget.value);
    if (typing_password.length < 10) {
      setPasswordLengthStatus("red");
    } else {
      setPasswordLengthStatus("green");
    }

    if (typing_password.match(/[!,@#$%^&*().?/"|}{|\<>}]/g)) {
      setPasswordMatches("green");
    } else {
      setPasswordMatches("red");
    }
  };

  return (
    <div className="password_set_section">
      <Logo />
      <p>
        Your email{" "}
        <span className="text-[var(--accent-color)]">
          {userProfile[0]?.email}
        </span>{" "}
        has been verified successfully ,you can now reset your password
      </p>
      <form onSubmit={changePassword}>
        <Space direction="vertical">
          <Input
            className="input"
            placeholder={userProfile[0]?.email}
            readOnly
          />
        </Space>

        <Space direction="vertical">
          <Input.Password
            value={password}
            onChange={getPassword}
            className="input"
            placeholder="Enter Password"
          />
          <div className="password_info">
            <p>
              <CheckIcon
                fontSize="small"
                style={{ color: `${password_legth_status}` }}
              />
              Password length must be more than 10
            </p>
            <p>
              <CheckIcon
                fontSize="small"
                style={{ color: `${password_matches}` }}
              />
              Password must contain atleast a symbol
            </p>
          </div>
        </Space>
        <Space direction="vertical">
          <Input.Password
            className="input"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.currentTarget.value)}
            placeholder="Confirm Password"
          />
        </Space>
        <button>Continue</button>
      </form>
    </div>
  );
};

export default PasswordReset;
