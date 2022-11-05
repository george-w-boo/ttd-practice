import { useState } from "react";
import axios from "axios";

function SignUpPage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordRepeat, setPasswordRepeat] = useState("");
  const [isLoading, setIsLoading] = useState(false);

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

    setIsLoading(true);
    await axios.post("/api/1.0/users", body);
  };

  let isSignUpBtnDisabled = true;

  if (password && passwordRepeat) {
    isSignUpBtnDisabled = password !== passwordRepeat;
  }

  return (
    <div className="col-lg-6 offset-lg-3 col-md-8 offset-md-2">
      <form className="card mt-5">
        <div className="card-header">
          <h1 className="text-center">Sign Up</h1>
        </div>
        <div className="card-body">
          <div className="mb-3">
            <label className="form-label" htmlFor="username">Username</label>
            <input
              className="form-control"
              name="username"
              id="username"
              onChange={handleChange}
              value={username}
              aria-describedby="usernameHelp"
            />
            <div id="usernameHelp" className="form-text">We'll never share your email with anyone else.</div>
          </div>
          <div className="mb-3">
            <label className="form-label" htmlFor="email">Email</label>
            <input
              className="form-control"
              name="email"
              id="email"
              type="email"
              onChange={handleChange}
              value={email}
              aria-describedby="emailHelp"
            />
            <div id="emailHelp" className="form-text">We'll never share your email with anyone else.</div>
          </div>
          <div className="mb-3">
            <label className="form-label" htmlFor="password">Password</label>
            <input
              className="form-control"
              name="password"
              id="password"
              type="password"
              onChange={handleChange}
              value={password}
            />
          </div>
          <div className="mb-3">
            <label className="form-label" htmlFor="password-repeat">Password Repeat</label>
            <input
              className="form-control"
              name="password-repeat"
              id="password-repeat"
              type="password"
              onChange={handleChange}
              value={passwordRepeat}
            />
          </div>
          <div className="text-center">
            <button className="btn btn-primary" disabled={isSignUpBtnDisabled || isLoading} onClick={handleSignUp}>
              {isLoading && <span className="spinner-border spinner-border-sm" role="status" aria-hidden={true}></span>}
              Sign Up
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default SignUpPage;
