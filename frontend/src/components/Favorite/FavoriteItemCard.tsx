import { useDispatch, useSelector } from "react-redux";
import {
  removeFromFavorite,
  type Favorite,
} from "../../features/FavoriteSlice";
import { product_data } from "../../features/ProductsApiSlice";
import { CiHeart } from "react-icons/ci";
import { useCookies } from "react-cookie";
import { Link } from "react-router-dom";

const FavoriteItemCard = ({ data }: { data: Favorite }) => {
  const { products } = useSelector(product_data);
  const { name, price, added_on, product_id, id } = data;
  const [cookie] = useCookies(["token"]);
  const dispatch = useDispatch();

  const foundItem = products.find((item) => item.id === product_id);
  
  return (
    <div className="product_card favorite_item_card">
      <figure>
        <Link to={`/product/${name}`}>
          <img src={foundItem?.image} alt="" />
        </Link>
      </figure>
      <div className="product_text space-y-1">
        <p className="opacity-30">{foundItem?.brief_note}</p>
        <p>{name}</p>
        <p className="text-[var(--accent-color)] text-[1.2rem]">₵{price}</p>
        <p className="opacity-40">
          Added on {new Date(added_on).toLocaleDateString()}
        </p>
      </div>

      <div
        onClick={() =>
          dispatch(removeFromFavorite({ id: id, token: cookie["token"] }))
        }
        className="favorite_icon_wrapper active cursor-pointer"
      >
        <CiHeart className="heart_icon" />
      </div>
    </div>
  );
};

export default FavoriteItemCard;
