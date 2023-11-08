import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

import './assets/main.css'

import axios from 'axios';

axios.defaults.baseURL = 'https://8080-deborafaria01-test2back-uepe8isfhxz.ws-us106.gitpod.io';

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')
