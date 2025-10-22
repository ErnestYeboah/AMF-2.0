import { type Product } from "../../features/ProductsApiSlice";

type Props = {
  searchValue: string;
  onclick: (name: string) => void;
  getSuggestions: Product[];
};

const SuggestionsBox = ({ searchValue, onclick, getSuggestions }: Props) => {
  return (
    <ul className="suggestions_box">
      {searchValue.length > 2 &&
        getSuggestions &&
        getSuggestions.map((item, index) => (
          <li onClick={() => onclick(item.name)} key={index}>
            {item.name}
          </li>
        ))}
    </ul>
  );
};

export default SuggestionsBox;
