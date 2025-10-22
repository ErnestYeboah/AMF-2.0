import { memo } from "react";
import { useSelector } from "react-redux";
import { cartApiData } from "../../features/CartSlice";
import { useCookies } from "react-cookie";

const CheckOutModal = () => {
  const { cart, localCart } = useSelector(cartApiData);
  const [cookie] = useCookies(["token"]);
  const totalCheckout = cart.reduce(
    (sum, item) => sum + parseFloat(item.total_price),
    0
  );
  const totalCheckoutForLocalCart = localCart.reduce(
    (sum, item) => sum + parseFloat(String(item.total_price)),
    0
  );
  return (
    <div className="checkout_modal">
      <h2>CART SUMMARY</h2>
      <div className="brief flex items-center justify-between">
        <div>
          <p>Subtotal</p>
          <p>Delivery fees not included yet</p>
        </div>
        <p className="text-[1.2rem] text-[var(--accent-color)]">
          {cookie["token"]
            ? `₵${totalCheckout.toFixed(2)}`
            : `₵${totalCheckoutForLocalCart.toFixed(2)}`}
        </p>
      </div>
      <div className="company_words">
        <p>Amaeton Fashion House</p>
        <p>
          The best and quality products you can get
          <b>
            <i>Free Delivery</i>
          </b>
        </p>
      </div>

      <button className="checkout_btn">
        Checkout{" "}
        {cookie["token"]
          ? `₵${totalCheckout.toFixed(2)}`
          : `₵${totalCheckoutForLocalCart.toFixed(2)}`}
      </button>
    </div>
  );
};

export default memo(CheckOutModal);
