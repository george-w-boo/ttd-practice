import { useState } from "react";
import axios from "axios";

import Input from "../components/Input";

function SignUpPage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordRepeat, setPasswordRepeat] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [signUpSuccess, setSignUpSuccess] = useState(false);
  const [errors, setErrors] = useState(null);

  const handleChange = (event) => {
    const { id, value } = event.target;

    switch (id) {
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

    try {
      setIsLoading(true);
      await axios.post("/api/1.0/users", body);
      setIsLoading(false);
  
      setSignUpSuccess(true);
    } catch(error) {
      if (error.response.status === 400) {
        setErrors(error.response.data.validationErrors);
      }
      setIsLoading(false);
    }
  };

  let isSignUpBtnDisabled = true;

  if (password && passwordRepeat) {
    isSignUpBtnDisabled = password !== passwordRepeat;
  }

  return (
    <div className="col-lg-6 offset-lg-3 col-md-8 offset-md-2">
      {!signUpSuccess && <form className="card mt-5" data-testid="sign-up-form">
        <div className="card-header">
          <h1 className="text-center">Sign Up</h1>
        </div>
        <div className="card-body">
          <Input
            id="username"
            label="Username"
            type="text"
            onChange={handleChange}
            value={username}
            helpText={errors?.username}
          />
          <Input
            id="email"
            label="Email"
            type="email"
            onChange={handleChange}
            value={email}
            helpText={errors?.email}
          />
          <Input
            id="password"
            label="Password"
            type="password"
            onChange={handleChange}
            value={password}
            helpText={errors?.password}
          />
          <Input
            id="password-repeat"
            label="Password Repeat"
            type="password"
            onChange={handleChange}
            value={passwordRepeat}
            helpText={errors?.password}
          />
          <div className="text-center">
            <button className="btn btn-primary" disabled={isSignUpBtnDisabled || isLoading} onClick={handleSignUp}>
              {isLoading && <span className="spinner-border spinner-border-sm" role="status" aria-hidden={true}></span>}
              Sign Up
            </button>
          </div>
        </div>
      </form>}
      {signUpSuccess && (
        <div className="alert alert-success mt-3" role="alert">
        Please, check you email!
      </div>
      )}
    </div>
  );
}

export default SignUpPage;
