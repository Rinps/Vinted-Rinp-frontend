import axios from "axios";
import { useState, useMemo, useCallback } from "react";
import { useHistory } from "react-router-dom";
import { useDropzone } from "react-dropzone";

const SignupPage = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [picture, setPicture] = useState("");
  const history = useHistory();

  // We're going to add a new state to display a message if an information is missing. The dropMessage state is used to inform the user that a single picture is supposed to be posted with the offer.
  const [dropMessage, setDropMessage] = useState(
    "Drop your picture here (optionnal)"
  );

  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  };

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (username && email && password) {
      // Construct the formData that will be send to the server.
      const formData = new FormData();
      formData.append("userName", username);
      formData.append("userMail", email);
      formData.append("userPassword", password);
      formData.append("picture", picture);

      // Then simply send the request and send the user back on the home page.
      await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/offers/publish`,
        {
          headers: {},
        },
        { data: formData }
      );
      history.push("/");
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
    margin: 10,
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
        setPicture(acceptedFiles[0]);
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

  return (
    <form className="SignupPage" action="" onSubmit={handleSubmit}>
      <h1>S'inscrire</h1>
      <input
        className="textInput"
        type="text"
        value={username}
        onChange={handleUsernameChange}
        placeholder="Nom d'utilisateur"
      />
      <input
        className="textInput"
        type="text"
        value={email}
        onChange={handleEmailChange}
        placeholder="Email"
      />
      <input
        className="textInput"
        type="text"
        value={password}
        onChange={handlePasswordChange}
        placeholder="Mot de passe"
      />
      <MyDropzone className="dropzone" />
      <div className="checkbox">
        <input type="checkbox" />
        <h2>S'inscrire à notre newsletter</h2>
      </div>
      <p>
        En m'inscrivant, je confirme avoir lu et accepté les Termes &amp;
        Conditions et Politique de Confidentialité de Vinted, Je confirme avoir
        au moins 18 ans.
      </p>
      <input
        className="submit"
        type="submit"
        id="idSubmit"
        value="S'inscrire"
      />
    </form>
  );
};

export default SignupPage;
