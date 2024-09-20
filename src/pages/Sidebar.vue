<script setup>
import { ref, watch, onMounted } from 'vue';

const TG_TAB_TITLE = 'Telegram Web';
const TG_TAB_URL = 'https://web.telegram.org/k/';

const yourself = ref('');
const apikey = ref('');

watch(yourself, async val => {
  await chrome.storage.local.set({ yourself: val });
});

watch(apikey, async val => {
  await chrome.storage.local.set({ apikey: val });
});

const initWebTgTab = async (tabTitle, tabUrl) => {
  const tabs = await chrome.tabs.query({});
  const webTgTab = tabs.find(tab => tab.title.includes(tabTitle));

  if (webTgTab) {
    await chrome.tabs.update(webTgTab.id, { url: tabUrl });
  } else {
    await chrome.tabs.create({ url: tabUrl });
  }
};

const onResetKey = () => {
  apikey.value = '';
};

onMounted(async () => {
  await initWebTgTab(TG_TAB_TITLE, TG_TAB_URL);

  const { yourself: storedYourself = '', apikey: storedApikey = '' } =
    await chrome.storage.local.get();

  yourself.value = storedYourself;
  apikey.value = storedApikey;
});
</script>

<template>
  <section class="min-h-screen bg-white dark:bg-gray-900 lg:flex">
    <div
      class="flex flex-col justify-center w-full p-8 lg:bg-gray-100 lg:dark:bg-gray-800 lg:px-12 xl:px-32 lg:w-1/2"
    >
      <div style="display: flex; align-items: center">
        <img src="@/assets/logo.svg" alt="logo" class="mr-2" height="24" width="24" />

        <h1
          class="text-2xl font-semibold text-orange-500 capitalize dark:text-white lg:text-3xl"
          style="-webkit-text-stroke: 1px gray"
        >
          GPT Asst for Telegram
        </h1>
      </div>

      <p class="mt-4 text-gray-500 dark:text-gray-400">
        This extension adds an AI to your browser that can conduct conversations on your behalf in
        the Telegram messenger
      </p>

      <div class="mt-6 md:mt-8 hidden md:block">
        <h3 class="font-medium text-gray-600 dark:text-gray-300">Follow us</h3>

        <div class="flex mt-4 -mx-1.5">
          <a
            class="mx-1.5 dark:hover:text-orange-400 text-gray-400 transition-colors duration-300 transform hover:text-orange-500"
            target="_blank"
            href="https://github.com/baklai"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="w-8 h-8">
              <title>github</title>
              <path
                fill="currentColor"
                d="M12,2A10,10 0 0,0 2,12C2,16.42 4.87,20.17 8.84,21.5C9.34,21.58 9.5,21.27 9.5,21C9.5,20.77 9.5,20.14 9.5,19.31C6.73,19.91 6.14,17.97 6.14,17.97C5.68,16.81 5.03,16.5 5.03,16.5C4.12,15.88 5.1,15.9 5.1,15.9C6.1,15.97 6.63,16.93 6.63,16.93C7.5,18.45 8.97,18 9.54,17.76C9.63,17.11 9.89,16.67 10.17,16.42C7.95,16.17 5.62,15.31 5.62,11.5C5.62,10.39 6,9.5 6.65,8.79C6.55,8.54 6.2,7.5 6.75,6.15C6.75,6.15 7.59,5.88 9.5,7.17C10.29,6.95 11.15,6.84 12,6.84C12.85,6.84 13.71,6.95 14.5,7.17C16.41,5.88 17.25,6.15 17.25,6.15C17.8,7.5 17.45,8.54 17.35,8.79C18,9.5 18.38,10.39 18.38,11.5C18.38,15.32 16.04,16.16 13.81,16.41C14.17,16.72 14.5,17.33 14.5,18.26C14.5,19.6 14.5,20.68 14.5,21C14.5,21.27 14.66,21.59 15.17,21.5C19.14,20.16 22,16.42 22,12A10,10 0 0,0 12,2Z"
              />
            </svg>
          </a>

          <a
            class="mx-1.5 dark:hover:text-orange-400 text-gray-400 transition-colors duration-300 transform hover:text-orange-500"
            target="_blank"
            href="https://www.linkedin.com/in/baklai/"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="w-8 h-8">
              <title>linkedin</title>
              <path
                fill="currentColor"
                d="M19 3A2 2 0 0 1 21 5V19A2 2 0 0 1 19 21H5A2 2 0 0 1 3 19V5A2 2 0 0 1 5 3H19M18.5 18.5V13.2A3.26 3.26 0 0 0 15.24 9.94C14.39 9.94 13.4 10.46 12.92 11.24V10.13H10.13V18.5H12.92V13.57C12.92 12.8 13.54 12.17 14.31 12.17A1.4 1.4 0 0 1 15.71 13.57V18.5H18.5M6.88 8.56A1.68 1.68 0 0 0 8.56 6.88C8.56 5.95 7.81 5.19 6.88 5.19A1.69 1.69 0 0 0 5.19 6.88C5.19 7.81 5.95 8.56 6.88 8.56M8.27 18.5V10.13H5.5V18.5H8.27Z"
              />
            </svg>
          </a>

          <a
            class="mx-1.5 dark:hover:text-orange-400 text-gray-400 transition-colors duration-300 transform hover:text-orange-500"
            target="_blank"
            href="https://www.facebook.com/dmitrii.baklai"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="w-8 h-8">
              <title>facebook</title>
              <path
                fill="currentColor"
                d="M12 2.04C6.5 2.04 2 6.53 2 12.06C2 17.06 5.66 21.21 10.44 21.96V14.96H7.9V12.06H10.44V9.85C10.44 7.34 11.93 5.96 14.22 5.96C15.31 5.96 16.45 6.15 16.45 6.15V8.62H15.19C13.95 8.62 13.56 9.39 13.56 10.18V12.06H16.34L15.89 14.96H13.56V21.96A10 10 0 0 0 22 12.06C22 6.53 17.5 2.04 12 2.04Z"
              />
            </svg>
          </a>

          <a
            class="mx-1.5 dark:hover:text-orange-400 text-gray-400 transition-colors duration-300 transform hover:text-orange-500"
            target="_blank"
            href="https://www.instagram.com/baklai.di/"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="w-8 h-8">
              <title>instagram</title>
              <path
                fill="currentColor"
                d="M7.8,2H16.2C19.4,2 22,4.6 22,7.8V16.2A5.8,5.8 0 0,1 16.2,22H7.8C4.6,22 2,19.4 2,16.2V7.8A5.8,5.8 0 0,1 7.8,2M7.6,4A3.6,3.6 0 0,0 4,7.6V16.4C4,18.39 5.61,20 7.6,20H16.4A3.6,3.6 0 0,0 20,16.4V7.6C20,5.61 18.39,4 16.4,4H7.6M17.25,5.5A1.25,1.25 0 0,1 18.5,6.75A1.25,1.25 0 0,1 17.25,8A1.25,1.25 0 0,1 16,6.75A1.25,1.25 0 0,1 17.25,5.5M12,7A5,5 0 0,1 17,12A5,5 0 0,1 12,17A5,5 0 0,1 7,12A5,5 0 0,1 12,7M12,9A3,3 0 0,0 9,12A3,3 0 0,0 12,15A3,3 0 0,0 15,12A3,3 0 0,0 12,9Z"
              />
            </svg>
          </a>
        </div>
      </div>
    </div>

    <div class="flex flex-col justify-center w-full p-8 pt-0 lg:w-1/2 lg:px-12 xl:px-24">
      <div class="-mx-2 flex flex-col" v-if="!apikey">
        <div class="flex-1 px-2 mt-4 md:mt-0">
          <label for="apikey" class="block mb-2 text-sm font-bold text-gray-600 dark:text-gray-200">
            OpenAI API
          </label>
          <input
            id="apikey"
            type="password"
            v-model="apikey"
            placeholder="Enter your OpenAI API key"
            class="block w-full px-5 py-3 mt-2 text-gray-700 placeholder-gray-400 bg-white border border-gray-200 rounded-md dark:placeholder-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-700 focus:border-blue-400 dark:focus:border-blue-400 focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40"
          />
          <p class="mt-3 text-xs text-gray-400 dark:text-gray-600">
            Input OpenAI API key you're ready to make your first API request.
          </p>
        </div>
      </div>

      <div class="w-full mt-4">
        <label for="yourself" class="block mb-2 text-sm font-bold text-gray-600 dark:text-gray-200">
          About yourself
        </label>
        <textarea
          id="yourself"
          rows="5"
          v-model="yourself"
          placeholder="Enter information about yourself"
          class="block w-full h-32 px-5 py-3 mt-2 text-gray-700 placeholder-gray-400 bg-white border border-gray-200 rounded-md md:h-56 dark:placeholder-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-700 focus:border-blue-400 dark:focus:border-blue-400 focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40"
        ></textarea>
        <p class="mt-3 text-xs text-gray-400 dark:text-gray-600">
          This field is used to set the initial context or set specific instructions for the model.
        </p>
      </div>

      <div class="items-center flex flex-col" :hidden="!apikey">
        <button
          @click="onResetKey"
          class="w-full px-6 py-3 mt-4 text-sm font-medium tracking-wide text-white capitalize transition-colors duration-300 transform bg-orange-500 rounded-md hover:bg-orange-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-50"
        >
          Reset OpenAI API Key
        </button>
        <p class="mt-3 text-xs text-center text-gray-400 dark:text-gray-600">
          You're ready to make your first API request.
        </p>
      </div>
    </div>
  </section>
</template>
