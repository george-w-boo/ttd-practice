import { useState } from "react";
import axios from "axios";
import { withTranslation } from "react-i18next";

import Input from "../components/Input";

function SignUpPage({ t }) {
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
        setErrors({ ...errors, username: "" });
        break;
      case "email":
        setEmail(value);
        setErrors({ ...errors, email: "" });
        break;
      case "password":
        setPassword(value);
        setErrors({ ...errors, password: "" });
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
    } catch (error) {
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
      {!signUpSuccess && (
        <form className="card mt-5" data-testid="sign-up-form">
          <div className="card-header">
            <h1 className="text-center">{t("signUp")}</h1>
          </div>
          <div className="card-body">
            <Input
              id="username"
              label={t("username")}
              type="text"
              onChange={handleChange}
              value={username}
              helpText={errors?.username}
            />
            <Input
              id="email"
              label={t("email")}
              type="email"
              onChange={handleChange}
              value={email}
              helpText={errors?.email}
            />
            <Input
              id="password"
              label={t("password")}
              type="password"
              onChange={handleChange}
              value={password}
              helpText={errors?.password}
            />
            <Input
              id="password-repeat"
              label={t("passwordRepeat")}
              type="password"
              onChange={handleChange}
              value={passwordRepeat}
              helpText={password !== passwordRepeat ? "Passwords mismatch" : ""}
            />
            <div className="text-center">
              <button
                className="btn btn-primary"
                disabled={isSignUpBtnDisabled || isLoading}
                onClick={handleSignUp}
              >
                {isLoading && (
                  <span
                    className="spinner-border spinner-border-sm"
                    role="status"
                    aria-hidden={true}
                  ></span>
                )}
                {t("signUp")}
              </button>
            </div>
          </div>
        </form>
      )}
      {signUpSuccess && (
        <div className="alert alert-success mt-3" role="alert">
          Please, check you email!
        </div>
      )}
    </div>
  );
}

const SignUpPageWithTranslation = withTranslation()(SignUpPage);

export default SignUpPageWithTranslation;
