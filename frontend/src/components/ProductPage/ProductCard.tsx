import { Link } from "react-router-dom";
import {
  product_data,
  updateHistoryList,
  type Product,
} from "../../features/ProductsApiSlice";
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
  const { name, price, image, brief_note, id, category, old_price } = data;
  const [cookie] = useCookies(["token"]);
  const dispatch = useDispatch();
  const path = location.pathname;
  const { favorites } = useSelector(favoriteApiData);
  const { history } = useSelector(product_data);

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

  const addToHistoryList = () => {
    const existingItem = history.find((item) => item.product_id === id);
    if (existingItem) {
      return;
    } else {
      dispatch(
        updateHistoryList({
          token: cookie["token"],
          values: { product_id: id, product_name: name },
        })
      );
    }
  };

  return (
    <div className="product_card">
      <figure onClick={addToHistoryList}>
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
        <p className="opacity-50">
          <s>₵{old_price}</s>
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
