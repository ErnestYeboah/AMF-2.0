import { useSelector } from "react-redux";
import { product_data } from "../../features/ProductsApiSlice";
import ProductCard from "./ProductCard";
import "./products_page.css";
import Sidebar from "../auth/Sidebar";
import Skeleton from "@mui/material/Skeleton";

const History = () => {
  const { history, products, get_history_list_status } =
    useSelector(product_data);

  return (
    <>
      <div className="account_page">
        <Sidebar />
        <div>
          <h2 className="mx-[var(--padding-min)]">Recently Viewed Products</h2>
          {get_history_list_status === "pending" ? (
            <Skeleton />
          ) : (
            <div className="history_list_wrapper">
              {history &&
                history.map((historyItem, index) => {
                  const product = products.find(
                    (product) => product.id == historyItem?.product_id
                  );
                  return product && <ProductCard key={index} data={product} />;
                })}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default History;
