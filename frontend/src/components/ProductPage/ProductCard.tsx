import { Link } from "react-router-dom";
import type { Product } from "../../features/ProductsApiSlice";

const ProductCard = ({ data }: { data: Product }) => {
  const { name, price, image, brief_note } = data;

  return (
    <Link to={`/product/${name}`}>
      <div className="product_card">
        <figure>
          <img src={image} alt={name} />
        </figure>
        <div className="product_text space-y-1">
          <p className="opacity-50">{brief_note}</p>
          <p>{name}</p>
          <p className="text-[var(--accent-color)]">
            <b>₵{price}</b>
          </p>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
