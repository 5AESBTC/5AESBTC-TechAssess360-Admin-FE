<template>
  <div style="border-bottom: solid gray;">
    <h2 style="text-align: center">Quản lý danh sách dự án</h2>
  </div>
  <div class="container">
    <div class="top-bar">
      <button class="btn btn-success me-3" @click="showModalAddProject">
        Thêm dự án
      </button>
      <!-- Search Bar -->
      <input type="text" v-model="searchQuery" placeholder="Tìm kiếm tên dự án hoặc bộ phận..." class="search-bar" />
    </div>

    <!-- Table -->
    <table class="table project-table table-hover table-bordered">
      <thead>
        <tr>
          <th>STT</th>
          <th @click="sort('name')">Dự án</th>
          <th>Số lượng thành viên</th>
          <th @click="sort('department')">Bộ phận</th>
          <th>Ngày bắt đầu</th>
          <th>Ngày kết thúc</th>
          <th>Tác vụ</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(project, index) in paginatedProjects" :key="project.id">
          <td>{{ (currentPage - 1) * pageSize + index + 1 }}</td>
          <td class="project-name" @click="showProjectDetailsModal(project)">{{ project.name }}</td>
          <td>{{ project.details.length }}</td>
          <td>{{ project.department }}</td>
          <td>{{ project.startDate }}</td>
          <td>{{ project.endDate }}</td>
          <td>
            <button type='button' class="btn btn-warning me-3">Cập nhật</button>
            <button type="button" class="btn btn-danger">Xoá</button>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Pagination -->
    <div class="pagination">
      <button @click="prevPage" :disabled="currentPage === 1" class="pagination-btn">
        <i class="fas fa-arrow-left"></i>
      </button>
      <span>Trang {{ currentPage }} / {{ totalPages }}</span>
      <button @click="nextPage" :disabled="currentPage === totalPages" class="pagination-btn">
        <i class="fas fa-arrow-right"></i>
      </button>
    </div>

    <!-- Add Project Modal -->
    <AddProject v-if="isShowProjectAddModal" @close="closeModalAddproject" />
    <!-- Project Detail Modal -->
    <ProjectDetails v-if="isShowProjectDetailsModal" :project="selectedProject" @close="closeProjectDetailsModal" />
  </div>
</template>

<script>
import AddProject from './modal/AddProject.vue';
import ProjectDetails from './modal/ProjectDetails.vue';


