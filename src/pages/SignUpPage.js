import { useState } from "react";
import axios from "axios";

function SignUpPage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordRepeat, setPasswordRepeat] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;

    switch (name) {
      case "username":
        setUsername(value);
        break;
      case "email":
        setEmail(value);
        break;
      case "password":
        setPassword(value);
        break;
      case "password-repeat":
        setPasswordRepeat(value);
        break;
      default:
        return;
    }
  };

  const handleSignUp = async (event) => {
    event.preventDefault();

    const body = {
      username,
      email,
      password,
    };

    await axios.post("/api/1.0/users", body);
  };

  let isSignUpBtnDisabled = true;

  if (password && passwordRepeat) {
    isSignUpBtnDisabled = password !== passwordRepeat;
  }

  return (
    <form>
      <h1>Sign Up</h1>
      <label htmlFor="username">Username</label>
      <input
        name="username"
        id="username"
        onChange={handleChange}
        value={username}
      />
      <label htmlFor="email">Email</label>
      <input
        name="email"
        id="email"
        type="email"
        onChange={handleChange}
        value={email}
      />
      <label htmlFor="password">Password</label>
      <input
        name="password"
        id="password"
        type="password"
        onChange={handleChange}
        value={password}
      />
      <label htmlFor="password-repeat">Password Repeat</label>
      <input
        name="password-repeat"
        id="password-repeat"
        type="password"
        onChange={handleChange}
        value={passwordRepeat}
      />
      <button disabled={isSignUpBtnDisabled} onClick={handleSignUp}>
        Sign Up
      </button>
    </form>
  );
}

export default SignUpPage;
