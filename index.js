const host = "www.dow.com";
const availableLanguages = ["en-us", "fr-fr", "it-it"];
const defaultLanguage = "en-us";

Bun.serve({
  port: 36107,
  fetch: async (request) => {
    try{
      const path = getPathFromUrl(request.url);
      const requestedLanguage = getLanguageFromPath(path) || defaultLanguage;
  
      let fetchUrl = `https://${host}/${path}`;
  
      // replaces the language in the url by the "defaultLanguage" to fetch the main content
      if (!isDefaultLanguage(requestedLanguage)) {
        fetchUrl = fetchUrl.replace(`${requestedLanguage}`, `${defaultLanguage}`);
      }
  
      const res = await fetch(fetchUrl);
      let content = await res.text();
  
      // apply translation only if the "requestedLanguage" is different from the "defaultLanguage"
      // and if the content-type is text/html (to avoid translation of images, css, etc... Which is useless and can break the website)
      if (
        requestQualifiesForTranslation(res) &&
        !isDefaultLanguage(requestedLanguage)
      ) {
        // Replace every url occurences of "defaultLanguage" by the "requestedLanguage"
        // to ensure navigating properly with the requested language
        const regex = new RegExp(`/${defaultLanguage}`, "g");
        content = content.replace(regex, `/${requestedLanguage}`);
  
        // load the right translation dictionary
        const translationDictionary = await loadTranslationDictionary(
          requestedLanguage
        );
  
        // apply translation to the content
        for (const text in translationDictionary) {
          const translatedTest = translationDictionary[text];
          const originalText = text;
          const regex = new RegExp(originalText, "g");
          content = content.replace(regex, translatedTest);
        }
      }
  
      // display the content efficiently
      return new Response(content, {
        headers: {
          "Content-Type": res.headers.get("content-type"),
        },
      });
    }catch(e){
      // If somehow an error occured, return a 500 status code
      return new Response("An error occured", { status: 500 });
    }
  },
});

const getPathFromUrl = (url) => {
  return url.split("/").slice(3).join("/");
};

// get the language (if any) in the page from a list of available languages
const getLanguageFromPath = (path) => {
  return availableLanguages.find((language) => path.startsWith(language));
};

const isDefaultLanguage = (language) => {
  return language === defaultLanguage;
};

// check if the request qualifies for translation : content-type is text/html
const requestQualifiesForTranslation = (req) => {
  return req.headers.get("content-type").includes("text/html");
};

// this wasn't expected but it loads the right dictionary for the requested language
// It's funny to run this code with other languages as well :)
// You can also try the italian version here : http://localhost:36107/it-it
const loadTranslationDictionary = async (language) => {
  const dictionnary = Bun.file(`./translations/${language}.json`, {
    type: "application/json",
  });
  return dictionnary.json();
};

console.log("Run on http://localhost:36107");
