import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import VCalendar from 'v-calendar';
import 'v-calendar/dist/style.css';

import '@fortawesome/fontawesome-free/css/all.min.css'
const app = createApp(App);

app.use(VCalendar);
app.use(router).mount('#app');


// createApp(App).use(router).mount('#app')
