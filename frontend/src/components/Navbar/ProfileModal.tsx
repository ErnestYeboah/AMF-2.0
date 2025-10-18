import { Avatar } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
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
const ProfileModal = ({
  className = "profile_modal",
}: {
  className: string;
}) => {
  const [, setProfileImage] = useState<any>("");
  const { userProfile } = useSelector(product_data);
  const [cookie, , removeCookie] = useCookies(["token"]);
  const dispatch = useDispatch();

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
    toast.success("Signed out successfully ", { hideProgressBar: true });
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
        <Link to={"/profile"}>Change Password</Link>
        <button className="signout_btn" onClick={signOut}>
          Sign Out
        </button>
      </div>
    </div>
  );
};

export default ProfileModal;
