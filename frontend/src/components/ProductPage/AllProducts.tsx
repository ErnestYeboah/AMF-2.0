import { useSelector } from "react-redux";
import { product_data } from "../../features/ProductsApiSlice";
import ProductCard from "./ProductCard";
import { nanoid } from "@reduxjs/toolkit";
import "./products_page.css";
import Skeleton from "../utils/Skeleton";

const AllProducts = () => {
  const { products, fetch_product_status } = useSelector(product_data);

  return (
    <>
      {fetch_product_status === "pending" && <Skeleton />}

      <div className="product_card_wrapper">
        {products &&
          products.map((product, _) => (
            <ProductCard data={product} key={nanoid()} />
          ))}
      </div>
    </>
  );
};

export default AllProducts;
