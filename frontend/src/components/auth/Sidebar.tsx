import { Link } from "react-router-dom";
import {
  UserOutlined,
  HistoryOutlined,
  SettingOutlined,
  BookOutlined,
} from "@ant-design/icons";
import { useCookies } from "react-cookie";
const Sidebar = () => {
  const [cookie] = useCookies(["token"]);
  return (
    <div className="sidebar">
      <div className="link link1">
        <UserOutlined />
        <Link to={"/my_account"}>My Account</Link>
      </div>
      <div className="link link2">
        <HistoryOutlined />
        <Link to={"/history"}>Recently Viewed</Link>
      </div>
      <div className="link link3">
        <SettingOutlined />
        <Link to={`/account_settings/${cookie["token"].slice(0, 6)}`}>
          Account Management
        </Link>
      </div>
      <div className="link link4">
        <BookOutlined />
        <Link to={"/address"}>Address Book</Link>
      </div>
    </div>
  );
};

export default Sidebar;
