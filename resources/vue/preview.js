import { createApp } from 'vue';
import App from './AppDaytrans.vue';
import router from './router/routerPreview';
import { createI18n } from 'vue-i18n';
import { createPinia } from 'pinia';

import Colors from '@/config/colors/preview';
import Images from '@/config/images/preview';
import locale from '@/config/locale';
import dateTimeFormats from '@/config/dateTimeFormats';
import Features from '@/config/features';
import featuresDev from '@/config/features.dev';
import featuresProd from '@/config/features.prod';

const pinia = createPinia();
const app = createApp(App);
const i18n = createI18n({
  legacy: false,
  messages: locale,
  locale: 'id',
  datetimeFormats: dateTimeFormats
});

app.config.globalProperties.colors = Colors;
app.config.globalProperties.images = Images; 
app.config.globalProperties.features = Features.ASMAT; 



app.use(pinia).use(router).use(i18n).mount('#app');
