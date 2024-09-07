import { createRouter, createWebHistory } from 'vue-router';
import AdminTech from "@/components/AdminTech.vue";

const routes = [
    { path: '/AdminTech', component: AdminTech }
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;
