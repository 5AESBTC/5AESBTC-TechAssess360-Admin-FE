<template>
    <aside class="sidebar bg-success bg-opacity-25 text-red vh-100">
      <div class="d-flex flex-column p-3 mt-2">
        <h3>TECH RATE</h3>
        <ul class="nav nav-pills flex-column mb-auto mt-3">
          <li class="nav-item">
            <router-link to="#" class="nav-link text-dark">
              <i class="bi bi-people"></i> Quản lý nhân viên
            </router-link>
          </li>
          
          <li class="nav-item">
            <router-link to="#" class="nav-link text-dark">
              <i class="bi bi-gear"></i> Quản lý dự án
            </router-link>
          </li>
          <li class="nav-item">
            <router-link to="#" class="nav-link text-dark">
              <i class="bi bi-people"></i> Quản lý ngày đánh giá
            </router-link>
          </li>
          <li class="nav-item">
            <router-link to="#" class="nav-link text-dark">
              <i class="bi bi-people"></i> Quản lý tiêu chí
            </router-link>
          </li>
          <li class="nav-item">
            <router-link to="#" class="nav-link text-dark">
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
    width: 200px;
    position: fixed;
    top: 0;
    left: 0;
  }
  .nav-item:hover {
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(118, 116, 116, 0.603); /* Customize the shadow as needed */
}
  </style>
  