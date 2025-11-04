import { useNavigate } from "react-router-dom";
import AddressCard from "../Cart/AddressCard";
import Sidebar from "./Sidebar";
import "./auth.css";
import { TfiMarkerAlt } from "react-icons/tfi";

const AddressBook = () => {
  const navigate = useNavigate();
  return (
    <div className="account_page">
      <Sidebar />
      <div>
        <h2 className="mb-2 flex justify-between items-center">
          Address Book
          <TfiMarkerAlt
            className="text-2xl text-[var(--accent-color)] cursor-pointer"
            onClick={() => navigate("/checkout_address")}
          />
        </h2>
        <AddressCard />
      </div>
    </div>
  );
};

export default AddressBook;
