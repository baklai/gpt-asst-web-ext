import './assets/main.css';

import { createApp } from 'vue';
import { createPinia } from 'pinia';

import App from './App.vue';
import router from './router/asst.router';

const app = createApp(App);

app.use(createPinia());

app.use(router);

app.config.errorHandler = function (err, vm, info) {
  console.error('errorHandler', err);
};

app.config.warnHandler = (msg, instance, trace) => {
  console.error('warnHandler', msg);
};

app.mount('#app');
