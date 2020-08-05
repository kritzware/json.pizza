import { reactive, computed } from "vue";
import router from "@/router";

const routeData = reactive({ params: {}, query: {} });

if (router) {
  router.afterEach((route) => {
    routeData.params = route.params;
    routeData.query = route.query;
  });
}

export function useParams() {
  return computed(() => routeData.params);
}

export function useQueryParams() {
  return computed(() => routeData.query);
}
