
import { createApp } from "vue";

import App from "./App.vue";

import router from "./router";
import { installPageVisitTracking } from "./services/page-visits.service";

import "./assets/styles/global.css";
import "./assets/styles/responsive.css";

const app = createApp(App);

// Installation de Vue Router
app.use(router);

// Activation du suivi des pages visitées
installPageVisitTracking(router);

// Montage de l'application
app.mount("#app");
