import {
  ShoppingCartOutlined,
  HeartOutlined,
  UserOutlined,
} from "@ant-design/icons";
import "./navbar.css";
import { Avatar, Input } from "antd";
import { memo, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import SearchCategory from "./SearchCategory";
import { useCookies } from "react-cookie";
import ProfileModal from "./ProfileModal";
import { useDispatch, useSelector } from "react-redux";
import {
  getUserProfile,
  product_data,
  toggleProfileModal,
} from "../../features/ProductsApiSlice";

const { Search } = Input;
const Navbar = () => {
  const [search, setSearch] = useState("");
  const [cookie] = useCookies(["token"]);
  const { userProfile, profileModalState } = useSelector(product_data);
  const dispatch = useDispatch();

  useEffect(() => {
    if (cookie["token"]) {
      dispatch(getUserProfile(cookie["token"]));
    }
  }, [cookie["token"]]);

  function toggle() {
    return profileModalState === "hidden"
      ? dispatch(toggleProfileModal("visible"))
      : dispatch(toggleProfileModal("hidden"));
  }

  return (
    <nav>
      <div className="top_bar">
        <Link to={"/"} className="logo_icon"></Link>
        <form className="search_bar_form">
          <Search
            className="search"
            onChange={(e) => setSearch(e.currentTarget.value)}
            name="search"
            placeholder="Type something"
            value={search}
            allowClear
          />
        </form>
        <div className="nav_icons">
          <div className="avatar_sec">
            {cookie["token"] && userProfile[0]?.profile_image ? (
              <figure onClick={toggle} className="avatar_image">
                <img src={userProfile[0]?.profile_image} alt="" />
              </figure>
            ) : cookie["token"] ? (
              <Avatar
                onClick={toggle}
                className="avatar"
                style={{ backgroundColor: "orange", verticalAlign: "middle" }}
                size="small"
              >
                {userProfile
                  ? userProfile[0]?.email.charAt(0).toUpperCase()
                  : "U"}
              </Avatar>
            ) : (
              <Link to={"/signin"}>
                <UserOutlined />
              </Link>
            )}
          </div>
          <Link to={"/cart"}>
            <ShoppingCartOutlined />
          </Link>
          <Link to={"/favorite"}>
            <HeartOutlined />
          </Link>
        </div>
      </div>
      <SearchCategory />
      <ProfileModal
        className={
          profileModalState === "visible"
            ? "profile_modal active"
            : "profile_modal"
        }
      />
    </nav>
  );
};

export default memo(Navbar);
