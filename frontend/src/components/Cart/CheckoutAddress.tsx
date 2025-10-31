// "https://ipapi.co/json/"

import { useNavigate } from "react-router-dom";
import CheckOutModal from "./CheckOutModal";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  cartApiData,
  fetchCities,
  saveAddressForm,
  type AddressForm,
} from "../../features/CartSlice";
import Box from "@mui/material/Box";
import LinearProgress from "@mui/material/LinearProgress";
import { useCookies } from "react-cookie";
import { toast } from "react-toastify";

const CheckoutAddress = () => {
  const {
    regions,
    cities,
    get_city_status,
    get_region_status,
    userAddressData,
  } = useSelector(cartApiData);
  const dispatch = useDispatch();
  const [cookie] = useCookies(["token"]);
  const navigate = useNavigate();
  const [city_region_error, setCityRegionError] = useState("");
  const [addresForm, setAddressForm] = useState<AddressForm>({
    first_name: "",
    last_name: "",
    phone_number: "",
    additional_phone_number: "",
    address: "",
    additional_information: "",
    region: "",
    city: "",
  });

  useEffect(() => {
    if (userAddressData) {
      setAddressForm(userAddressData);
    }
  }, [userAddressData]);

  const {
    first_name,
    last_name,
    phone_number,
    additional_information,
    additional_phone_number,
    address,
    region,
    city,
  } = addresForm;

  const getAddressInput = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setAddressForm({
      ...addresForm,
      [name]: value,
    });
  };

  useEffect(() => {
    if (region) {
      dispatch(fetchCities(region));
    }
  }, [region]);

  const saveUserAddressForm = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!region && !city) {
      setCityRegionError(
        "The region and city displayed is not selected , please select a region and city to continue "
      );
    } else {
      if (
        region &&
        city &&
        first_name &&
        last_name &&
        phone_number &&
        address
      ) {
        dispatch(
          saveAddressForm({ token: cookie["token"], addressData: addresForm })
        );
        navigate("/confirm_order");
      } else {
        toast.error("Fill all the details to continue", {
          hideProgressBar: true,
        });
      }
    }
  };

  useEffect(() => {
    if (city && region) {
      setCityRegionError("");
    }
  }, [city, region]);

  return (
    <>
      <h2 className="text-[var(--accent-color)] address-h2">
        CUSTOMER ADDRESS
      </h2>
      <div className="address_form_wrapper">
        <form onSubmit={saveUserAddressForm} className="address_form" action="">
          <div className="input_group">
            <label htmlFor="first_name">First Name</label>
            <input
              onChange={getAddressInput}
              type="text"
              value={first_name}
              name="first_name"
              id="first_name"
              required
              placeholder="Type your First Name"
            />
          </div>
          <div className="input_group">
            <label htmlFor="last_name">Last Name</label>
            <input
              onChange={getAddressInput}
              value={last_name}
              type="text"
              name="last_name"
              id="last_name"
              required
              placeholder="Type your Last Name"
            />
          </div>
          <div className="input_group">
            <label htmlFor="phone_number">Dial your Phone Number</label>
            <input
              onChange={getAddressInput}
              value={phone_number}
              type="tel"
              name="phone_number"
              id="phone_number"
              required
              placeholder="Enter your phone number"
              maxLength={10}
            />
          </div>
          <div className="input_group">
            <label htmlFor="additional_phone_number">
              Addtional Phone Number
            </label>
            <input
              onChange={getAddressInput}
              value={additional_phone_number}
              type="tel"
              name="additional_phone_number"
              id="additional_phone_number"
              maxLength={10}
              placeholder="Enter additional phone number"
            />
          </div>
          <div className="input_group address_input">
            <label htmlFor="address">Address</label>
            <input
              onChange={getAddressInput}
              value={address}
              type="text"
              name="address"
              id="address"
              required
              placeholder="Type your Address"
            />
          </div>
          <div className="input_group additonal_info_input">
            <label htmlFor="additional_information">
              Additional Information
            </label>
            <input
              onChange={getAddressInput}
              value={additional_information}
              type="text"
              name="additional_information"
              id="additional_information"
              placeholder="Type an additional information"
            />
          </div>

          <div className="input_group">
            <label htmlFor="region">Region</label>
            <select
              onChange={getAddressInput}
              value={region}
              name="region"
              id="region"
              required
            >
              <option value={region || ""}>
                {region || "Select a region"}
              </option>
              {regions &&
                regions.map((region, index) => (
                  <option key={index} value={region.name}>
                    {region.name}
                  </option>
                ))}
            </select>
            {get_region_status === "pending" && (
              <Box sx={{ width: "100%" }}>
                <LinearProgress />
              </Box>
            )}
          </div>
          <div className="input_group">
            <label htmlFor="city">City</label>
            <select
              required
              onChange={getAddressInput}
              value={city || ""}
              name="city"
              id="city"
            >
              <option value={city || ""}>{city || "Select a city"}</option>
              {cities &&
                cities.map((city, index) => (
                  <option key={index} value={city}>
                    {city}
                  </option>
                ))}
            </select>
            {get_city_status === "pending" && (
              <Box sx={{ width: "100%" }}>
                <LinearProgress />
              </Box>
            )}
          </div>
          {city_region_error && (
            <p className="text-red-500"> {city_region_error}</p>
          )}
          <div className="btns">
            <button type="button" onClick={() => navigate("/cart")}>
              Cancel
            </button>
            <button>Save</button>
            <button type="button" onClick={() => navigate("/confirm_order")}>
              Skip
            </button>
          </div>
        </form>
        <CheckOutModal />
      </div>
    </>
  );
};

export default CheckoutAddress;
