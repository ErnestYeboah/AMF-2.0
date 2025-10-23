import { useSelector } from "react-redux";
import { product_data } from "../../features/ProductsApiSlice";
import { useNavigate } from "react-router-dom";

const NoSearchResults = () => {
  const navigate = useNavigate();
  const { search_value } = useSelector(product_data);

  return (
    <div className="no_search_results_wrapper space-y-4">
      <figure>
        <img src={"/assests/binoculars.389fc56a.svg"} alt="" />
      </figure>
      <div>
        <p>
          <b>
            ~There are no results for <b>"{search_value}"</b>
          </b>
        </p>
        <p>~Check your spelling for typing errors</p>
        <p>~Try searching with short and simple words</p>
      </div>

      <button onClick={() => navigate("/")}>Go to Homepage</button>
    </div>
  );
};

export default NoSearchResults;
