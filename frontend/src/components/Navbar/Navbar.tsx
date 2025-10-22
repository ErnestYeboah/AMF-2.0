import {
  ShoppingCartOutlined,
  HeartOutlined,
  UserOutlined,
} from "@ant-design/icons";
import "./navbar.css";
import { Avatar, Input } from "antd";
import { memo, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import SearchCategory from "./SearchCategory";
import { useCookies } from "react-cookie";
import ProfileModal from "./ProfileModal";
import { useDispatch, useSelector } from "react-redux";
import {
  getSearchValue,
  getUserProfile,
  product_data,
  toggleProfileModal,
} from "../../features/ProductsApiSlice";
import { cartApiData } from "../../features/CartSlice";
import { favoriteApiData } from "../../features/FavoriteSlice";
import SuggestionsBox from "./SuggestionsBox";

const { Search } = Input;
const Navbar = () => {
  const [cookie] = useCookies(["token"]);
  const { userProfile, profileModalState, search_value } =
    useSelector(product_data);
  const { cart, localCart } = useSelector(cartApiData);
  const { favorites } = useSelector(favoriteApiData);
  const { products } = useSelector(product_data);
  const [searchValue, setSearchValue] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

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

  function getSelectedItemFromSuggestionsList(name: string) {
    setSearchValue(name);
    navigate(`/products/search/${name}`);
  }

  function beginSearch(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    dispatch(getSearchValue(searchValue));
    navigate(`/products/search/${searchValue}`);
  }

  const getSuggestions = products.filter(
    (item) =>
      item.name.toLocaleLowerCase().indexOf(searchValue.toLocaleLowerCase()) !==
      -1
  );

  // clear the search value to display the selected item from the suggestions list in the placeholder
  useEffect(() => {
    if (search_value) {
      setSearchValue("");
    }
  }, [search_value]);

  return (
    <nav>
      <div className="top_bar">
        <Link to={"/"} className="logo_icon"></Link>
        <form onSubmit={beginSearch} className="search_bar_form">
          <Search
            className="search"
            onChange={(e) => setSearchValue(e.target.value)}
            name="searchValue"
            placeholder={search_value || "Type something"}
            value={searchValue}
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
            <ShoppingCartOutlined className="icon" />
            {cookie["token"]
              ? cart.length > 0 && <p className="count">{cart.length}</p>
              : localCart.length > 0 && (
                  <p className="count">{localCart.length}</p>
                )}
          </Link>
          <Link to={"/favorite"}>
            <HeartOutlined className="icon" />
            {favorites.length > 0 && (
              <p className="count">{favorites.length}</p>
            )}
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
      {searchValue.length > 2 && getSuggestions.length !== 0 && (
        <SuggestionsBox
          getSuggestions={getSuggestions}
          searchValue={searchValue}
          onclick={getSelectedItemFromSuggestionsList}
        />
      )}
    </nav>
  );
};

export default memo(Navbar);
