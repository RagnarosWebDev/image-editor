import { createApp } from 'vue';
import './style.scss';
import App from './App.vue';
import { createPinia } from 'pinia';
import 'vuetify/styles';
import { createVuetify } from 'vuetify';
import { aliases, mdi } from 'vuetify/iconsets/mdi';
import '@mdi/font/css/materialdesignicons.css';

createApp(App)
  .use(createPinia())
  .use(
    createVuetify({
      icons: {
        defaultSet: 'mdi',
        aliases,
        sets: {
          mdi,
        },
      },
    }),
  )
  .mount('#app');
