import { useSelector } from "react-redux";
import { cartApiData } from "../../features/CartSlice";
import CartItemCard from "./CartItemCard";
import { nanoid } from "@reduxjs/toolkit";
import "./cart.css";
import CheckOutModal from "./CheckOutModal";
import EmptyMessage from "../utils/EmptyMessage";
import { useCookies } from "react-cookie";
import LocalCartItemCard from "./LocalCartItemCard";

const CartHome = () => {
  const { cart, localCart } = useSelector(cartApiData);
  const [cookie] = useCookies(["token"]);

  return (
    <>
      {/* check if user is logged in or not and their cart is empty to display the empty message */}
      {cookie["token"] && cart.length === 0 ? (
        <EmptyMessage object="cart" />
      ) : (
        !cookie["token"] &&
        localCart.length == 0 && <EmptyMessage object="cart" />
      )}

      {cookie["token"] && cart.length > 0 ? (
        <div className="cart_home">
          <div>
            {cart &&
              cart.map((item, _) => (
                <CartItemCard key={nanoid()} data={item} />
              ))}
          </div>
          <CheckOutModal />
        </div>
      ) : (
        !cookie["token"] &&
        localCart.length > 0 && (
          <div className="cart_home">
            <div>
              {localCart &&
                localCart.map((item, _) => (
                  <LocalCartItemCard key={nanoid()} data={item} />
                ))}
            </div>
            <CheckOutModal />
          </div>
        )
      )}
    </>
  );
};

export default CartHome;
