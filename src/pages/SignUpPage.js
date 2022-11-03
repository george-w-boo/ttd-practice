import { useState } from "react";

function SignUpPage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordRepeate, setPasswordRepeat] = useState("");

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

  let isSignUpBtnDisabled = true;

  if (password && passwordRepeate) {
    isSignUpBtnDisabled = password !== passwordRepeate;
  }

  return (
    <div>
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
        value={passwordRepeate}
      />
      <button disabled={isSignUpBtnDisabled}>Sign Up</button>
    </div>
  );
}

export default SignUpPage;
