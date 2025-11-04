import { useSelector } from "react-redux";
import { cartApiData } from "../../features/CartSlice";

const AddressCard = () => {
  const { userAddressData } = useSelector(cartApiData);

  return (
    <div className="address_card space-y-1">
      <p>
        <span className="text-[var(--accent-color)]">First Name:</span>{" "}
        {userAddressData.first_name}
      </p>
      <p>
        <span className="text-[var(--accent-color)]">Last Name:</span>{" "}
        {userAddressData.last_name}
      </p>
      <p>
        <span className="text-[var(--accent-color)]">Full Name:</span>{" "}
        {userAddressData.last_name} {userAddressData.first_name}
      </p>
      <p>
        <span className="text-[var(--accent-color)]">Phone Number:</span>{" "}
        {userAddressData.phone_number}
      </p>
      <p>
        <span className="text-[var(--accent-color)]">Side Number:</span>{" "}
        {userAddressData.additional_phone_number}
      </p>
      <p>
        <span className="text-[var(--accent-color)]">Address:</span>{" "}
        {userAddressData.address}
      </p>
      <p>
        <span className="text-[var(--accent-color)]">Extra Info:</span>{" "}
        {userAddressData.additional_information}
      </p>
      <p>
        <span className="text-[var(--accent-color)]">Region:</span>{" "}
        {userAddressData.region}
      </p>
      <p>
        <span className="text-[var(--accent-color)]">City/Town:</span>{" "}
        {userAddressData.city}
      </p>
    </div>
  );
};

export default AddressCard;
