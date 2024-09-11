<template>
    <div class="container">
      <div class="top-bar">
        <!-- Search Bar -->
        <input 
          type="text" 
          v-model="searchQuery" 
          placeholder="Tìm kiếm dự án..." 
          class="search-bar"
        />
      </div>
  
      <!-- Table -->
      <table class="project-table">
        <thead>
          <tr>
            <th>
              <button class="add-btn">
                Thêm dự án
               </button>
            </th>
            <th @click="sort('name')">Dự án</th>
            <th>Số lượng thành viên</th>
            <th @click="sort('department')">Bộ phận</th>
            <th>Tác vụ</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(project, index) in paginatedProjects" :key="project.id">
            <td>{{ (currentPage - 1) * pageSize + index + 1 }}</td>
            <td @click="viewProjectDetails(project)" class="project-name">{{ project.name }}</td>
            <td>{{ project.details.length }}</td>
            <td>{{ project.department }}</td>
           
   <td>
    <div class="menu-container">
      <button class="menu-btn" @click="toggleMenu('project', project)">
        <i class="fa-solid fa-ellipsis-vertical"></i>
      </button>
      <div v-if="activeMenu === 'project' && activeProject === project" class="menu-dropdown show">
        <button class="menu-item">
          <i class="fas fa-edit"></i> 
        </button>
        <button class="menu-item">
          <i class="fas fa-trash"></i> 
        </button>
      </div>
    </div>
  </td>
  
          </tr>
        </tbody>
      </table>
  
      <!-- Pagination -->
      <div class="pagination">
        <button 
          @click="prevPage" 
          :disabled="currentPage === 1" 
          class="pagination-btn"
        >
          <i class="fas fa-arrow-left"></i> Trước
        </button>
        <span>Trang {{ currentPage }} / {{ totalPages }}</span>
        <button 
          @click="nextPage" 
          :disabled="currentPage === totalPages" 
          class="pagination-btn"
        >
          Sau <i class="fas fa-arrow-right"></i>
        </button>
      </div>
  
      <!-- Project Details Modal -->
      <div v-if="selectedProject" class="modal-overlay" @click.self="closeProjectDetails">
        <div class="modal-container">
          <button @click="closeProjectDetails" class="close-btn">
            <i class="fas fa-times"></i>
          </button>
          <h2 class="project-details-title">Chi tiết dự án {{ selectedProject.name }}</h2>
          <div class="detail-header">
            <input
              type="text"
              v-model="detailSearchQuery"
              placeholder="Tìm kiếm chi tiết..."
              class="search-bar detail-search-bar"
            />
          </div>
  
          <!-- Detail Table -->
          <div class="detail-table-container">
            <table class="detail-table">
              <thead>
                <tr>
                  <th>
                    <button class="add-btn2">
                      Thêm thành viên
                    </button>
                  </th>
                  <th>Avatar</th>
                  <th @click="sortDetail('nameNV')">Tên NV</th>
                  <th @click="sortDetail('department')">Bộ phận</th>
                  <th @click="sortDetail('position')">Chức vụ</th>
                  <th>Tác vụ</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(detail, index) in filteredDetails" :key="index">
                  <td>{{ index + 1 }}</td>
                  <td><img :src="detail.avatar" alt="Avatar" class="avatar-img" /></td>
                  <td>{{ detail.nameNV }}</td>
                  <td>{{ detail.department }}</td>
                  <td>{{ detail.position }}</td>
                  <td>
                  <div class="menu-container">
                    <button class="menu-btn" @click="toggleMenu('detail', detail)">
                      <i class="fa-solid fa-ellipsis-vertical"></i>
                    </button>
                    <div v-if="activeMenu === 'detail' && activeDetail === detail" class="menu-dropdown show">
                      <button class="menu-item">
                        <i class="fas fa-info-circle"></i> 
                      </button>
                      <button class="menu-item" >
                        <i class="fas fa-trash"></i> 
                      </button>
                    </div>
                    </div>
                  </td>
  
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </template>
  <script>
  export default {
    name: 'ManageProjects',
    data() {
      return {
        searchQuery: "",
        detailSearchQuery: "",
        currentPage: 1,
        pageSize: 5,
        sortField: "name",
        sortDirection: 1,
        sortDetailField: "nameNV",
        sortDetailDirection: 1,
        activeMenu: null,
        activeProject: null,
        activeDetail: null,
        projects: [
          {
            id: 1, 
            name: "ABC", 
            department: "Kinh Doanh",
            details: [
              { nameNV: "Trịnh Thái Quân", department: "Kinh Doanh", position: "Manager", avatar: "path/to/avatar1.jpg" },
              { nameNV: "Nguyễn Văn A", department: "Kinh Doanh", position: "Sales", avatar: "path/to/avatar2.jpg" },
              { nameNV: "Trịnh Thái Quân", department: "Kinh Doanh", position: "Manager", avatar: "path/to/avatar1.jpg" },
              { nameNV: "Nguyễn Văn A", department: "Kinh Doanh", position: "Sales", avatar: "path/to/avatar2.jpg" }
            ]
          },
          {
            id: 2, 
            name: "TechSign", 
            department: "Phát Triển",
            details: [
              { nameNV: "Lê Thị B", department: "Phát Triển", position: "Developer", avatar: "path/to/avatar3.jpg" },
              { nameNV: "Trần Văn C", department: "Phát Triển", position: "Tester", avatar: "path/to/avatar4.jpg" },
              { nameNV: "Trịnh Thái Quân", department: "Kinh Doanh", position: "Manager", avatar: "path/to/avatar1.jpg" },
              { nameNV: "Nguyễn Văn A", department: "Kinh Doanh", position: "Sales", avatar: "path/to/avatar2.jpg" },
              { nameNV: "Trịnh Thái Quân", department: "Kinh Doanh", position: "Manager", avatar: "path/to/avatar1.jpg" },
              { nameNV: "Nguyễn Văn A", department: "Kinh Doanh", position: "Sales", avatar: "path/to/avatar2.jpg" },
              { nameNV: "Trịnh Thái Quân", department: "Kinh Doanh", position: "Manager", avatar: "path/to/avatar1.jpg" },
              { nameNV: "Nguyễn Văn A", department: "Kinh Doanh", position: "Sales", avatar: "path/to/avatar2.jpg" },
              { nameNV: "Trịnh Thái Quân", department: "Kinh Doanh", position: "Manager", avatar: "path/to/avatar1.jpg" },
              { nameNV: "Nguyễn Văn A", department: "Kinh Doanh", position: "Sales", avatar: "path/to/avatar2.jpg" },
            ]
          },
         {
            id: 3, 
            name: "TechAssess", 
            department: "Kinh Doanh",
            details: [
              { nameNV: "Trịnh Thái Quân", department: "Kinh Doanh", position: "Manager", avatar: "path/to/avatar1.jpg" },
              { nameNV: "Nguyễn Văn A", department: "Kinh Doanh", position: "Sales", avatar: "path/to/avatar2.jpg" },
              { nameNV: "Trịnh Thái Quân", department: "Kinh Doanh", position: "Manager", avatar: "path/to/avatar1.jpg" },
              { nameNV: "Nguyễn Văn A", department: "Kinh Doanh", position: "Sales", avatar: "path/to/avatar2.jpg" }
            ]
          },
        ],
        selectedProject: null,
        selectedProjectDetails: []
      };
    },
    computed: {
      filteredProjects() {
        let filtered = this.projects.filter((project) => {
          const lowerCaseQuery = this.searchQuery.toLowerCase();
          return (
            project.name.toLowerCase().includes(lowerCaseQuery) ||
            project.department.toLowerCase().includes(lowerCaseQuery)
          );
        });
  
        filtered.sort((a, b) => {
          return this.sortDirection * a[this.sortField].toLowerCase().localeCompare(b[this.sortField].toLowerCase());
        });
  
        return filtered;
      },
      paginatedProjects() {
        const start = (this.currentPage - 1) * this.pageSize;
        return this.filteredProjects.slice(start, start + this.pageSize);
      },
      totalPages() {
        return Math.ceil(this.filteredProjects.length / this.pageSize);
      },
      filteredDetails() {
        if (this.selectedProject) {
          let details = this.selectedProject.details.filter((detail) => {
            const lowerCaseQuery = this.detailSearchQuery.toLowerCase();
            return (
              detail.nameNV.toLowerCase().includes(lowerCaseQuery) ||
              detail.department.toLowerCase().includes(lowerCaseQuery) ||
              detail.position.toLowerCase().includes(lowerCaseQuery)
            );
          });
  
          details.sort((a, b) => {
            return this.sortDetailDirection * a[this.sortDetailField].toLowerCase().localeCompare(b[this.sortDetailField].toLowerCase());
          });
  
          return details;
        }
        return [];
      },
    },
    methods: {
      sort(field) {
        if (this.sortField === field) {
          this.sortDirection *= -1;
        } else {
          this.sortField = field;
          this.sortDirection = 1;
        }
      },
      sortDetail(field) {
        if (this.sortDetailField === field) {
          this.sortDetailDirection *= -1;
        } else {
          this.sortDetailField = field;
          this.sortDetailDirection = 1;
        }
      },
      viewProjectDetails(project) {
        this.selectedProject = project;
        this.selectedProjectDetails = project.details;
      },
      closeProjectDetails() {
        this.selectedProject = null;
        this.selectedProjectDetails = [];
      },
      toggleMenu(type, item) {
        if (type === 'project') {
          if (this.activeProject === item) {
            this.activeProject = null; // Close the menu if clicked again
          } else {
            this.activeProject = item;
            this.activeMenu = 'project';
            this.activeDetail = null; // Close detail menu if open
          }
        } else if (type === 'detail') {
          if (this.activeDetail === item) {
            this.activeDetail = null; // Close the menu if clicked again
          } else {
            this.activeDetail = item;
            this.activeMenu = 'detail';
            this.activeProject = null; // Close project menu if open
          }
        }
      },
      prevPage() {
        if (this.currentPage > 1) {
          this.currentPage -= 1;
        }
      },
      nextPage() {
        if (this.currentPage < this.totalPages) {
          this.currentPage += 1;
        }
      },
    },
  };
  
  </script>
      <style scoped>
      .container {
      display: flex;
      flex-direction: column;
      align-items: center;
      
      }
  .menu-container {
    position: relative;
  }
  
  .menu-btn {
    background: none;
    border: none;
    font-size: 20px;
    cursor: pointer;
    color: #007bff; /* Màu nút */
    z-index: 1;
    transition: color 0.3s ease;
  }
  
  .menu-btn:hover {
    color: #0056b3; /* Màu nút khi hover */
  }
  
  .menu-dropdown {
    position: absolute;
    top: -110%;
    left: 60%; 
    display: none;
    z-index: 2;
    padding: 5px;
    min-width: 50px;
    transition: opacity 0.3s ease, transform 0.3s ease;
    opacity: 0; 
    transform: translateY(-10px); 
  }
  
  
  .menu-dropdown.show {
    display: block;
    opacity: 1; 
    transform: translateY(0); 
  }
  
  .menu-item {
    padding: 10px 20px;
    border: none;
    background: #f8f9fa; 
    cursor: pointer;
    font-size: 14px;
    text-align: left;
    display: flex;
    align-items: center;
    transition: background-color 0.3s ease, color 0.3s ease;
    border-radius: 5px; 
  }
  
  .menu-item:hover {
    background-color: #007bff; 
    color: white; 
  }
  
  .menu-item i {
    margin-right: 8px;
  }
  
  .project-table td {
    position: relative; /* Ensure it contains the dropdown menu */
    padding: 16px; /* Adjust padding to ensure alignment */
    height:40px;
  }
  
  .project-table td .menu-container {
    margin: 0 auto; /* Center align if necessary */
  }
  
  
      .top-bar {
      display: flex;
      justify-content: flex-start;
      width: 90%;
      margin-bottom: 20px;
      }
      .add-btn {
      background-color: #17a2b8;
      color: white;
      border: none;
      border-radius: 1rem;
      width: 150px;
      height: 50px;
      font-size: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: background-color 0.3s ease;
      box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
      margin: 0 auto;
      }
  
      .add-btn:hover {
      background-color: #0056b3;
      box-shadow: 0px 6px 10px rgba(0, 0, 0, 0.2);
      }
  
  
      .icon-btn {
      background: none;
      border: none;
      font-size: 20px;
      cursor: pointer;
      /* Add box-shadow to the icon buttons */
      box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
      }
  
      .icon-btn:hover {
      box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.2);
      }
  
      .search-bar {
      padding: 20px;
      width: 350px;
      border-radius: 25px;
      border: 1px solid #ddd;
      outline: none;
      box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
      transition: border-color 0.3s ease;
      }
  
      .search-bar:focus {
      border-color: #007bff;
      }
  
  
      .project-table {
      border-collapse: separate;
      border-spacing: 0;
      width: 90%;
      max-height:1000vh;
      text-align: left;
      background-color: white;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.05);
      position: relative;
      }
  
      .project-table th,
      .project-table td {
      padding: 16px;
      border-bottom: 1px solid #f0f0f0;
      text-align: center;
      }
  
      .project-table th  {
      background-color: #007bff;
     color: white;
    font-weight: 600;
    font-size: 18px; 
    text-transform: uppercase; 
      cursor: pointer;
      }
      .project-table tr:hover {
      background-color: #f9f9f9;
      }
  
      .project-table tr:nth-child(even) {
      background-color: #f2f2f2;
      }
      .project-table td.project-name {
    font-weight: bold;
    transition: color 0.3s ease, background-color 0.3s ease; 
  }
  
  .project-table td.project-name:hover {
    color: #007bff; 
    background-color: #f0f8ff; 
    cursor: pointer; 
  }
  
  
      .pagination-btn {
      margin: 10px 10px;
      padding: 8px 16px;
      background-color: #007bff;
      color: white;
      border: none;
      border-radius: 5px;
      cursor: pointer;
      transition: background-color 0.3s ease;
      box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
      margin-top: 20px;
      }
  
      .pagination-btn:hover {
      background-color: #0056b3;
      }
  
      .pagination-btn:disabled {
      background-color: #aaa;
      cursor: not-allowed;
      }
      .box-shadow-small {
      box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
      }
  
      .box-shadow-medium {
      box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
      }
  
      .box-shadow-large {
      box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
      }
      button, .search-bar {
      transition: box-shadow 0.2s ease, background-color 0.2s ease;
      }
  
    .detail-table {
    border-collapse: collapse;
    width: 100%;
    max-width: 100%;
    background-color: #f8f9fa; 
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0px 6px 12px rgba(0, 0, 0, 0.1); 
  }
  
  .detail-table thead {
    position: sticky;
    position: -webkit-sticky;
    top: 0;
    z-index: 1000;
    background-color: #17a2b8; 
  }
  
  .detail-table-container {
    max-height: 400px;
    overflow-y: auto;
    width: 100%;
    margin: 0 auto;
     position: relative;
      scroll-behavior: smooth;
      scrollbar-width: thin; 
    scrollbar-color: #888 #f1f1f1; 
    
  }
  
  .details-container {
    display: flex;
    flex-direction: column;
    width: 100%;
     max-width: 1200px; 
    margin: 0 auto;
    padding: 20px;
    box-sizing: border-box;
  }
  
  .detail-header {
    display: flex;
    justify-content: space-between;
    width: 100%;
    margin-bottom: 10px;
  }
  .detail-table-container::-webkit-scrollbar {
    display: none; 
  }
  
  .detail-table th,
  .detail-table td {
    padding: 20px;
    border-bottom: 1px solid #f0f0f0;
    text-align: center;
  }
  
  .detail-table td {
    font-size: 16px;
  }
  .detail-table tr {
    display: table;
    width: 100%;
    table-layout: fixed; 
  }
  .detail-table tr:hover {
    background-color: #e9ecef;
  }
  
  .detail-table tr:nth-child(even) {
    background-color: #f1f3f5;
  }
  .detail-table th,
  .detail-table td {
    padding: 20px; 
    border-bottom: 1px solid #f0f0f0;
    text-align: center;
  }
  .detail-table th {
    background-color: #17a2b8; 
    color: white;
    font-weight: 600;
    font-size: 18px; 
    text-transform: uppercase; 
    cursor: pointer;
  }
  
  .detail-table td {
    padding: 16px;
    border-bottom: 1px solid #dee2e6;
    text-align: center;
    font-size: 16px; 
    height:40px;
  }
  
  .detail-table tr:hover {
    background-color: #e9ecef; 
  }
  
  .detail-table tr:nth-child(even) {
    background-color: #f1f3f5; 
  }
  
  .avatar-img {
    width: 50px; 
    height: 50px;
    border-radius: 50%;
  }
  
  /* Modal Overlay */
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
  }
  
  /* Modal Container */
  .modal-container {
    background-color: #fff;
    border-radius: 8px;
    width: 80%;
    max-width: 1200px;
    padding: 20px;
    box-shadow: 0px 6px 12px rgba(0, 0, 0, 0.1);
    position: relative;
    overflow: auto;
  }
  
  .close-btn {
    background-color: #dc3545;
    color: white;
    border: none;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    cursor: pointer;
    transition: background-color 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0;
    position: absolute;
    top: 10px;
    right: 10px;
  }
  
  .close-btn:hover {
    background-color: #c82333;
  }
  
  .close-btn i {
    font-size: 20px;
  }
  .avatar-img {
    width: 50px;
    height: 50px;
    border-radius: 50%;
  }
  .detail-search-bar {
  
    margin-top: 50px;
    width: calc(100% - 50px); /* Ensure it fits well */
    padding: 8px;
  
  }
  .add-btn2 {
    background-color: #007bff;
    color: white;
    border: none;
    border-radius:1rem;
    width: 150px;
    height: 50px;
    font-size: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: background-color 0.3s ease;
    box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
    margin: 0 auto;
  }
  
  .add-btn2:hover {
    background-color: #0056b3;
    box-shadow: 0px 6px 10px rgba(0, 0, 0, 0.2);
  }
  
  .detail-search-bar {
    width: 250px; 
    padding: 12px;
    border-radius: 25px;
    border: 1px solid #ddd;
    outline: none;
    box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
    transition: border-color 0.3s ease;
  }
  
  .detail-search-bar:focus {
    border-color: #007bff;
  }
  .project-details-title {
  margin-bottom:-30px;
  }
  .project-details{
    margin-top: -10px;
    display: flex;
    flex-direction: column;
    align-items: center; 
    width: 100%;
  }
  </style>
  