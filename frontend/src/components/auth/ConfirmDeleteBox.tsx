import { useDispatch, useSelector } from "react-redux";
import {
  deleteUserAccount,
  product_data,
} from "../../features/ProductsApiSlice";
import { UserOutlined } from "@ant-design/icons";
import CloseButton from "../utils/CloseButton";
import { memo, useState } from "react";
import { useCookies } from "react-cookie";
import { removeToken } from "../../features/SigninSlice";
import { useNavigate } from "react-router-dom";

const ConfirmDeleteBox = () => {
  const { userProfile } = useSelector(product_data);
  const [account_name, setAccountName] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [cookie, , removeCookie] = useCookies(["token"]);
  const removeAccount = () => {
    dispatch(
      deleteUserAccount({ id: userProfile[0]?.id, token: cookie["token"] })
    );
    removeCookie("token");
    dispatch(removeToken());
    navigate("/signin");
  };

  return (
    <div>
      <div className="confirm_delete_modal">
        <h3>
          Delete {userProfile[0]?.email}
          <CloseButton />
        </h3>

        <div className="account_icon">
          <UserOutlined className="text-4xl" />
          <h2>{userProfile[0]?.email}</h2>
        </div>

        <div className="input_wrapper">
          <p>
            To confirm delete , type "{userProfile[0]?.email}" in the box below
          </p>
          <input
            onChange={(e) => setAccountName(e.target.value)}
            type="text"
            value={account_name}
            name="account_name"
            id="account_name"
            required
          />
          <button
            onClick={removeAccount}
            disabled={account_name !== userProfile[0]?.email}
          >
            Delete this account
          </button>
        </div>
      </div>
    </div>
  );
};

export default memo(ConfirmDeleteBox);
