import EmployeeManager from '@/components/EmployeeManager.vue';
import ManageProjects from '@/components/ManageProjects.vue';
import { createRouter, createWebHistory } from 'vue-router';

const routes = [
    { path: '/', component: EmployeeManager },
    { path: '/manage-projects', component: ManageProjects }
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;
