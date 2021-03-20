import Offer from "./HomePage-components/Offer";
import { Link } from "react-router-dom";

const HomePage = (props) => {
  const { offers } = props;

  // createOfferComponent will be mapped to the offers state (wich is an array) in order to display every offer.
  const createOfferComponent = (item, index) => {
    const offerInfos = {
      id: item._id,
      ownerId: item.owner,
      ownerName: item.ownerName,
      ownerPicture: item.ownerPicture,
      productDetails: item.productDetails,
      productImage: item.productImage,
      productName: item.productName,
      productPrice: item.productPrice,
    };
    return <Offer key={offerInfos.id} offerInfos={offerInfos} />;
  };

  return (
    <div className="HomePage">
      <div className="banner">
        <div>
          <h2>Prêts à faire du tri dans vos placards?</h2>
          <Link className="publishLink" to="/user/publish">
            Commencer à vendre
          </Link>
        </div>
      </div>
      <div className="offersList">{offers.map(createOfferComponent)}</div>
    </div>
  );
};

export default HomePage;
