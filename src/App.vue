<template>
  <div id="app" class="d-flex flex-column min-vh-100">
    <SidebarComponent />
    <div class="content-wrapper flex-grow-1 d-flex flex-column" :style="{ marginLeft: $route.path !== '/login' && $route.path !== '/register' ? '200px' : '0' }">
      <main class="flex-grow-1 p-4">
        <router-view />
        <AdminTech/>
      </main>
    </div>
  </div>
</template>
<script>
import AdminTech from './components/EmployeeManager.vue';
import SidebarComponent from './components/Sidebar.vue';

export default {
  name: 'App',
  components:{
    AdminTech,
    SidebarComponent,
  }
};
</script>
