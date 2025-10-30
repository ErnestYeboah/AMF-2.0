import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import {
  product_data,
  searchByCategory,
} from "../../features/ProductsApiSlice";
import ProductCard from "./ProductCard";
import Skeleton from "../utils/Skeleton";

const CategoryProductPage = () => {
  const dispatch = useDispatch();
  const { category } = useParams();
  const { categoryProducts, search_by_category_status } =
    useSelector(product_data);

  useEffect(() => {
    if (category) {
      dispatch(searchByCategory(category));
    }
  }, [category]);

  return (
    <>
      {search_by_category_status === "pending" && <Skeleton />}
      <div className="product_card_wrapper">
        {categoryProducts &&
          categoryProducts.map((product, index) => (
            <ProductCard data={product} key={index} />
          ))}
      </div>
    </>
  );
};

export default CategoryProductPage;
