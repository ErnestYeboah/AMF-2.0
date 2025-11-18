import { memo } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  cartApiData,
  renderCheckoutConfirmedStatus,
  type AddressForm,
} from "../../features/CartSlice";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import emailjs from "@emailjs/browser";
import { nanoid } from "@reduxjs/toolkit";
import { product_data } from "../../features/ProductsApiSlice";
import { message } from "antd";
const CheckOutModal = () => {
  const { cart, localCart } = useSelector(cartApiData);
  const { userProfile } = useSelector(product_data);
  const [cookie] = useCookies(["token"]);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const path = location.pathname;
  const { userAddressData } = useSelector(cartApiData);
  const [messageApi, contextHolder] = message.useMessage();

  const totalCheckout = cart.reduce(
    (sum, item) => sum + parseFloat(item.total_price),
    0
  );

  const isAddressValid = (addr: AddressForm): boolean => {
    return Object.values(addr).every((value) => value !== "");
  };

  const success = () => {
    messageApi.open({
      type: "success",
      content: "Checkout completed , thank you for buying from us.",
    });
  };

  // sending email to the customer
  const serviceID = "service_yc6bqma";
  const templateID = "template_yub2jck";
  const public_key = "gfrPFhvSgppDNHQOu";
  const cartItems = cart.map((item) => {
    return {
      name: item.name,
      units: item.quantity,
      price: item.price,
      size: item.size,
      total_price: item.total_price,
    };
  });

  const templateParams = {
    email: userProfile[0]?.email,
    orders: cartItems,
    order_id: nanoid(),
    total: `${totalCheckout.toFixed(2)}`,
  };

  // recieving tthe customers order
  const template_id = "template_5cj23hq";
  const template_params = {
    orders: cartItems,
    email: userProfile[0]?.email,
    order_id: nanoid(),
    full_name: `${userAddressData.first_name} ${userAddressData.last_name}`,
    total: `${totalCheckout.toFixed(2)}`,
    address: userAddressData.address,
    phone_number: userAddressData.phone_number,
    additional_phone_number: userAddressData.additional_phone_number,
    city: userAddressData.city,
    region: userAddressData.region,
    additional_information: userAddressData.additional_information,
  };

  const confirmOrder = () => {
    // send to customer
    emailjs.send(serviceID, templateID, templateParams, public_key);
    // recieve customer's order
    emailjs.send(serviceID, template_id, template_params, public_key);
    success();
    dispatch(renderCheckoutConfirmedStatus(true));
  };

  const totalCheckoutForLocalCart = localCart.reduce(
    (sum, item) => sum + parseFloat(String(item.total_price)),
    0
  );

  return (
    <>
      {contextHolder}
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

        {userAddressData && path === "/confirm_order" ? (
          <button
            disabled={!isAddressValid(userAddressData) || cart.length === 0}
            onClick={() => confirmOrder()}
            className="checkout_btn"
          >
            Confirm Order{" "}
            {cookie["token"]
              ? `₵${totalCheckout.toFixed(2)}`
              : `₵${totalCheckoutForLocalCart.toFixed(2)}`}
          </button>
        ) : (
          <button
            disabled={path === "/checkout_address"}
            onClick={() =>
              cookie["token"]
                ? navigate("/checkout_address")
                : navigate("/signin")
            }
            className="checkout_btn"
          >
            Checkout{" "}
            {cookie["token"]
              ? `₵${totalCheckout.toFixed(2)}`
              : `₵${totalCheckoutForLocalCart.toFixed(2)}`}
          </button>
        )}
      </div>
    </>
  );
};

export default memo(CheckOutModal);
