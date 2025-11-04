import { useSelector } from "react-redux";
import { favoriteApiData } from "../../features/FavoriteSlice";
import "./favorite.css";
import "../ProductPage/products_page.css";
import FavoriteItemCard from "./FavoriteItemCard";
import { nanoid } from "@reduxjs/toolkit";
import EmptyMessage from "../utils/EmptyMessage";
import Skeleton from "../utils/Skeleton";

const FavoriteHome = () => {
  const { favorites, fetch_favorite_items_status } =
    useSelector(favoriteApiData);

  return (
    <>
      {favorites.length === 0 ? (
        <EmptyMessage object="favorite" />
      ) : fetch_favorite_items_status === "pending" ? (
        <Skeleton key={nanoid()} />
      ) : (
        <div className="favorite_card_wrapper">
          {favorites &&
            favorites.map((item, _) => (
              <FavoriteItemCard data={item} key={nanoid()} />
            ))}
        </div>
      )}
    </>
  );
};

export default FavoriteHome;
