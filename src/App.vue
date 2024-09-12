<template>
  <div id="app" class="d-flex flex-column min-vh-100">
    <Sidebar v-if="$route.path !== '/login' && $route.path !== '/register'" />
    <div class="content-wrapper flex-grow-1 d-flex flex-column" :style="{ marginLeft: $route.path !== '/login' && $route.path !== '/register' ? '200px' : '0' }">
      <Navbar v-if="$route.path !== '/login' && $route.path !== '/register'" />
      <main class="flex-grow-1 p-4">
        <EmployeeManager/>
      </main>
      <Footer v-if="$route.path !== '/login' && $route.path !== '/register'" />
    </div>
  </div>
</template>
<script>
import EmployeeManager from './components/EmployeeManager.vue';
// import ManageProjects from './components/ManageProjects.vue';
import Sidebar from './components/Sidebar.vue';


export default {
  name: 'App',
  components:{
    EmployeeManager,
    Sidebar
  }
};
</script>
