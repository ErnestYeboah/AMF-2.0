import { useState } from "react";
import { Link } from "react-router-dom";

export const categoriesList = [
  { category: "all", to: "/products" },
  { category: "shoes & sneakers", to: "/products/category/shoes" },
  { category: "clothing", to: "/products/category/clothing" },
  { category: "accessories", to: "/products/category/accessories" },
  { category: "headwear", to: "/products/category/headwear" },
  { category: "jewelry", to: "/products/category/jewelry" },
  { category: "watches", to: "/products/category/watches" },
];

const SearchCategory = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  return (
    <div className="category_wrapper">
      {categoriesList.map((list, index) => (
        <Link
          onClick={() => setCurrentIndex(index)}
          to={list.to}
          className={index == currentIndex ? "active capitalize" : "capitalize"}
          key={index}
        >
          {list.category}
        </Link>
      ))}
    </div>
  );
};

export default SearchCategory;
