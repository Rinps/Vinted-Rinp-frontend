import { useState } from "react";
import { Link } from "react-router-dom";
import logo from "../assets/images/Logo-Vinted.png";
import Cookies from "js-cookie";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Header = (props) => {
  const [search, setSearch] = useState("");
  const [maxPrice, setMaxPrice] = useState();
  const [minPrice, setMinPrice] = useState();
  const [sort, setSort] = useState("price-asc");
  const [offersLimit, setOffersLimit] = useState(20);
  const { token, setToken, setSearchURL } = props;

  // The handlers for every search parameters.
  const handleChangeSearch = (event) => {
    const newValue = event.target.value;
    setSearch(newValue);
  };

  const handleChangeMax = (event) => {
    const newValue = event.target.value;
    setMaxPrice(newValue);
  };

  const handleChangeMin = (event) => {
    const newValue = event.target.value;
    setMinPrice(newValue);
  };

  const handleChangeSort = (event) => {
    const newValue = event.target.value;
    setSort(newValue);
  };

  const handleChangeOffersLimit = (event) => {
    const newValue = event.target.value;
    if (Number.isInteger(parseInt(newValue, 10)) && newValue > 0) {
      setOffersLimit(newValue);
    }
  };

  // Handler for the search submit. It updates the searchURL state, wich will be used by App to make the server request.
  const handleSubmitSearch = (event) => {
    event.preventDefault();
    const newString = [
      `${process.env.REACT_APP_BACKEND_URL}/offers/search?offersLimit=${offersLimit}&sort=${sort}`,
    ];
    if (search) {
      newString.push(`&title=${search}`);
    }

    if (maxPrice) {
      newString.push(`&priceMax=${maxPrice}`);
    }

    if (minPrice) {
      newString.push(`&priceMin=${minPrice}`);
    }

    const newURL = newString.join("");
    setSearchURL(newURL);
  };

  // Handler for the Logout button
  const handleLogout = (event) => {
    Cookies.remove("vinted-token");
    setToken(false);
  };

  return (
    <div className="Header">
      <Link to="/">
        <img src={logo} alt="logo" />
      </Link>
      <form onSubmit={handleSubmitSearch}>
        <div className="searchBar">
          <button className="submitSearch" type="submit" value="Search">
            <FontAwesomeIcon icon="search" />
          </button>
          <input
            className="searchText"
            type="text"
            value={search}
            onChange={handleChangeSearch}
            placeholder="What are your looking for?"
          />
        </div>
        <div>
          <input
            className="priceLimit"
            type="number"
            value={maxPrice}
            onChange={handleChangeMax}
            placeholder="Max €"
          />
          <input
            className="priceLimit"
            type="number"
            value={minPrice}
            onChange={handleChangeMin}
            placeholder="Min €"
          />
        </div>
        <select type="select" value={sort} onChange={handleChangeSort}>
          <option value="price-asc">Cheapest to expensive</option>
          <option value="price-desc">Expensive to cheapest</option>
        </select>
        <input
          className="offersLimit"
          type="number"
          value={offersLimit}
          onChange={handleChangeOffersLimit}
          placeholder="Number of offers to display on one page"
        />
      </form>
      {token ? (
        <Link id="logout" to="/" onClick={handleLogout}>
          Log out
        </Link>
      ) : (
        <div className="setUser">
          <Link id="signup" to="/user/signup">
            Sign up
          </Link>
          <Link id="login" to="/user/login">
            Log in
          </Link>
        </div>
      )}
      {token ? (
        <Link className="headerLink" to="/user/publish">
          Sell your stuff!
        </Link>
      ) : (
        <Link className="headerLink" to="/user/login">
          Sell your stuff!
        </Link>
      )}
    </div>
  );
};

export default Header;
