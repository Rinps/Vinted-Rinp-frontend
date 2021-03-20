import "./Offer.css";
import { Link } from "react-router-dom";

const Offer = (props) => {
  const {
    ownerName,
    ownerPicture,
    productDetails,
    productImage,
    productName,
    productPrice,
    id,
  } = props.offerInfos;

  return (
    <div className="Offer">
      <div className="user">
        <img src={ownerPicture} alt="" />
        <p>{ownerName}</p>
      </div>
      <img src={productImage} alt="product" />
      <div className="product">
        <p className="price">{productPrice} €</p>
        <p className="size">{productDetails.size}</p>
        <p className="name">{productName}</p>
      </div>
      <Link
        className="link"
        to={`/payment/${id}/${productName}/${productPrice}/${ownerName}`}
      >
        Buy now!
      </Link>
    </div>
  );
};

export default Offer;
