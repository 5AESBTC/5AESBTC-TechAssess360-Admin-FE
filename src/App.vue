<template>
  <Sidebar/>
  <div class="main-content">
      <router-view />
    </div>
</template>
<script>
import Sidebar from './components/Sidebar.vue';


export default {
  name: 'App',
  components:{
    Sidebar
  }
};
</script>

<style scoped>
.app-container {
  display: flex;
  height: 100vh; 
}

.main-content {
  flex-grow: 1;
  padding-left: 350px;
  padding-right: 50px;
  overflow: auto;
}
</style>