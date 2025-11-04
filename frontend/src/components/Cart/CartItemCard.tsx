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

  const getNewQuantity = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewQuantity(e.target.valueAsNumber);
    const _t = Number(e.target.value);
    // update the api quantity
    dispatch(
      updateItemQuantity({
        token: cookie["token"],
        id: id,
        quantity: _t < 1 ? 1 : _t,
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
          <div className="qty_input">
            <label htmlFor="quantity">Qty:</label>
            <input
              min={1}
              type="number"
              value={newQuantity}
              onChange={getNewQuantity}
            />
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
