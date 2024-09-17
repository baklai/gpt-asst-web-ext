const { createApp, ref, watch, onMounted } = Vue;

const TG_TAB_TITLE = 'Telegram Web';
const TG_TAB_URL = 'https://web.telegram.org/k/';

createApp({
  setup() {
    const chatlist = ref([]);
    const yourself = ref('');
    const apikey = ref('');
    const chatid = ref('');

    watch(yourself, async val => {
      await browser.storage.local.set({ yourself: val });
    });

    watch(apikey, async val => {
      await browser.storage.local.set({ apikey: val });
    });

    watch(chatid, async val => {
      await browser.storage.local.set({ chatid: val });
    });

    const initWebTgTab = async (tabTitle, tabUrl) => {
      const tabs = await browser.tabs.query({});
      const currenttab = tabs.find(tab => tab.title.includes(tabTitle));

      if (currenttab) {
        await browser.tabs.update(currenttab.id, { url: tabUrl });
      } else {
        await browser.tabs.create({ url: tabUrl });
      }
    };

    const onOpenChat = async () => {
      const tabs = await browser.tabs.query({});
      const webTgTab = tabs.find(tab => tab.title.includes('Telegram Web'));

      if (webTgTab && apikey.value && chatid.value) {
        const chat = chatlist.value.find(item => item.id === chatid.value);

        if (chat && chat.href) {
          await browser.tabs.update(webTgTab.id, { url: chat.href });
        }
      }

      window.close();
    };

    const onResetApiKey = () => {
      apikey.value = '';
    };

    const onOpenSelect = async () => {
      await browser.storage.local.set({ chatid: '' });

      const { chatlist: storedChatlist = '[]' } = await browser.storage.local.get();

      chatlist.value = JSON.parse(storedChatlist);
    };

    onMounted(async () => {
      await browser.storage.local.set({ chatid: chatid.value });

      await initWebTgTab(TG_TAB_TITLE, TG_TAB_URL);

      const {
        chatlist: storedChatlist = '[]',
        yourself: storedYourself = '',
        apikey: storedApikey = '',
        chatid: storedChatid = ''
      } = await browser.storage.local.get();

      chatlist.value = JSON.parse(storedChatlist);
      yourself.value = storedYourself;
      apikey.value = storedApikey;
      chatid.value = storedChatid;
    });

    return {
      apikey,
      chatid,
      yourself,
      chatlist,
      onOpenChat,
      onOpenSelect,
      onResetApiKey
    };
  }
}).mount('#app');
