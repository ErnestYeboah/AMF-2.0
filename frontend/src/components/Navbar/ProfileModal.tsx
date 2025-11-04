import { Avatar } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { UserOutlined } from "@ant-design/icons";
import {
  product_data,
  toggleProfileModal,
  updateProfileImage,
} from "../../features/ProductsApiSlice";
import { GoPencil } from "react-icons/go";
import React, { useState } from "react";
import { useCookies } from "react-cookie";
import { removeToken } from "../../features/SigninSlice";
import { toast } from "react-toastify";
import {
  clearUserAddressData,
  setCartEmptyIfLoggedOut,
} from "../../features/CartSlice";
import { clearFavoriteWhenSignedOut } from "../../features/FavoriteSlice";
const ProfileModal = ({
  className = "profile_modal",
}: {
  className: string;
}) => {
  const [, setProfileImage] = useState<any>("");
  const { userProfile } = useSelector(product_data);
  const [cookie, , removeCookie] = useCookies(["token"]);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const getProfileImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfileImage(e.currentTarget.files?.[0]);
    dispatch(
      updateProfileImage({
        id: userProfile[0]?.id,
        token: cookie["token"],
        profile_image: e.currentTarget.files?.[0],
      })
    );
  };

  const signOut = () => {
    removeCookie("token");
    dispatch(removeToken());
    dispatch(toggleProfileModal("hidden"));
    dispatch(setCartEmptyIfLoggedOut());
    dispatch(clearFavoriteWhenSignedOut());
    dispatch(clearUserAddressData());
    toast.success("Signed out successfully ", { hideProgressBar: true });
    navigate("/signin");
  };
  return (
    <div className={className}>
      <div className="profile_info">
        <div className="avatar_set">
          <input
            type="file"
            name="profile_image"
            accept="image/*"
            className="profile_input"
            onChange={getProfileImage}
          />
          <Avatar
            className="avatar cursor-pointer pointer-events-none"
            style={{ backgroundColor: "orange", verticalAlign: "middle" }}
            size="large"
          >
            {userProfile ? userProfile[0]?.email.charAt(0).toUpperCase() : "U"}
            <GoPencil className="pencil_icon" />
          </Avatar>
        </div>
        <p>{userProfile[0]?.email || "unknown gmail"}</p>
      </div>

      <div className="tool_options">
        <div className="flex gap-1">
          <UserOutlined />
          <Link to="/my_account">My Account</Link>
        </div>
        <button className="signout_btn" onClick={signOut}>
          Sign Out
        </button>
      </div>
    </div>
  );
};

export default ProfileModal;
