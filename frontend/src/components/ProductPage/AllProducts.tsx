import { useSelector } from "react-redux";
import { product_data } from "../../features/ProductsApiSlice";
import ProductCard from "./ProductCard";
import { nanoid } from "@reduxjs/toolkit";
import "./products_page.css";

const AllProducts = () => {
  const { products } = useSelector(product_data);

  return (
    <>
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
