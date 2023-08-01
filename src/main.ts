import './assets/main.css';
import { createApp } from 'vue';
import { createPinia } from 'pinia';
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
import router from './router/router';
import axios from './api/axios';
import 'dayjs/locale/zh-cn';
import zhCn from 'element-plus/dist/locale/zh-cn.mjs';
import App from './App.vue';

const pinia = createPinia();
const app = createApp(App);
app.use(pinia);
app.use(ElementPlus, {
    locale: zhCn,
});
app.use(router);
app.provide('axios', axios);
app.mount('#app');
