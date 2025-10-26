import { createApp } from 'vue'
import App from './App.vue'
import axios from 'axios'
import VueAxios from 'vue-axios'
import { createPinia } from 'pinia';
// import "bootstrap"
// import "bootstrap/dist/css/bootstrap.min.css"
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import router from './router'
import store from './store'
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';
// import Toast from 'vue-toastification'
import Vue3Notification from '@kyvg/vue3-notification'

const app = createApp(App)
// Register all Community features
ModuleRegistry.registerModules([AllCommunityModule]);
// app.config.globalProperties.hostname = "https://localhost:44306"
app.config.globalProperties.hostname = "https://tn.tsmms.tw"
// app.config.globalProperties.hostname = "http://34.80.69.96:5001"
// app.config.globalProperties.hostname = "https://aa27-34-80-69-96.ngrok-free.app"
const pinia = createPinia();
app.use(pinia);
pinia.use(piniaPluginPersistedstate)
app.use(router)
app.use(store)
// app.use(Toast)
app.use(VueAxios, axios)
app.use(Vue3Notification)
app.mount('#app')
