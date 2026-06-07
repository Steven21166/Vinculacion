import { useEffect } from "react";

function GoogleTranslate() {
  useEffect(() => {
    const addScript = document.createElement("script");

    addScript.src =
      "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";

    addScript.async = true;

    document.body.appendChild(addScript);

    window.googleTranslateElementInit = () => {
      new window.google.translate.TranslateElement(
        {
          pageLanguage: "es",
          includedLanguages: "es,en",
          autoDisplay: false,
        },
        "google_translate_element",
      );
    };
  }, []);

  const cambiarIdioma = (lang) => {
    const select = document.querySelector(".goog-te-combo");

    if (select) {
      select.value = lang;
      select.dispatchEvent(new Event("change"));

      localStorage.setItem("idioma", lang);
    }
  };

  useEffect(() => {
    const idiomaGuardado = localStorage.getItem("idioma");

    const interval = setInterval(() => {
      const select = document.querySelector(".goog-te-combo");

      if (select && idiomaGuardado) {
        select.value = idiomaGuardado;
        select.dispatchEvent(new Event("change"));
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="traductor-container notranslate">
      {/* Traductor oculto */}
      <div id="google_translate_element" style={{ display: "none" }}></div>

      <button className="notranslate" onClick={() => cambiarIdioma("es")}>
        ES
      </button>

      <button className="notranslate" onClick={() => cambiarIdioma("en")}>
        EN
      </button>
    </div>
  );
}

export default GoogleTranslate;
