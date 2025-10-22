import { Link } from "react-router-dom";
import type { Product } from "../../features/ProductsApiSlice";
import { CiHeart } from "react-icons/ci";
import { useCookies } from "react-cookie";
import {
  addToFavoriteApi,
  favoriteApiData,
  removeFromFavorite,
  type Favorite,
} from "../../features/FavoriteSlice";
import { useDispatch, useSelector } from "react-redux";

const ProductCard = ({ data }: { data: Product }) => {
  const { name, price, image, brief_note, id, category } = data;
  const [cookie] = useCookies(["token"]);
  const dispatch = useDispatch();
  const path = location.pathname;
  const { favorites } = useSelector(favoriteApiData);

  const foundItem = favorites.find((item) => item.product_id === id);

  const objectToAddToFavorite: Omit<Favorite, "added_on"> = {
    name: name,
    category: category,
    product_id: id,
    price: price,
  };

  const saveToFavorite = () => {
    dispatch(
      addToFavoriteApi({
        token: cookie["token"],
        favoriteData: objectToAddToFavorite,
      })
    );
  };

  const deleteFromFavorite = () => {
    dispatch(removeFromFavorite({ id: foundItem?.id, token: cookie["token"] }));
  };

  return (
    <div className="product_card">
      <figure>
        <Link to={`/product/${name}`}>
          <img src={image} alt={name} />
        </Link>
      </figure>
      <div className="product_text space-y-1">
        <p className="opacity-50">{brief_note}</p>
        <p>{name}</p>
        <p className="text-[var(--accent-color)]">
          <b>₵{price}</b>
        </p>
      </div>
      {cookie["token"] && (
        <Link
          to={path}
          onClick={foundItem ? deleteFromFavorite : saveToFavorite}
          className={
            foundItem ? "favorite_icon_wrapper active" : "favorite_icon_wrapper"
          }
        >
          <CiHeart className="heart_icon" />
        </Link>
      )}
    </div>
  );
};

export default ProductCard;
