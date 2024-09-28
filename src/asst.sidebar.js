import './assets/main.css';

import { createApp } from 'vue';
import { createPinia } from 'pinia';
import { createI18n } from 'vue-i18n';

import App from './App.vue';
import router from './router/asst.router';

import en from '@/locales/en-US';
import uk from '@/locales/uk-UA';
import ru from '@/locales/ru-RU';

const chromeLang = chrome.i18n.getUILanguage();

const i18n = createI18n({
  legacy: false,
  locale: chromeLang,
  fallbackLocale: 'en',
  globalInjection: true,
  messages: { en, uk, ru },
  runtimeOnly: true
});

const app = createApp(App);

app.use(createPinia());
app.use(router);
app.use(i18n);

app.config.errorHandler = function (err, vm, info) {
  console.error('errorHandler', err);
};

app.config.warnHandler = (msg, instance, trace) => {
  console.error('warnHandler', msg);
};

app.mount('#app');
