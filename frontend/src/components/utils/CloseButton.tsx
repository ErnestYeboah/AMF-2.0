import { memo } from "react";
import { useDispatch } from "react-redux";
import { toggleDeleteAccountModalView } from "../../features/ProductsApiSlice";

const CloseButton = () => {
  const dispatch = useDispatch();
  return (
    <button
      className="close_btn"
      onClick={() => dispatch(toggleDeleteAccountModalView(false))}
    >
      x
    </button>
  );
};

export default memo(CloseButton);
