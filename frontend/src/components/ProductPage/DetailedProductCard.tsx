import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { product_data } from "../../features/ProductsApiSlice";
import { useState } from "react";
import SelectSize from "./SelectSize";
import { useCookies } from "react-cookie";
import {
  addItemToLocalCart,
  saveToCart,
  type LocalCartState,
} from "../../features/CartSlice";
import { nanoid } from "@reduxjs/toolkit";

const DetailedProductCard = () => {
  const { product_name } = useParams();
  const { products, clothing_size, shoe_size } = useSelector(product_data);
  const [quantity, setQuantity] = useState(1);
  const [cookie] = useCookies(["token"]);
  const [sizeError, setSizeError] = useState("");
  const dispatch = useDispatch();

  const foundCard = products.find((product) => product.name === product_name);

  // for local cart
  const objectToAddToLocalCart: LocalCartState = {
    image: foundCard?.image,
    id: nanoid(),
    name: foundCard?.name,
    product_id: foundCard?.id,
    category: foundCard?.category,
    size: clothing_size || shoe_size || "no size",
    price: foundCard?.price,
    old_price: foundCard?.old_price,
    quantity: quantity,
    total_price: quantity * Number(foundCard?.price),
  };

  const addToLocalCart = () => {
    if (foundCard?.category !== "shoes" && foundCard?.category !== "clothing") {
      dispatch(addItemToLocalCart(objectToAddToLocalCart));
    } else {
      checkShoeIsValid();
      checkClothingSizeIsValid();
    }
  };

  // for api cart
  const objectToAddToCart = {
    name: foundCard?.name,
    product_id: foundCard?.id,
    category: foundCard?.category,
    size: clothing_size || shoe_size || "no size",
    price: foundCard?.price,
    quantity: quantity,
  };
  const addToCart = () => {
    if (foundCard?.category !== "shoes" && foundCard?.category !== "clothing") {
      dispatch(
        saveToCart({
          token: cookie["token"],
          productData: objectToAddToCart,
        })
      );
    } else {
      checkShoeIsValid();
      checkClothingSizeIsValid();
    }
  };

  function checkClothingSizeIsValid() {
    if (foundCard?.category === "clothing") {
      return !clothing_size
        ? setSizeError("Select a size")
        : cookie["token"] //after checking there is a size check if user is logged and save to his api cart else into the local cart
        ? dispatch(
            saveToCart({
              token: cookie["token"],
              productData: objectToAddToCart,
            })
          )
        : dispatch(addItemToLocalCart(objectToAddToLocalCart));
    }
  }

  function checkShoeIsValid() {
    if (foundCard?.category === "shoes") {
      return !shoe_size
        ? setSizeError("Select a size")
        : cookie["token"]
        ? dispatch(
            saveToCart({
              token: cookie["token"],
              productData: objectToAddToCart,
            })
          )
        : dispatch(addItemToLocalCart(objectToAddToLocalCart));
    }
  }

  return (
    <div className="detailed_product_card">
      <figure>
        <img src={foundCard?.image} alt="" />
      </figure>
      <div className="card_details">
        <div className="card_details_flex">
          <div className="flex_child_1 space-y-1">
            <p className="text-[var(--accent-color)]">
              {foundCard?.brief_note}
            </p>
            <h2 className="text-3xl">{foundCard?.name}</h2>
            <p className="opacity-35">{foundCard?.category}</p>
            <p>{foundCard?.is_available}</p>
          </div>
          <div className="flex_child_2">
            <p className="text-2xl text-[var(--accent-color)]">
              ₵{foundCard?.price}
            </p>
            <p>
              <s>₵{foundCard?.old_price}</s>
            </p>
          </div>
        </div>
        <SelectSize
          category={
            foundCard?.category == "shoes"
              ? "Shoes"
              : foundCard?.category === "clothing"
              ? "Clothing"
              : ""
          }
        />
        <p className="text-red-600">{sizeError}</p>
        <p>{foundCard?.description}</p>
        <div className="qty_input">
          <label htmlFor="quantity">Qty:</label>
          <input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            min={1}
            name="quantity"
            required
          />
        </div>
        <button
          onClick={
            cookie["token"]
              ? // if user is logged in save to the api cart else the local cart
                addToCart
              : addToLocalCart
          }
          className="my-4"
        >
          Add To Cart
        </button>
      </div>
    </div>
  );
};

export default DetailedProductCard;
