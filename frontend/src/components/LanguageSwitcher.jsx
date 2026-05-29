import { useTranslation } from "react-i18next";

function LanguageSwitcher() {
  const { i18n } = useTranslation();

  return (
    <div className="language-switcher">
      <button type="button" onClick={() => i18n.changeLanguage("pl")}>
        PL
      </button>
      <button type="button" onClick={() => i18n.changeLanguage("en")}>
        EN
      </button>
    </div>
  );
}

export default LanguageSwitcher;