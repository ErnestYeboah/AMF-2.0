import { useState } from "react";
import RemoveFromCartButton from "./RemoveFormCartButton";
import {
  updateItemQuantityFromLocalCart,
  type LocalCartState,
} from "../../features/CartSlice";
import { useDispatch } from "react-redux";

const LocalCartItemCard = ({ data }: { data: LocalCartState }) => {
  const {
    category,
    id,
    image,
    name,
    old_price,
    price,
    quantity,
    size,
    total_price,
  } = data;
  const [newQuantity, setNewQuantity] = useState(quantity);
  const dispatch = useDispatch();
  const getQuantity = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewQuantity(e.target.valueAsNumber);
    dispatch(
      updateItemQuantityFromLocalCart({
        ...data,
        quantity: e.target.value,
        total_price: Number(price) * Number(e.target.value),
      })
    );
  };

  return (
    <div className="cart_product_card">
      <figure>
        <img src={image} alt="" />
      </figure>
      <div className="cart_details">
        <RemoveFromCartButton product_name={String(name)} id={Number(id)} />
        <div className="cart_info">
          <h2>{name}</h2>
          <p className="opacity-30">{category}</p>
          <p>Size : {size}</p>
          <div className="qty_input">
            <label htmlFor="quantity">Qty:</label>
            <input
              min={1}
              onChange={getQuantity}
              type="number"
              value={newQuantity}
            />
          </div>
        </div>
        <div className="cart_invoice">
          <p className="text-[1.3rem] opacity-50">₵{price}</p>
          <p>
            <s>₵{old_price}</s>
          </p>
          <p>
            Total :
            <span className="text-[1.2rem] text-[var(--accent-color)] ">
              ₵{total_price.toFixed(2)}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LocalCartItemCard;
