import { useSelector } from "react-redux";
import { favoriteApiData } from "../../features/FavoriteSlice";
import "./favorite.css";
import "../ProductPage/products_page.css";
import FavoriteItemCard from "./FavoriteItemCard";
import { nanoid } from "@reduxjs/toolkit";
import EmptyMessage from "../utils/EmptyMessage";

const FavoriteHome = () => {
  const { favorites } = useSelector(favoriteApiData);

  return (
    <>
      {favorites.length === 0 ? (
        <EmptyMessage object="favorite" />
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
