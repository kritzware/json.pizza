import { createRouter, createWebHistory } from "vue-router";

import Format from "./pages/Format.vue";
import Saved from "./pages/Saved.vue";
import Compare from "./pages/Compare.vue";

const routerHistory = createWebHistory();

const router = createRouter({
  history: routerHistory,
  routes: [
    {
      path: "/",
      component: Format,
      props: true,
    },
    {
      path: "/saved",
      component: Saved,
      props: true,
    },
    {
      path: "/compare",
      component: Compare,
    },
  ],
});

export default router;
