import { IoCheckmarkCircle } from "react-icons/io5";
import { useDispatch } from "react-redux";
import { renderCheckoutConfirmedStatus } from "../../features/CartSlice";
import { useNavigate } from "react-router-dom";

const CheckoutSuccessPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleBtnClicked = () => {
    dispatch(renderCheckoutConfirmedStatus(false));
    navigate("/cart");
  };
  return (
    <div className="checkout_success_wrapper">
      <IoCheckmarkCircle className="text-green-500 text-6xl" />
      <h2>Your Order has been Confirmed</h2>
      <button onClick={handleBtnClicked}>Continue</button>
    </div>
  );
};

export default CheckoutSuccessPage;
