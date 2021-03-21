import { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import Cookies from "js-cookie";
import axios from "axios";

const LoginPage = (props) => {
  const { setToken } = props;
  const [mail, setMail] = useState("");
  const [password, setPassword] = useState("");
  const [warning, setWarning] = useState();
  const history = useHistory();

  /* Handle every input change */

  const handleMailChange = (event) => {
    setMail(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  /* Handle the form submit */
  // Send a request to the server.
  const handleSubmit = async (event) => {
    event.preventDefault();
    if (mail && password) {
      try {
        const serverResponse = await axios({
          method: "post",
          url: `${process.env.REACT_APP_BACKEND_URL}/user/login`,
          header: {},
          data: { email: mail, password: password },
        });
        console.log("response", serverResponse);
        // Get the token and store it into a cookie.
        const token = serverResponse.data.token;
        Cookies.set("vinted-token", token, { expires: 1 });
        setToken(serverResponse.data.token);
        setWarning();

        // Go back to the Homepage
        history.push("/");
      } catch (error) {
        setWarning("An error occured. Please check your email and password.");
      }
    } else {
      setWarning("Please fill all fields before trying to log in");
    }
  };

  return (
    <form className="LoginPage" onSubmit={handleSubmit}>
      <h1>Login</h1>
      <input
        className="textInput"
        type="text"
        value={mail}
        onChange={handleMailChange}
        placeholder="Enter your email"
      />
      <input
        className="textInput"
        type="password"
        value={password}
        onChange={handlePasswordChange}
        placeholder="Enter your password"
      />
      {warning && <p className="warning">{warning}</p>}
      <input className="submit" type="submit" value="Se connecter" />
      <Link className="Link" to="/user/signup">
        New here? Create your account here!
      </Link>
    </form>
  );
};

export default LoginPage;
