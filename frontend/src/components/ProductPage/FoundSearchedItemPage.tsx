import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import {
  getSearchValue,
  product_data,
  searchByName,
} from "../../features/ProductsApiSlice";
import ProductCard from "./ProductCard";
import { nanoid } from "@reduxjs/toolkit";
import "../ProductPage/products_page.css";
import YouMayAlsoLikeDiv from "./YouMayAlsoLikeDiv";

const FoundSearchedItemPage = () => {
  const { name: searchedName } = useParams();
  const dispatch = useDispatch();
  const { searchedProducts } = useSelector(product_data);

  // get the user selected item from suggestions list to display in the search placeholder
  useEffect(() => {
    dispatch(getSearchValue(searchedName));
    dispatch(searchByName(searchedName));
  }, [searchedName]);

  return (
    <>
      <div className="product_card_wrapper searched_products_wrapper">
        {searchedProducts &&
          searchedProducts.map((item, _) => (
            <ProductCard key={nanoid()} data={item} />
          ))}
      </div>
      <YouMayAlsoLikeDiv />
    </>
  );
};

export default FoundSearchedItemPage;
