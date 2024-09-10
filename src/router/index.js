import { createRouter, createWebHistory } from 'vue-router';
import AdminTech from "@/components/AdminTech.vue";
import AssessDetails from "@/components/modal/AssessDetails.vue";

const routes = [
    { path: '/AdminTech', component: AdminTech },
    { path: '/AssessDetails', component: AssessDetails }
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;
