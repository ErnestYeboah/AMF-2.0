import { Link } from "react-router-dom";
import { categoriesList } from "../Navbar/SearchCategory";

const Footer = () => {
  return (
    <footer>
      <h2 className="company_name">Amaeton Fashion House</h2>

      <div>
        <h2 className="mb-[.5rem]">Quick Links</h2>
        <ul className="list_links space-y-2">
          {categoriesList.map((list, index) => (
            <Link key={index} to={list.to}>
              {list.category}
            </Link>
          ))}
        </ul>
      </div>
      <div className="cta">
        <h2>Call Us To Order</h2>
        <Link to={"tel: 0203631431"}>0203631431 &nbsp;</Link> / &nbsp;
        <Link to={"tel: 0591431484"}>0591431484</Link>
      </div>

      <p className="brand_name">&copy;Amaeton Fashion House</p>
    </footer>
  );
};

export default Footer;
