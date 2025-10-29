import { useSelector } from "react-redux";
import { cartApiData } from "../../features/CartSlice";
import CheckOutModal from "./CheckOutModal";
import { IoCheckmarkCircle } from "react-icons/io5";
import CartItemCard from "./CartItemCard";
import { useCookies } from "react-cookie";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const ConfirmOrder = () => {
  const { userAddressData, cart } = useSelector(cartApiData);
  const [cookie] = useCookies(["token"]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!cookie["token"]) navigate("/cart");
  }, [cookie]);

  return (
    <div className="confirm_order_page">
      <div className="first_col">
        <div className="customer__address">
          <h2 className="flex gap-1 mb-[1rem] ">
            <IoCheckmarkCircle
              className={userAddressData ? "text-green-500" : "text-red-500"}
            />
            CUSTOMER ADDRESS
          </h2>
          <h3 className="mb-[.2rem]">ADDRESS BOOK</h3>
          <div className="address_card space-y-1">
            <p>
              <span className="text-[var(--accent-color)]">First Name:</span>{" "}
              {userAddressData.first_name}
            </p>
            <p>
              <span className="text-[var(--accent-color)]">Last Name:</span>{" "}
              {userAddressData.last_name}
            </p>
            <p>
              <span className="text-[var(--accent-color)]">Full Name:</span>{" "}
              {userAddressData.last_name} {userAddressData.first_name}
            </p>
            <p>
              <span className="text-[var(--accent-color)]">Phone Number:</span>{" "}
              {userAddressData.phone_number}
            </p>
            <p>
              <span className="text-[var(--accent-color)]">Side Number:</span>{" "}
              {userAddressData.additional_phone_number}
            </p>
            <p>
              <span className="text-[var(--accent-color)]">Address:</span>{" "}
              {userAddressData.address}
            </p>
            <p>
              <span className="text-[var(--accent-color)]">Extra Info:</span>{" "}
              {userAddressData.additional_information}
            </p>
            <p>
              <span className="text-[var(--accent-color)]">Region:</span>{" "}
              {userAddressData.region}
            </p>
            <p>
              <span className="text-[var(--accent-color)]">City/Town:</span>{" "}
              {userAddressData.city}
            </p>
          </div>
        </div>
        <div className="cart_items">
          {cart &&
            cart.map((item, index) => <CartItemCard key={index} data={item} />)}
        </div>
      </div>

      <CheckOutModal />
    </div>
  );
};

export default ConfirmOrder;
