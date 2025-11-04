import { useDispatch, useSelector } from "react-redux";
import {
  cartApiData,
  updateItemQuantity,
  type Cart,
} from "../../features/CartSlice";
import { product_data } from "../../features/ProductsApiSlice";
import { useState } from "react";
import { Spin } from "antd";
import { useCookies } from "react-cookie";
import RemoveFromCartButton from "./RemoveFormCartButton";

const CartItemCard = ({ data }: { data: Cart }) => {
  const { name, price, quantity, category, id, size, total_price, product_id } =
    data;
  const { products } = useSelector(product_data);
  const [newQuantity, setNewQuantity] = useState(quantity);
  const { update_item_quantity_status } = useSelector(cartApiData);
  const [cookie] = useCookies(["token"]);
  const dispatch = useDispatch();
  const foundProduct = products.find((item) => item.id === product_id);

  const decrementQuantity = () => {
    setNewQuantity((c) => (c <= 1 ? 1 : c - 1));
    if (newQuantity === 1) return;
    else {
      dispatch(
        updateItemQuantity({
          token: cookie["token"],
          id: id,
          quantity: newQuantity <= 1 ? 1 : newQuantity - 1,
        })
      );
    }
  };
  const incrementQuantity = () => {
    setNewQuantity((c) => c + 1);
    dispatch(
      updateItemQuantity({
        token: cookie["token"],
        id: id,
        quantity: newQuantity + 1,
      })
    );
  };

  return (
    <div className="cart_product_card">
      <figure>
        <img src={foundProduct?.image} alt="" />
      </figure>
      <div className="cart_details">
        <RemoveFromCartButton product_name={name} id={id} />
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
          <p className="text-[1.2rem] opacity-30">₵{price}</p>
          <p>
            <s>₵{foundProduct?.old_price}</s>
          </p>
          <p>
            Total :{" "}
            <span className="text-[1.2rem] text-[var(--accent-color)] ">
              {" "}
              ₵{total_price}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default CartItemCard;
