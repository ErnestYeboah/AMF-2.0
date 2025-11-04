import { useDispatch, useSelector } from "react-redux";
import Sidebar from "./Sidebar";
import {
  product_data,
  updateProfileImage,
} from "../../features/ProductsApiSlice";
import AddressCard from "../Cart/AddressCard";
import { TfiMarkerAlt } from "react-icons/tfi";
import "./auth.css";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import { Spin } from "antd";

const MyAccount = () => {
  const { userProfile, update_user_profile_image_status } =
    useSelector(product_data);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [cookie] = useCookies(["token"]);
  //   const [, setProfileImage] = useState<File | null>(null)

  const getProfileImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    dispatch(
      updateProfileImage({
        token: cookie["token"],
        profile_image: file,
        id: userProfile[0]?.id,
      })
    );
  };

  return (
    <div className="account_page">
      <Sidebar />
      <div className="my_account_wrapper">
        <div className="first_card">
          <h2>Account Details</h2>
          <div className="details">
            <figure>
              {update_user_profile_image_status === "pending" ? (
                <div className="loader">
                  <Spin />
                </div>
              ) : (
                <img src={userProfile[0]?.profile_image} alt="" />
              )}
            </figure>
            <div className="btn">
              <input
                type="file"
                name="profile_image"
                accept="image/*"
                className="opacity-0 cursor-pointer"
                onChange={getProfileImage}
              />
              <button>Change Profile</button>
            </div>
            <p>{userProfile[0]?.email}</p>
          </div>
        </div>

        <div className="last_card">
          <h2 className="flex justify-between items-center">
            Address Book
            <TfiMarkerAlt
              className="text-2xl text-[var(--accent-color)] cursor-pointer"
              onClick={() => navigate("/checkout_address")}
            />
          </h2>
          <AddressCard />
        </div>
      </div>
    </div>
  );
};

export default MyAccount;
