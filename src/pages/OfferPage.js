// Load packages
import { useEffect, useState, useParams } from "react";
const axios = require("axios");

const Offer = (props) => {
  // Set a product state, in wich we will store every product detail, and a isLoading state.
  const [product, setProduct] = useState();
  const [isLoading, setIsLoading] = useState(true);

  // Get the id from the URL and create the complete requestURL.
  const { id } = useParams;
  const requestURL = `/offer/${id}`;

  // The getProductDetails extract keys from productDetail and put them into an array containing objects. We will use this array to create the p beacons using a map.
  const objectIntoArray = (object) => {
    const newArray = [];
    const objectKeys = Object.keys(object);
    objectKeys.map((item) => {
      const newObject = { [item]: object[item] };
      newArray.push(newObject);
      return newArray;
    });
    return newArray;
  };

  useEffect(() => {
    // Get the offer details from the server, using its ID.
    const fetchData = async () => {
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}${requestURL}`
      );
      const offer = response.data;

      setProduct(offer);
      setIsLoading(false);
    };
    fetchData();
  }, [requestURL]);

  return isLoading ? (
    <p>Loading for now (and maybe FOREVER MOUAHAHAHAHAHAHAHA!</p>
  ) : (
    <div className="OfferPage">
      <img src={product.productImage} alt="" />
      <div className="offerSheet">
        <h2>{product.productPrice} €</h2>
        <div className="productDetails">
          {objectIntoArray(product.productDetails).map((element, index) => {
            const keys = Object.keys(element);
            const key = keys[0];
            return (
              <div className="detail" key={index}>
                <div className="detailKey">{key}</div>
                <div className="detailValue">{element[key]}</div>
              </div>
            );
          })}
        </div>
        <div className="productDescription">
          <h3>{product.productName}</h3>
          <p>{product.productDescription}</p>
          <div className="owner">
            <img src={product.owner.account.avatar} alt="" />
            <p>{product.owner.account.username}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Offer;
