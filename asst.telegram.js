(function () {
  setTimeout(async () => {
    const { apikey } = await browser.storage.local.get();

    const assistant = new Assistant({ apiKey: apikey });

    window.addEventListener('hashchange', function () {
      if (assistant.chatid) {
        assistant.closed();
      }
    });

    window.addEventListener('popstate', function (event) {
      if (assistant.chatid) {
        assistant.closed();
      }
    });

    assistant.clear();

    const { name, description, version } = browser.runtime.getManifest();

    assistant.bage(name, description, version);
  }, 5000);
})();
