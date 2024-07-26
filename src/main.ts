import { createApp } from 'vue';
import { createPinia } from 'pinia';
import Vue3Toasity, { type ToastContainerOptions } from 'vue3-toastify';

import App from './App.vue';
import router from './router';
import 'vue3-toastify/dist/index.css';
import './index.css';

const app = createApp(App);

app.use(createPinia());
app.use(router);
app.use(Vue3Toasity);
app.use(Vue3Toasity, {
  position: 'bottom-right',
} as ToastContainerOptions);

app.mount('#app');
