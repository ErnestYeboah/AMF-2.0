import { useSelector } from "react-redux";
import { product_data } from "../../features/ProductsApiSlice";
import ProductCard from "./ProductCard";
import { useEffect, useState } from "react";

const YouMayAlsoLikeDiv = () => {
  const { products } = useSelector(product_data);
  const [random, setRandom] = useState(0);
  function callRandom() {
    setRandom(Math.floor(Math.random() * productsToShowForYou.length));
  }
  useEffect(() => {
    callRandom();
  }, []);

  const firstFiveProducts = products.slice(0, 2);
  const anotherFiveProducts = products.slice(2, 4);
  const anotherFive = products.slice(4, 6);

  const productsToShowForYou = [
    firstFiveProducts,
    anotherFiveProducts,
    anotherFive,
  ];

  return (
    <div className="similar_products_wrapper">
      <h2 className="mb-[1rem]">You may also like</h2>
      <div className="similar_products_div ">
        {productsToShowForYou[random].map((item, index) => (
          <ProductCard data={item} key={index} />
        ))}
      </div>
    </div>
  );
};

export default YouMayAlsoLikeDiv;
