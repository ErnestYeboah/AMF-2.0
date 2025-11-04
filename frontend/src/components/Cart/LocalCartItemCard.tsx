import { useState } from "react";
import RemoveFromCartButton from "./RemoveFormCartButton";
import {
  cartApiData,
  updateItemQuantityFromLocalCart,
  type LocalCartState,
} from "../../features/CartSlice";
import { useDispatch, useSelector } from "react-redux";
import { Spin } from "antd";

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
  const { update_item_quantity_status } = useSelector(cartApiData);
  const decrementQuantity = () => {
    setNewQuantity((c) => (c <= 1 ? 1 : c - 1));
    if (newQuantity === 1) return;
    else {
      dispatch(
        updateItemQuantityFromLocalCart({
          ...data,
          quantity: newQuantity - 1,
          total_price: Number(price) * (newQuantity - 1),
        })
      );
    }
  };
  const incrementQuantity = () => {
    setNewQuantity((c) => c + 1);
    dispatch(
      updateItemQuantityFromLocalCart({
        ...data,
        quantity: newQuantity + 1,
        total_price: Number(price) * (newQuantity + 1),
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
          <div className="quantity_state">
            <button onClick={decrementQuantity}> - </button>
            <p>{newQuantity}</p>
            <button onClick={incrementQuantity}>+</button>
            {update_item_quantity_status === "pending" && <Spin />}
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