export default {
  components: {
    AddProject,
    ProjectDetails,
  },
  data() {
    return {
      isShowProjectAddModal: false,
      isShowProjectDetailsModal: false,
      searchQuery: "",
      tableSearchQuery: "",
      currentPage: 1,
      currentPage1: 1,
      currentPageDetails: 1,
      pageSize: 5,
      pageSize1: 10,
      pageSizeDetails: 5,
      sortField: "name",
      sortDirection: 1,
      sortDetailField: "nameNV",
      sortDetailDirection: 1,
      activeMenu: null,
      activeProject: null,
      activeDetail: null,
      isModalVisible: false,
      projects: [
        {
          id: 1,
          name: "TechSale",
          department: "Phát triển",
          startDate: "2022-01-01",
          endDate: "2022-02-31",
          details: [
            { nameNV: "Trịnh Thái Quân", department: "Phát triển", position: "Middle", avatar: "path/to/avatar1.jpg" },
            { nameNV: "Nguyễn Văn A", department: "Phát triển", position: "Fresher", avatar: "path/to/avatar2.jpg" },
            { nameNV: "Trịnh Thái Quân", department: "Phát triển", position: "Manager", avatar: "path/to/avatar1.jpg" },
            { nameNV: "Nguyễn Văn A", department: "Kinh Doanh", position: "Manager", avatar: "path/to/avatar2.jpg" }
          ]
        },
        {
          id: 2,
          name: "TechSign",
          department: "Phát Triển",
          startDate: "2022-02-02",
          endDate: "2022-03-31",
          details: [
            { nameNV: "Lê Thị B", department: "Phát Triển", position: "Middle", avatar: "path/to/avatar3.jpg" },
            { nameNV: "Trần Văn C", department: "Phát Triển", position: "Tester", avatar: "path/to/avatar4.jpg" },
            { nameNV: "Trịnh Thái Quân", department: "Kinh Doanh", position: "Manager", avatar: "path/to/avatar1.jpg" },
            { nameNV: "Nguyễn Văn A", department: "Kinh Doanh", position: "Fresher", avatar: "path/to/avatar2.jpg" },
            { nameNV: "Trịnh Thái Quân", department: "Kinh Doanh", position: "Manager", avatar: "path/to/avatar1.jpg" },
            { nameNV: "Nguyễn Văn A", department: "Kinh Doanh", position: "Middle", avatar: "path/to/avatar2.jpg" },
            { nameNV: "Trịnh Thái Quân", department: "Kinh Doanh", position: "Manager", avatar: "path/to/avatar1.jpg" },
            { nameNV: "Nguyễn Văn A", department: "Kinh Doanh", position: "Junior", avatar: "path/to/avatar2.jpg" },
            { nameNV: "Trịnh Thái Quân", department: "Kinh Doanh", position: "Manager", avatar: "path/to/avatar1.jpg" },
            { nameNV: "Nguyễn Văn A", department: "Kinh Doanh", position: "Sales", avatar: "path/to/avatar2.jpg" },
          ]
        },
        {
          id: 3,
          name: "TechAssess",
          department: "Kinh Doanh",
          startDate: "2022-02-02",
          endDate: "2022-03-31",
          details: [
            { nameNV: "Trịnh Thái Quân", department: "Kinh Doanh", position: "Manager", avatar: "path/to/avatar1.jpg" },
            { nameNV: "Nguyễn Văn A", department: "Kinh Doanh", position: "Sales", avatar: "path/to/avatar2.jpg" },
            { nameNV: "Trịnh Thái Quân", department: "Kinh Doanh", position: "Manager", avatar: "path/to/avatar1.jpg" },
            { nameNV: "Nguyễn Văn A", department: "Kinh Doanh", position: "Sales", avatar: "path/to/avatar2.jpg" }
          ]
        },
      ],

      selectedDepartment: "",
      // projects: [],
      selectedEmployees: [],
      selectedProject: null,
      selectedProjectDetails: [],
      showAddEmployee: false,
      previousSelectedProject: null
    };
  },
  computed: {
    filteredEmployees() {
      const lowerCaseQuery = this.tableSearchQuery ? this.tableSearchQuery.toLowerCase() : "";
      const filtered = this.employees.filter(employee => {
        return (
          (employee.name && employee.name.toLowerCase().includes(lowerCaseQuery)) ||
          (employee.department && employee.department.toLowerCase().includes(lowerCaseQuery)) ||
          (employee.role && employee.role.toLowerCase().includes(lowerCaseQuery))
        );
      });
      return filtered;
    },
    paginatedEmployees() {
      const start = (this.currentPage1 - 1) * this.pageSize1;
      return this.filteredEmployees.slice(start, start + this.pageSize1);
    },

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

  },
  methods: {
    showModalAddProject() {
      this.isShowProjectAddModal = true;
    },
    closeModalAddproject() {
      this.isShowProjectAddModal = false;
    },
    showProjectDetailsModal(project) {
      this.selectedProject = project
      this.isShowProjectDetailsModal = true;
    },
    closeProjectDetailsModal() {
      this.isShowProjectDetailsModal = false;
      this.selectedProject = null
    },
    addEmployeeToProject(employeeDetails) {
      if (this.selectedProject) {
        this.selectedProject.details.push(...employeeDetails);
      }
      this.closeAddEmployeeIntoProjectModal();
    },
    showModal() {
      this.isModalVisible = true;
    },
    closeModal() {
      this.isModalVisible = false;
    },
    // Hàm lọc dự án theo department và thêm details vào project mới
    addDetailsToNewProject(department) {
      const filteredProjects = this.projects.filter(
        (project) => project.department === department
      );
      const mergedDetails = filteredProjects.flatMap(
        (project) => project.details
      );
      this.newProject.details = mergedDetails;
    },


    sort(field) {
      if (this.sortField === field) {
        this.sortDirection *= -1;
      } else {
        this.sortField = field;
        this.sortDirection = 1;
      }
    },
    viewProjectDetails(project) {
      this.selectedProject = project;
      this.showAddEmployee = false; // Ensure Add Employee modal is hidden
    },
    closeProjectDetails() {
      this.selectedProject = null;
    },
    closeAddEmployeeModal() {
      this.showAddEmployee = false;
      // Reopen project details modal if a project was previously selected
      if (this.previousSelectedProject) {
        this.selectedProject = this.previousSelectedProject;
        this.previousSelectedProject = null; // Clear the stored project
      }
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
  }
};
</script>


<style scoped>
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  --bs-gutter-x: 0;
}

.menu-container {
  position: relative;
}

.menu-btn {
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
  color: #007bff;
  /* Màu nút */
  z-index: 1;
  transition: color 0.3s ease;
}

.menu-btn:hover {
  color: #0056b3;
  /* Màu nút khi hover */
}

.menu-dropdown {
  position: absolute;
  top: -50%;
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
  border: 1px solid white;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
}

.menu-item {
  padding: 5px 10px;
  border: none;
  background: none;
  cursor: pointer;
  font-size: 14px;
  text-align: left;
  display: flex;
  align-items: center;
  transition: background-color 0.3s ease, color 0.3s ease;

}

.menu-item:hover {
  background-color: #007bff;
  color: white;
}

.menu-item i {
  margin-right: 8px;
}

.project-table td {
  position: relative;
  padding: 5px;
  height: 40px;
}

.project-table td .menu-container {
  margin: 0 auto;
  /* Center align if necessary */
}


.top-bar {
  display: flex;
  justify-content: flex-start;
  width: 100%;
  margin-bottom: 20px;
  margin-top: 20px;
}

.search-bar {
  padding: 10px;
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
  width: 100%;
  max-height: 1000vh;
  text-align: left;
  background-color: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.05);
  position: relative;
}

.project-table th,
.project-table td {
  padding: 10px;
  border-bottom: 1px solid #f0f0f0;
  text-align: center;
}

.project-table th {
  vertical-align: middle;
  background-color: #000044;
  color: white;
  font-weight: 600;
  font-size: 18px;
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

.pagination span {
  margin-top: 30px;
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

button,
.search-bar {
  transition: box-shadow 0.2s ease, background-color 0.2s ease;
}

.modal.show {
  display: block;
  background-color: rgba(0, 0, 0, 0.5);
}

.modal-body input {
  background-color: #fff;
  width: 100%;
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

/* .add-btn2 {
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
    padding: 20px 10px ;
  } */
</style>