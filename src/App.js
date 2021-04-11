// Import packages
import "./App.css";
import Header from "./pages/Header";
import HomePage from "./pages/HomePage";
import OfferPage from "./pages/OfferPage";
import SignupPage from "./pages/SignupPage";
import LoginPage from "./pages/LoginPage";
import PublishPage from "./pages/PublishPage";
import PaymentPage from "./pages/PaymentPage";
import { useState, useEffect } from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import { useDebounce } from "use-debounce";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import Cookies from "js-cookie";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
const axios = require("axios");
library.add(faSearch);

const App = () => {
  // Create states.
  const [token, setToken] = useState();
  const [offers, setOffers] = useState([]);
  const [searchURL, setSearchURL] = useState(
    `${process.env.REACT_APP_BACKEND_URL}/offers`
  );
  const [isLoading, setIsLoading] = useState(true);
  const [debouncedSearchURL] = useDebounce(searchURL, 2000);

  // Create a Stripe promise in order to allow a user to make a payment.
  const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC);

  useEffect(() => {
    const fetchData = async () => {
      // Create a new array, so that React update the state when setOffers is used.
      const newOffers = [];
      const serverResponseOffers = await axios.get(searchURL);
      const serverResponseUsers = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/users`
      );
      const usersData = serverResponseUsers.data;

      // Each offer that the server gives us must be pushed into the newOffers array before we set the state.
      serverResponseOffers.data.forEach((item) => {
        // Get the owner of the offer.
        const owner = usersData.find((element) => {
          return (item.owner === element.id)});

        // Get the owner name and picture.
        const ownerName = owner.account.username;
        const ownerPicture = owner.account.avatar;

        // We're going to add the owner name and picture to each offer that we want to display.
        const offerToPush = item;
        offerToPush.ownerName = ownerName;
        offerToPush.ownerPicture = ownerPicture;

        newOffers.push(offerToPush);
      });
      setOffers(newOffers);
      setIsLoading(false);
    };
    fetchData();
     if (Cookies.get("vinted-token")) {
      setToken(Cookies.get("vinted-token"));
    } else {
      setToken(false);
    }
  }, [debouncedSearchURL, searchURL]);


  return (
    // Create the nav list containing every pages of the website.
    <BrowserRouter>
      <Header token={token} setToken={setToken} setSearchURL={setSearchURL} />

      {/* Set the switch to display the chosen route. */}
      <Switch>
        <Route path="/offer/:id">
          <OfferPage />
        </Route>
        <Route path="/payment/:offerID/:offerName/:offerPrice/:offerOwner">
          {token ? (
            <Elements stripe={stripePromise}>
              <PaymentPage token={token} setSearchURL={setSearchURL} />
            </Elements>
          ) : (
            <LoginPage />
          )}
        </Route>
        <Route path={"/user/signup"}>
          <SignupPage />
        </Route>
        <Route path={"/user/login"}>
          <LoginPage setToken={setToken} />
        </Route>
        <Route path={"/user/publish"}>
          <PublishPage token={token} />
        </Route>
        <Route path={"/"}>
          {isLoading ? (
            <p>Chargement en cours</p>
          ) : (
            <HomePage offers={offers} />
          )}
        </Route>
      </Switch>
    </BrowserRouter>
  );
};

export default App;
