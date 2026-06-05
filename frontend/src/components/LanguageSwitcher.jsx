import { useTranslation } from "react-i18next";

function LanguageSwitcher() {
  const { i18n } = useTranslation();

  const changeLanguage = (language) => {
    i18n.changeLanguage(language);
    localStorage.setItem("language", language);
  };

  return (
    <div className="language-switcher">
      <button type="button" onClick={() => changeLanguage("pl")}>
        PL
      </button>
      <button type="button" onClick={() => changeLanguage("en")}>
        EN
      </button>
    </div>
  );
}

export default LanguageSwitcher;