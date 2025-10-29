import { useCookies } from "react-cookie";
import { Link } from "react-router-dom";

const EmptyMessage = ({ object = "cart" }: { object: "cart" | "favorite" }) => {
  const [cookie] = useCookies(["token"]);

  return (
    <>
      {object === "cart" ? (
        <div className="empty_cart_message empty_message">
          <figure>
            <img src="/assests/shopping-color-icon.svg" alt="" />
          </figure>
          <p>Your cart is empty</p>
          <Link
            className="bg-[var(--accent-color)] transition duration-300 text-white py-[.5em] max-w-fit px-[1em] block mx-auto rounded-[var(--radius)] hover:bg-transparent hover:text-[var(--accent-color)] hover:outline-2 hover:outline-[var(--accent-color)] "
            to={"/products"}
          >
            Start Shopping
          </Link>
          {!cookie["token"] && (
            <Link className="text-[var(--accent-color)]" to={"/signin"}>
              Sign in for better experience
            </Link>
          )}
        </div>
      ) : (
        <div className="empty_favorite_message empty_message">
          <figure>
            <img src="/assests/red-calligraphy-heart.png" alt="heart" />
          </figure>
          <p>No Favorite Items</p>
          {!cookie["token"] && (
            <Link
              className="bg-[var(--accent-color)] transition duration-300 text-white py-[.5em] max-w-fit px-[1em] block mx-auto rounded-[var(--radius)] hover:bg-transparent hover:text-[var(--accent-color)] hover:outline-2 hover:outline-[var(--accent-color)] "
              to={"/products"}
            >
              Sign in to add items to favorites
            </Link>
          )}
        </div>
      )}
    </>
  );
};

export default EmptyMessage;
