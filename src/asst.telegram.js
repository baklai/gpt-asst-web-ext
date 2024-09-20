(function () {
  setTimeout(async () => {
    try {
      const { apikey } = await chrome.storage.local.get();

      const dd = await chrome.storage.local.get();

      console.log('dd', dd);

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

      // assistant.clear();

      const { name, description, version } = chrome.runtime.getManifest();

      assistant.bage(name, description, version);
    } catch (err) {
      console.error(err);
    }
  }, 5000);
})();
