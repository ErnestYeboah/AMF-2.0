import { useNavigate } from "react-router-dom";

const Featured = () => {
  const navigate = useNavigate();

  return (
    <div className="featured_wrapper">
      <h2 className="mb-[.5rem]">FEATURED</h2>
      <div className="featured_grid">
        <div className="card card_one">
          <p>
            Every necklace tells your story — unique, bold, and beautiful, just
            like you.
          </p>
          <button onClick={() => navigate("/products/category/jewelry")}>
            Shop
          </button>
        </div>
        <div className="card card_two">
          <p>
            Our latest necklace drop is turning heads — are you ready to stand
            out?
          </p>
          <button onClick={() => navigate("/products/category/jewelry")}>
            Shop
          </button>
        </div>
        <div className="card card_three">
          <p>Our hats don’t just block the sun, they turn heads.</p>
          <button onClick={() => navigate("/products/category/headwear")}>
            Shop
          </button>
        </div>
        <div className="card card_four">
          <p>Stay connected, stay on time — redefine smart with every tick.</p>
          <button onClick={() => navigate("/products/category/watches")}>
            Shop
          </button>
        </div>
      </div>
    </div>
  );
};

export default Featured;
