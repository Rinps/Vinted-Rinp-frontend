import "./pages-css/PaymentPage.css";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import axios from "axios";

const PaymentPage = (props) => {
  // Get the offer ID and content from the URL and setup strip form.
  const { offerID, offerName, offerPrice, offerOwner } = useParams();
  const { token } = props;
  const [completed, setCompleted] = useState(false);
  const stripe = useStripe();
  const elements = useElements();

  // Handle the form submit
  const handleSubmit = async (event) => {
    event.preventDefault();
    // Get the user's card data.
    const cardElement = elements.getElement(CardElement);

    // Ask the API for a token
    const stripeResponse = await stripe.createToken(cardElement, {
      name: "Id de l'acheteur",
    });
    console.log("stripe response is: ", stripeResponse);

    // Check if the card numbers are ok, if not display an error in the console.

    if (stripeResponse.token && stripeResponse.token.id) {
      const stripeToken = stripeResponse.token.id;

      // Now thats we have the token, send the server the request... If we do have the token, of course!
      if (stripeToken) {
        const response = await axios.post(
          `{process.env.REACT_APP_BACKEND_URL}/payment`,
          {
            stripeToken: stripeToken,
            id: offerID,
            title: offerName,
            price: parseFloat(offerPrice),
            owner: offerOwner,
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        console.log("response: ", response);
        if (response.status === 200) {
          setCompleted(true);
        }
      }
    } else {
      console.log("stripe response: ", stripeResponse.error.message);
    }
  };

  return (
    <div className="PaymentPage">
      <div className="sumUp">
        <h3>Résumé de la commande</h3>
        <div className="detail">
          <div className="detailLine">
            <p>Commande</p>
            <p>{offerPrice} €</p>
          </div>
          <div className="detailLine">
            <p>Frais protection acheteurs</p>
            <p>0.40 €</p>
          </div>
          <div className="detailLine">
            <p>Frais de port</p>
            <p>0.80 €</p>
          </div>
        </div>
      </div>
      <div className="total">
        <div className="detailLine">
          <p>Total</p>
          <p>{(parseFloat(offerPrice) + 0.4 + 0.8).toFixed(2)} €</p>
        </div>
      </div>
      <p>
        Il ne vous reste plus qu'une étape pour vous offrir{" "}
        <strong>{offerName}</strong>. Vous allez payer{" "}
        <strong>{offerPrice} €</strong> (frais de protection et frais de port
        inclus).
      </p>
      {!completed ? (
        <form onSubmit={handleSubmit}>
          <div className="paymentForm">
            <CardElement
              options={{
                iconStyle: "solid",
                style: {
                  base: {
                    iconColor: "#1bb6bf",
                    color: "black",
                    border: "1px solid gray",
                    fontSize: "16px",
                  },
                  invalid: {
                    iconColor: "coral",
                    color: "coral",
                  },
                },
              }}
            />
          </div>
          <div className="payment">
            <button className="submitPayment" type="submit">
              Order
            </button>
          </div>
        </form>
      ) : (
        <span>It is done, all your money are belong to us!</span>
      )}
    </div>
  );
};

export default PaymentPage;
