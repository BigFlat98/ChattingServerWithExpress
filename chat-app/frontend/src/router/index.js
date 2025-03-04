import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import ChatView from "../views/ChatView.vue";

const routes = [
  { path: "/", name: "Home", component: HomeView },
  { path: "/chat/:id", name: "Chat", component: ChatView },
];

const router = createRouter({
  history: createWebHistory(), // 브라우저 히스토리 모드 사용
  routes,
});

export default router;
