import { useDispatch, useSelector } from "react-redux";
import {
  product_data,
  slideToConfirmDeleteModal,
} from "../../features/ProductsApiSlice";
import { UserOutlined } from "@ant-design/icons";
import CloseButton from "../utils/CloseButton";
import { memo } from "react";

const FirstCautionBox = () => {
  const { userProfile } = useSelector(product_data);
  const dispatch = useDispatch();
  return (
    <div>
      <div className="first_caution_box">
        <h3>
          Delete {userProfile[0]?.email}
          <CloseButton />
        </h3>
        <div className="account_icon">
          <UserOutlined className="text-4xl" />
          <h2>{userProfile[0]?.email}</h2>
        </div>
        <div className="btn_wrapper">
          <button onClick={() => dispatch(slideToConfirmDeleteModal())}>
            I want to delete this account
          </button>
        </div>
      </div>
    </div>
  );
};

export default memo(FirstCautionBox);
