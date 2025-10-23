import { useNavigate } from "react-router-dom";

const TrendingProducts = () => {
  const navigate = useNavigate();
  return (
    <div className="trending_products_wrapper">
      <div className="text">
        <h2>MORE CHOICE</h2>
        <h2>MORE RUNNING</h2>
        <button
          className="mt-[.5rem]"
          onClick={() => navigate("/products/category/shoes")}
        >
          Shop Now
        </button>
      </div>

      <div className="trending_products">
        <div className="card card_one">
          <p>Nike Air Max 90</p>
          <button onClick={() => navigate("/products/category/shoes")}>
            Shop
          </button>
        </div>
        <div className="card card_two">
          <p>Nike Air Force 1</p>
          <button onClick={() => navigate("/products/category/shoes")}>
            Shop
          </button>
        </div>
        <div className="card card_three">
          <p>Nike Air Max 97</p>
          <button onClick={() => navigate("/products/category/shoes")}>
            Shop
          </button>
        </div>
        <div className="card card_four div4">
          <p>Nike Dunk Low</p>
          <button onClick={() => navigate("/products/category/shoes")}>
            Shop
          </button>
        </div>
        <div className="card card_five">
          <p>Nike Air Max 270</p>
          <button onClick={() => navigate("/products/category/shoes")}>
            Shop
          </button>
        </div>
        <div className="card card_six">
          <p>Nike Blazer Mid</p>
          <button onClick={() => navigate("/products/category/shoes")}>
            Shop
          </button>
        </div>
        <div className="card card_seven"></div>
        <div className="card card_eight">
          <p>Nike Cortez</p>
          <button onClick={() => navigate("/products/category/shoes")}>
            Shop
          </button>
        </div>
        <div className="card card_nine">
          <p>Nike Air Huarache</p>
          <button onClick={() => navigate("/products/category/shoes")}>
            Shop
          </button>
        </div>
        <div className="card card_ten">
          <p>Nike Air Max 95</p>
          <button onClick={() => navigate("/products/category/shoes")}>
            Shop
          </button>
        </div>
        <div className="card card_eleven">
          <p>Nike V2K Run</p>
          <button onClick={() => navigate("/products/category/shoes")}>
            Shop
          </button>
        </div>
        <div className="card card_twelve">
          <p>Nike Air Max 1</p>
          <button onClick={() => navigate("/products/category/shoes")}>
            Shop
          </button>
        </div>
      </div>
    </div>
  );
};

export default TrendingProducts;
