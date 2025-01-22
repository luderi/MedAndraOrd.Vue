import { createRouter, createWebHistory } from "vue-router";
import StartScreen from "@/components/StartScreen.vue";
import SimpleGame from "@/components/SimpleGame.vue";

const routes = [
  {
    path: "/",
    name: "StartScreen",
    component: StartScreen,
  },
  {
    path: "/game",
    name: "SimpleGame",
    component: SimpleGame,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
