import React from "react";
import { useTranslation } from "react-i18next";

const LanguageSelector = () => {
  const { i18n } = useTranslation();
  return (
    <div
      style={{
        display: "flex",
        gap: "2px",
        marginLeft: "12px",
        alignItems: "center",
        cursor: "pointer",
      }}
    >
      <img
        src="https://flagcdn.com/h20/ua.png"
        srcSet="https://flagcdn.com/h40/ua.png 2x,
            https://flagcdn.com/h60/ua.png 3x"
        height="20"
        width="30"
        title="Українська"
        onClick={() => i18n.changeLanguage("ua")}
        alt="Українська"
      />
      <img
        src="https://flagcdn.com/h20/us.png"
        srcSet="https://flagcdn.com/h40/us.png 2x,
            https://flagcdn.com/h60/us.png 3x"
        height="20"
        width="30"
        title="English"
        onClick={() => i18n.changeLanguage("en")}
        alt="English"
      />
    </div>
  );
};

export default LanguageSelector;
