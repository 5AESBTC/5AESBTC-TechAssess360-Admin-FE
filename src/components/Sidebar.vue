<template>
    <aside class="sidebar bg-opacity-25 text-red vh-100">
      <div class="d-flex flex-column p-3 mt-2">
        <h3 class="name-project">TechAssess360</h3>
        <ul class="nav nav-pills flex-column mb-auto mt-3">
          <li class="nav-item">
            <router-link to="/" class="nav-link">
              <i class="bi bi-people"></i> Danh sách quản lý
            </router-link>
          </li>
          
          <li class="nav-item">
            <router-link to="/manage-projects" class="nav-link">
              <i class="bi bi-gear"></i> Quản lý dự án
            </router-link>
          </li>
          <li class="nav-item">
            <router-link to="/manage-assess-date" class="nav-link">
              <i class="bi bi-people"></i> Quản lý ngày đánh giá
            </router-link>
          </li>
          <li class="nav-item">
            <router-link to="manage-criterias" class="nav-link">
              <i class="bi bi-people"></i> Quản lý tiêu chí
            </router-link>
          </li>
          <li class="nav-item">
            <router-link to="#" class="nav-link">
              <i class="bi bi-box-arrow-right"></i> Đăng xuất
            </router-link>
          </li>
        </ul>
      </div>
    </aside>
  </template>
  
  <script>
  export default {
    name: 'SidebarComponent',
  };
  </script>
  
  <style scoped>
  .sidebar {
    width: 300px;
    position: fixed;
    top: 0;
    left: 0;
    background-color: #000055;
    color: white;
  }
  .name-project{
    text-align: center;
  }
  .nav-link{
    color: white;
    border-bottom: solid gray;
  }
  </style>
  