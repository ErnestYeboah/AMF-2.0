import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { product_data } from "../../features/ProductsApiSlice";
import { useEffect } from "react";

const DetailedProductCard = () => {
  const { product_name } = useParams();
  const { products } = useSelector(product_data);

  const foundCard = products.find((product) => product.name === product_name);
  useEffect(() => {
    if (foundCard) console.log(foundCard.name);
  }, [foundCard]);

  return (
    <div className="detailed_product_card">
      <figure>
        <img src={foundCard?.image} alt="" />
      </figure>
      <div className="card_details">
        <p>{foundCard?.brief_note}</p>
        <h2>{foundCard?.name}</h2>
        <p>{foundCard?.category}</p>
        <p>{foundCard?.old_price}</p>
        <p>{foundCard?.price}</p>
        <p>{foundCard?.description}</p>
        <p>{foundCard?.is_available}</p>
      </div>
    </div>
  );
};

export default DetailedProductCard;
