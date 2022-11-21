import { useState } from "react";
import { withTranslation } from "react-i18next";

import testIDs from "../test-ids.json";
import { login } from "../api/apiCalls";

import Input from "../components/Input";
import Alert from "../components/Alert";
import { useNavigate } from "react-router-dom";
import ButtonWithProgress from "../components/ButtonWithProgress";

function LoginPage({ t }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [loginSuccess, setLoginUpSuccess] = useState(false);
  const [failedMsg, setFailedMsg] = useState("");

  const navigate = useNavigate();

  const handleChange = (event) => {
    const { id, value } = event.target;

    setFailedMsg("");

    switch (id) {
      case "email":
        setEmail(value);
        break;
      case "password":
        setPassword(value);
        break;
      default:
        return;
    }
  };

  const handleLogin = async (event) => {
    event.preventDefault();

    const body = {
      email,
      password,
    };

    try {
      setIsLoading(true);
      await login(body);
      setIsLoading(false);

      setLoginUpSuccess(true);

      navigate("/");
    } catch (error) {
      if (error.response.status === 401) {
        setFailedMsg(error.response.data.message);
      }
      setIsLoading(false);
    }
  };

  let isLoginBtnDisabled = !(email && password);

  return (
    <div className="col-lg-6 offset-lg-3 col-md-8 offset-md-2">
      {!loginSuccess && (
        <form className="card" data-testid={testIDs.loginPage}>
          <div className="card-header">
            <h1 className="text-center">{t("login")}</h1>
          </div>
          <div className="card-body">
            <Input
              id="email"
              label={t("email")}
              type="email"
              onChange={handleChange}
              value={email}
            />
            <Input
              id="password"
              label={t("password")}
              type="password"
              onChange={handleChange}
              value={password}
            />
            {failedMsg && <Alert textContent={failedMsg} />}
            <div className="text-center">
              <button
                className="btn btn-primary"
                disabled={isLoginBtnDisabled || isLoading}
                onClick={handleLogin}
              >
                {isLoading && (
                  <span
                    className="spinner-border spinner-border-sm"
                    role="status"
                    aria-hidden={true}
                  ></span>
                )}
                {t("login")}
              </button>
            </div>
          </div>
        </form>
      )}
    </div>
  );
}

const LoginPageWithTranslation = withTranslation()(LoginPage);

export default LoginPageWithTranslation;
