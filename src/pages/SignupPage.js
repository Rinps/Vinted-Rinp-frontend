import axios from "axios";
import { useState } from "react";
import { useHistory } from "react-router-dom";

const SignupPage = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const history = useHistory();

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
    await axios({
      method: "post",
      url: `${process.env.REACT_APP_BACKEND_URL}/user/signup`,
      headers: {},
      data: {
        userName: username,
        userMail: email,
        userPassword: password,
      },
    });
    history.push("/");
  };

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
