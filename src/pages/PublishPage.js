import "./pages-css/PublishPage.css";
import { useState, useCallback, useMemo } from "react";
import { Redirect, useHistory } from "react-router-dom";
import { useDropzone } from "react-dropzone";
import axios from "axios";

const PublishPage = (props) => {
  // Extract token from the props and use the history object.
  const { token } = props;
  const history = useHistory();

  // Setup states, each one will be used to store information to send to the server.
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newPrice, setNewPrice] = useState(0);
  const [newCondition, setNewCondition] = useState("");
  const [newCity, setNewCity] = useState("");
  const [newBrand, setNewBrand] = useState("");
  const [newSize, setNewSize] = useState("");
  const [newColor, setNewColor] = useState("");
  const [newPicture, setNewPicture] = useState("");

  // We're going to add a new state to display a message if an information is missing. The dropMessage state is used to prevent the user that a single picture is supposed to be posted with the offer.
  const [validOffer, setValidOffer] = useState(true);
  const [dropMessage, setDropMessage] = useState(
    "Drop the product's picture here"
  );

  // Setup the handler for each input, so we can change their content.
  const handleTitleChange = (event) => {
    setNewTitle(event.target.value);
  };

  const handleDescriptionChange = (event) => {
    setNewDescription(event.target.value);
  };

  const handlePriceChange = (event) => {
    setNewPrice(event.target.value);
  };

  const handleConditionChange = (event) => {
    setNewCondition(event.target.value);
  };

  const handleCityChange = (event) => {
    setNewCity(event.target.value);
  };

  const handleBrandChange = (event) => {
    setNewBrand(event.target.value);
  };

  const handleSizeChange = (event) => {
    setNewSize(event.target.value);
  };

  const handleColorChange = (event) => {
    setNewColor(event.target.value);
  };

  // Form submit handler.
  const handleSubmit = async (event) => {
    event.preventDefault();
    // Check if every information has been specified. If not, the state validOffer becomes false.
    if (
      newTitle &&
      newBrand &&
      newCity &&
      newColor &&
      newCondition &&
      newDescription &&
      newPicture &&
      newPrice &&
      newSize
    ) {
      // Construct the formData that will be send to the server.
      const formData = new FormData();
      formData.append("title", newTitle);
      formData.append("description", newDescription);
      formData.append("price", newPrice);
      formData.append("picture", newPicture);
      formData.append("size", newSize);
      formData.append("brand", newBrand);
      formData.append("city", newCity);
      formData.append("color", newColor);
      formData.append("condition", newCondition);

      // Then simply send the request and send the user back on the home page.
      await axios.post(`http://localhost:3150/offers/publish`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      history.push("/");
    } else {
      setValidOffer(false);
    }
  };

  // We're defining the dropzone style here.
  const baseStyle = {
    width: "500px",
    height: "200px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    color: "gray",
    border: "2px dashed gray",
  };

  const activeStyle = {
    border: "2px dashed blue",
  };

  const acceptStyle = {
    border: "2px dashed #1bb6bf",
  };
  const rejectStyle = {
    border: "2px dashed coral",
  };

  // Setup the dropzone for the file.

  function MyDropzone() {
    const onDrop = useCallback((acceptedFiles) => {
      if (acceptedFiles.length > 1) {
        setDropMessage("Only one file, please.");
      } else {
        setNewPicture(acceptedFiles[0]);
        setDropMessage("Ok that's enough, no more picture.");
      }
    }, []);
    const {
      getRootProps,
      getInputProps,
      isDragActive,
      isDragAccept,
      isDragReject,
    } = useDropzone({ onDrop });

    const style = useMemo(
      () => ({
        ...baseStyle,
        ...(isDragActive ? activeStyle : {}),
        ...(isDragAccept ? acceptStyle : {}),
        ...(isDragReject ? rejectStyle : {}),
      }),
      [isDragActive, isDragReject, isDragAccept]
    );

    return (
      <div {...getRootProps({ style })}>
        <input {...getInputProps()} />
        <p className="dropMessage">{dropMessage}</p>
      </div>
    );
  }

  return token ? (
    <div className="PublishPage">
      <form onSubmit={handleSubmit}>
        <h1>What do you wish to sell?</h1>
        <MyDropzone className="dropzone" />

        <input
          type="text"
          value={newTitle}
          placeholder="title"
          onChange={handleTitleChange}
        />
        <textarea
          className="descriptionInput"
          type="text"
          value={newDescription}
          placeholder="description"
          onChange={handleDescriptionChange}
          maxLength={300}
          rows={10}
        />
        <input
          type="number"
          value={newPrice}
          placeholder="price"
          onChange={handlePriceChange}
        />
        <input
          type="text"
          value={newCondition}
          placeholder="condition"
          onChange={handleConditionChange}
        />
        <input
          type="text"
          value={newCity}
          placeholder="city"
          onChange={handleCityChange}
        />
        <input
          type="text"
          value={newBrand}
          placeholder="brand"
          onChange={handleBrandChange}
        />
        <input
          type="text"
          value={newSize}
          placeholder="size"
          onChange={handleSizeChange}
        />
        <input
          type="text"
          value={newColor}
          placeholder="color"
          onChange={handleColorChange}
        />
        <input className="submit" type="submit" />
      </form>
      {!validOffer && <div>Please provide every necessary informations</div>}
    </div>
  ) : (
    <Redirect to="/" />
  );
};

export default PublishPage;
