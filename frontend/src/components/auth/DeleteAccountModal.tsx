import { useSelector } from "react-redux";
import ConfirmDeleteBox from "./ConfirmDeleteBox";
import FirstCautionBox from "./FirstCautionBox";
import "./auth.css";
import { product_data } from "../../features/ProductsApiSlice";

const DeleteAccountModal = () => {
  const { deleteAccountModalView, currentView } = useSelector(product_data);
  return (
    <div
      className={
        deleteAccountModalView
          ? "delete_account_wrapper active"
          : "delete_account_wrapper"
      }
    >
      <div
        className="delete_account_modal"
        style={{ translate: `-${currentView}00% 0` }}
      >
        <FirstCautionBox />
        <ConfirmDeleteBox />
      </div>
    </div>
  );
};

export default DeleteAccountModal;
