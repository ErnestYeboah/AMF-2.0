import type { PopconfirmProps } from "antd";
import { Popconfirm } from "antd";
import { QuestionCircleOutlined } from "@ant-design/icons";
import { useDispatch } from "react-redux";
import { removeFromCart, removeFromLocalCart } from "../../features/CartSlice";
import { useCookies } from "react-cookie";

type DeleteProp = {
  product_name: string;
  id: number;
};

const RemoveFormCartButton = ({ product_name, id }: DeleteProp) => {
  const dispatch = useDispatch();
  const [cookie] = useCookies(["token"]);

  const confirm: PopconfirmProps["onConfirm"] = () => {
    return cookie["token"]
      ? dispatch(removeFromCart({ id: id, token: cookie["token"] }))
      : dispatch(removeFromLocalCart(id));
  };

  return (
    <Popconfirm
      title="Remove from cart"
      description={`Are you sure to remove ${product_name}?`}
      onConfirm={confirm}
      okText="Yes"
      cancelText="No"
      icon={<QuestionCircleOutlined style={{ color: "red" }} />}
    >
      <button className="remove_btn">Remove</button>
    </Popconfirm>
  );
};

export default RemoveFormCartButton;
