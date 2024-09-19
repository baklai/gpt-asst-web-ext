const { createApp, ref, watch, onMounted } = Vue;

const TG_TAB_TITLE = 'Telegram Web';
const TG_TAB_URL = 'https://web.telegram.org/k/';

createApp({
  setup() {
    const yourself = ref('');
    const apikey = ref('');

    watch(yourself, async val => {
      await browser.storage.local.set({ yourself: val });
    });

    watch(apikey, async val => {
      await browser.storage.local.set({ apikey: val });
    });

    const initWebTgTab = async (tabTitle, tabUrl) => {
      const tabs = await browser.tabs.query({});
      const webTgTab = tabs.find(tab => tab.title.includes(tabTitle));

      if (webTgTab) {
        await browser.tabs.update(webTgTab.id, { url: tabUrl });
      } else {
        await browser.tabs.create({ url: tabUrl });
      }
    };

    const onResetKey = () => {
      apikey.value = '';
    };

    onMounted(async () => {
      await initWebTgTab(TG_TAB_TITLE, TG_TAB_URL);

      const { yourself: storedYourself = '', apikey: storedApikey = '' } =
        await browser.storage.local.get();

      yourself.value = storedYourself;
      apikey.value = storedApikey;
    });

    return {
      apikey,
      yourself,
      onResetKey
    };
  }
}).mount('#app');
