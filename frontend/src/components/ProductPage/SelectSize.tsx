import "@ant-design/v5-patch-for-react-19";
import { Radio } from "antd";
import type { CheckboxGroupProps } from "antd/es/checkbox";
import { useDispatch, useSelector } from "react-redux";
import {
  getClothingSize,
  getShoeSize,
  product_data,
} from "../../features/ProductsApiSlice";
import { useEffect } from "react";

const ClothingSize: CheckboxGroupProps<string>["options"] = [
  { label: "S", value: "S" },
  { label: "M", value: "M" },
  { label: "L", value: "L" },
  { label: "XL", value: "XL" },
  { label: "XXL", value: "XXL" },
  { label: "XXXL", value: "XXXL" },
];

const ShoesSize: CheckboxGroupProps<string>["options"] = [
  { label: "30", value: "30" },
  { label: "35", value: "35" },
  { label: "40", value: "40" },
  { label: "42", value: "42" },
  { label: "45", value: "45" },
  { label: "48", value: "48" },
];

type Category = "Clothing" | "Shoes" | "";

const SelectSize = ({ category }: { category: Category }) => {
  const { clothing_size, shoe_size } = useSelector(product_data);
  const dispatch = useDispatch();

  useEffect(() => {
    if (clothing_size) console.log(clothing_size);
  }, [clothing_size]);

  return (
    <div>
      {category == "Clothing" ? (
        <Radio.Group
          className="flex_list"
          options={ClothingSize}
          optionType="button"
          value={clothing_size}
          name="clothing_size"
          onChange={(e) => dispatch(getClothingSize(e.target.value))}
        />
      ) : category === "Shoes" ? (
        <Radio.Group
          className="flex_list"
          options={ShoesSize}
          optionType="button"
          value={shoe_size}
          name="shoe_size"
          onChange={(e) => dispatch(getShoeSize(e.target.value))}
        />
      ) : (
        <p>Sizes do not apply to this item</p>
      )}
    </div>
  );
};

export default SelectSize;
