<template>
  <div class="container">
    <div class="top-bar d-flex justify-content-between align-items-center">
      <!-- Add Project -->
      <div>
        <button type="button" class="btn btn-success" @click="showModal">
          Thêm mới dự án
        </button>
      </div>
      <!-- Search Bar -->
      <div>
        <input
          type="text"
          v-model="searchQuery"
          placeholder="Tìm kiếm dự án..."
          class="search-bar"
        />
      </div>
    </div>

    <!-- Table -->
    <table class="table text-center">
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
          <td @click="viewProjectDetails(project)" class="project-name">
            {{ project.name }}
          </td>
          <td>{{ project.details.length }}</td>
          <td>{{ project.department }}</td>
          <td>{{ project.startDate }}</td>
          <td>{{ project.endDate }}</td>

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

    <!-- Modal -->
    <div
      class="modal fade show"
      :class="{ show: isModalVisible }"
      tabindex="-1"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
      v-if="isModalVisible"
    >
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="exampleModalLabel">Thêm mới dự án</h5>
            <button
              type="button"
              class="btn-close"
              @click="closeModal"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body">
            <!-- Form nhập tên dự án và chọn bộ phận -->
            <form @submit.prevent="submitForm">
              <div class="mb-3">
                <label for="project-name" class="col-form-label"
                  >Tên dự án:</label
                >
                <input
                  type="text"
                  class="form-control"
                  id="project-name"
                  v-model="newProject.name"
                />
              </div>
              <div class="mb-3">
                <label for="project-department" class="col-form-label"
                  >Tên bộ phận:</label
                >
                <select
                  class="form-select"
                  id="project-department"
                  v-model="selectedDepartment"
                  @change="updateDetails"
                >
                  <option value="">Chọn bộ phận</option>
                  <option value="Kinh Doanh">Kinh Doanh</option>
                  <option value="Phát Triển">Phát Triển</option>
                </select>
              </div>
              <!-- <div class="mb-3" v-if="selectedDepartment">
                <div class="d-flex gap-2">
                  <span class="input-group-text" id="basic-addon1">
                    <i class="fa-solid fa-magnifying-glass"></i>
                  </span>
                  <div class="position-relative" style="width: 100%;">
                    <input
                      type="text"
                      class="form-control"
                      id="member-name"
                      v-model="searchMember"
                      placeholder="Tìm kiếm thành viên"
                      @input="filterMembers"
                    />
                    <div v-if="filteredMembers.length" class="suggestions-box">
                      <ul class="list-group mt-2">
                        <li
                          v-for="member in filteredMembers"
                          :key="member.nameNV"
                          class="list-group-item"
                          @click="selectMember(member)"
                        >
                          {{ member.nameNV }}
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div> -->
              <div class="mb-3">
                <label for="project-start-date" class="col-form-label"
                  >Ngày bắt đầu:</label
                >
                <input
                  type="date"
                  class="form-control"
                  id="project-start-date"
                  v-model="newProject.startDate"
                  :min="minDate"
                />
              </div>
              <div class="mb-3">
                <label for="project-end-date" class="col-form-label"
                  >Ngày kết thúc:</label
                >
                <input
                  type="date"
                  class="form-control"
                  id="project-end-date"
                  v-model="newProject.endDate"
                />
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="closeModal">
              Đóng
            </button>
            <button type="submit" class="btn btn-primary" @click="submitForm">
              Lưu thay đổi
            </button>
          </div>
        </div>
      </div>
    </div>


    <!-- Pagination -->
    <div class="pagination">
      <button 
        @click="prevPage" 
        :disabled="currentPage === 1" 
        class="pagination-btn"
      >
        <i class="fas fa-arrow-left"></i> 
      </button>
      <span>Trang {{ currentPage }} / {{ totalPages }}</span>
      <button 
        @click="nextPage" 
        :disabled="currentPage === totalPages" 
        class="pagination-btn"
      >
         <i class="fas fa-arrow-right"></i>
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

                <th> <button @click="showAddEmployeeModal" class="btn btn-success">
                    Thêm thành viên
                  </button></th>
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
                <td>
                  <img :src="detail.avatar" alt="Avatar" class="avatar-img" />
                </td>
                <td>{{ detail.nameNV }}</td>
                <td>{{ detail.department }}</td>
                <td>{{ detail.position }}</td>
                <td>
                  <div class="menu-container">
                    <button
                      class="menu-btn"
                      @click="toggleMenu('detail', detail)"
                    >
                      <i class="fa-solid fa-ellipsis-vertical"></i>
                    </button>
                    <div
                      v-if="activeMenu === 'detail' && activeDetail === detail"
                      class="menu-dropdown show"
                    >
                      <button class="menu-item">
                        <i class="fas fa-info-circle"></i>
                      </button>

                      <button class="menu-item" >
                        <i class="fas fa-trash" @click="removeDetail(detail)"></i>

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

  <!-- Add Employee Modal -->
    <div v-if="showAddEmployee" class="modal-overlay" @click.self="closeAddEmployeeModal">
      <div class="modal-container">
        <button @click="closeAddEmployeeModal" class="close-btn">
          <i class="fas fa-times"></i>
        </button>
        <h2 class="modal-title">Thêm nhân viên vào dự án ...</h2>
        <input 
          type="text" 
          v-model="tableSearchQuery" 
          placeholder="Tìm kiếm tên nhân viên hoặc bộ phận hoặc chức vụ" 
          class="search-bar1"
        />
        <div class="table-container">
          <table class="employee-table">
            <thead>
              <tr>
                <th></th>
                <th style="width: 350px;">Tên</th>
                <th>Bộ phận</th>
                <th>Chức vụ</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in paginatedEmployees" :key="index">
                <td style="text-align: center;">
                  <input class="form-check-input" type="checkbox" :checked="selectedEmployees.includes(index)" @click="toggleEmployee(index)">
                </td>
                <td>{{ item.name }}</td>
                <td>{{ item.department }}</td>
                <td>{{ item.role }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="buttons">
      <button @click="add" class="add1-btn">Thêm</button>
    </div>
        <!-- Pagination for employee table -->
        <div class="pagination1">
          <button 
            @click="prevPage1" 
            :disabled="currentPage1 === 1" 
            class="pagination-btn1"
          >
            <i class="fas fa-arrow-left"></i> 
          </button>
          <span>Trang {{ currentPage1 }} / {{ totalEmployeePages }}</span>
          <button 
            @click="nextPage1" 
            :disabled="currentPage1 === totalEmployeePages" 
            class="pagination-btn1"
          >
             <i class="fas fa-arrow-right"></i>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>


<script>
export default {

  data() {
    return {
      searchQuery: "",
      detailSearchQuery: "",

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
      newProject: {
        name: "",
        department: "",
        startDate: "",
        endDate: "",
        details: [],
      },
      minDate: "2023-01-01",
      selectedDepartment: "",
      // searchMember: "",
      // allMembers: [],
      // filteredMembers: [],
      projects: [],
      selectedProject: null,
      selectedProjectDetails: [],
    };
  },
  computed: {
      employees: [
        { name: 'Ha Canh Minh Quang', department: 'Phát triển', role: 'Senior',position: "Manager", avatar: "path/to/avatar1.jpg" },
        { name: 'Nguyen Van A', department: 'Tổng vụ', role: 'Fresher',position: "Manager", avatar: "path/to/avatar1.jpg" },
        { name: 'Le Van B', department: 'Phát triển', role: 'Junior',position: "Manager", avatar: "path/to/avatar1.jpg" },
        { name: 'Tran Van C', department: 'Phát triển', role: 'Senior',position: "Manager", avatar: "path/to/avatar1.jpg" },
        { name: 'Ho Xuan D', department: 'Phát triển', role: 'Middle',position: "Manager", avatar: "path/to/avatar1.jpg" },
        { name: 'Tan Tai', department: 'Global', role: 'Senior',position: "Manager", avatar: "path/to/avatar1.jpg" },
        { name: 'Nguyen Nguyen', department: 'Tổng vụ', role: 'Fresher',position: "Manager", avatar: "path/to/avatar1.jpg" },
        { name: 'Dinh Tien', department: 'Phát triển', role: 'Junior',position: "Manager", avatar: "path/to/avatar1.jpg" },
        { name: 'Nguyen Nguyen A', department: 'Tổng vụ', role: 'Fresher',position: "Manager", avatar: "path/to/avatar1.jpg" },
        { name: 'Dinh Tien V', department: 'Phát triển', role: 'Junior',position: "Manager", avatar: "path/to/avatar1.jpg" },
      ],
      selectedEmployees: [],
      selectedProject: null,
      selectedProjectDetails: [],
      showAddEmployee: false,
      previousSelectedProject: null
    };
  },
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
  totalEmployeePages() {
    return Math.ceil(this.filteredEmployees.length / this.pageSize1);
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

        return (
          this.sortDirection *
          a[this.sortField]
            .toLowerCase()
            .localeCompare(b[this.sortField].toLowerCase())
        );

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

          return (
            this.sortDetailDirection *
            a[this.sortDetailField]
              .toLowerCase()
              .localeCompare(b[this.sortDetailField].toLowerCase())
          );

        });

        return details;
      }
      return [];
    },
  },
  methods: {
    
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
    submitForm() {
      // Kiểm tra tính hợp lệ của dữ liệu
      if (!this.newProject.name.trim()) {
        alert("Vui lòng nhập tên dự án.");
        return;
        }
      if (!this.selectedDepartment) {
        alert("Vui lòng chọn bộ phận.");
        return;
      }
      if (!this.newProject.startDate || !this.newProject.endDate) {
        alert("Vui loại chọn ngày bắt đã và ngày kết thúc.");
        return;
      }
      if (this.newProject.startDate > this.newProject.endDate) {
        alert("Ngày bắt đầu phải trước ngày kết thúc.");
        return;
      }
      this.addProject(this.newProject);

      this.resetForm();
      // Đóng modal sau khi lưu
      this.closeModal();
    },
    addProject(project) {
      this.newProject.department = this.selectedDepartment;
      // Thêm chi tiết vào dự án mới dựa trên bộ phận được chọn
      this.addDetailsToNewProject(this.selectedDepartment);

      this.projects.push(project);
    },
    // addMemberToDetails() {
    //   if (this.newMemberName.trim() === "") {
    //     alert("Vui lòng nhập tên thành viên.");
    //     return;
    //   }

    //   const member = {
    //     nameNV: this.newMemberName.trim(),
    //     department: this.selectedDepartment,
    //   };

    //   if (!this.newProject.details.some((m) => m.nameNV === member.nameNV)) {
    //     this.newProject.details.push(member);
    //   }

    //   // Reset member name input
    //   this.newMemberName = "";
    // },
    // removeMemberFromDetails(member) {
    //   this.newProject.details = this.newProject.details.filter(
    //     (m) => m.nameNV !== member.nameNV
    //   );
    // },
    // updateMembers() {
    //   this.filteredMembers = this.allMembers.filter(
    //     (member) => member.department === this.selectedDepartment
    //   );
    //   this.searchMember = ""; // Clear search query when department changes
    // },
    // filterMembers() {
    //   // Clear suggestions if the search query is empty
    //   if (this.searchMember.trim() === "") {
    //     this.filteredMembers = [];
    //     return;
    //   }
    //   // Filter members based on search query
    //   const query = this.searchMember.toLowerCase();
    //   this.filteredMembers = this.allMembers
    //     .filter(member =>
    //       member.department === this.selectedDepartment &&
    //       member.nameNV.toLowerCase().includes(query)
    //     );
    // },
    // selectMember(member) {
    //   let str = "";
    //   if (!this.newProject.details.some((m) => m.nameNV === member.nameNV)) {
    //     str += member.nameNV + ", ";
    //     document.getElementById("member-name").value = str;
    //   }
    //   // remove member from suggestions
    //   // this.filteredMembers = this.filteredMembers.filter(
    //   //   (m) => m.nameNV !== member.nameNV
    //   // )
    // },
    resetForm() {
      const today = this.newProject.startDate; // Giữ lại giá trị ngày mặc định
      this.newProject = {
        name: "",
        department: "",
        startDate: null,
        endDate: null,
        details: [],
      };
      this.newProject.startDate = today; // Khôi phục giá trị ngày mặc định
      this.selectedDepartment = "";
    },
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
      if (type === "project") {
        if (this.activeProject === item) {
          this.activeProject = null; // Close the menu if clicked again
        } else {
          this.activeProject = item;
          this.activeMenu = "project";
          this.activeDetail = null; // Close detail menu if open
        }
      } else if (type === "detail") {
        if (this.activeDetail === item) {
          this.activeDetail = null; // Close the menu if clicked again
        } else {
          this.activeDetail = item;
          this.activeMenu = "detail";
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
    add() {
      const selectedEmployeeDetails = this.selectedEmployees.map(index => this.employees[index]);
      if (this.previousSelectedProject) {
        selectedEmployeeDetails.forEach(employee => {
          this.previousSelectedProject.details.push({
            nameNV: employee.name,
            department: employee.department,
            position: employee.role,
            avatar: "path/to/default-avatar.jpg", 
          });
        });
      }
      this.closeAddEmployeeModal();
    },
    removeDetail(detail) {
      const index = this.selectedProject.details.indexOf(detail);
      if (index !== -1) {
        this.selectedProject.details.splice(index, 1);
      }
    },

    toggleEmployee(index) {
      if (this.selectedEmployees.includes(index)) {
        this.selectedEmployees = this.selectedEmployees.filter(i => i !== index);
      } else {
        this.selectedEmployees.push(index);
      }
    },
    prevPage1() {
    if (this.currentPage1 > 1) {
      this.currentPage1 -= 1;
    }
  },
  nextPage1() {
    if (this.currentPage1 < this.totalEmployeePages) {
      this.currentPage1 += 1;
    }
  },
    // add() {
    //   // Handle add logic here
    //   console.log('Add clicked');
    //   // Get selected employee names
    //   const selectedEmployeeNames = this.selectedEmployees.map(index => this.employees[index].name);
    //   console.log('Selected employees:', selectedEmployeeNames);
    // },
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
    this.showAddEmployee = false; // Ensure Add Employee modal is hidden
  },
  closeProjectDetails() {
    this.selectedProject = null;
  },
  showAddEmployeeModal() {
    this.showAddEmployee = true;
    this.previousSelectedProject = this.selectedProject; // Store the currently selected project
    this.selectedProject = null; // Hide project details modal
  },
  closeAddEmployeeModal() {
    this.showAddEmployee = false;
    // Reopen project details modal if a project was previously selected
    if (this.previousSelectedProject) {
      this.selectedProject = this.previousSelectedProject;
      this.previousSelectedProject = null; // Clear the stored project
    }
  },
  },
  mounted() {
    this.projects = [
      {
        id: 1,
        name: "ABC",
        department: "Kinh Doanh",
        startDate: "2022-01-01",
        endDate: "2022-02-31",
        details: [
          {
            nameNV: "Trịnh Thái Quân",
            department: "Kinh Doanh",
            position: "Manager",
            avatar: "path/to/avatar1.jpg",
          },
          {
            nameNV: "Nguyễn Văn A",
            department: "Kinh Doanh",
            position: "Sales",
            avatar: "path/to/avatar2.jpg",
          },
        ],
      },
      {
        id: 2,
        name: "TechSign",
        department: "Phát Triển",
        startDate: "2022-02-02",
        endDate: "2022-03-31",
        details: [
          {
            nameNV: "Lê Thị B",
            department: "Phát Triển",
            position: "Developer",
            avatar: "path/to/avatar3.jpg",
          },
          {
            nameNV: "Trần Văn C",
            department: "Phát Triển",
            position: "Tester",
            avatar: "path/to/avatar4.jpg",
          },
        ],
      },
    ];

    // Populate allMembers with members from projects
    // this.allMembers = this.projects.flatMap((project) => project.details);

    const today = new Date().toISOString().split('T')[0]; 
    this.newProject.startDate = today;
  },
};
</script>

<style scoped>
.project-table td.project-name {
    font-weight: bold;
    transition: color 0.3s ease, background-color 0.3s ease; 
  }
  
  .project-table td.project-name:hover {
    color: #007bff; 
    background-color: #f0f8ff; 
    cursor: pointer; 
  }
  .pagination span{
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
    background:none; 
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
      margin-top: 20px;
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
.position-relative {
  position: relative;
}

.suggestions-box {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background-color: white;
  border: 1px solid #ced4da;
  border-radius: 0.375rem;
  z-index: 1000;
}

.list-group-item {
  cursor: pointer;
  border: none;
}

.list-group-item:hover {
  background-color: #f8f9fa;
}

.modal.show {
  display: block;
  background-color: rgba(0, 0, 0, 0.5);
}

.modal-body input {
  background-color: #fff;
  width: 100%;
}
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
  height: 40px;
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

/* .project-table {
    border-collapse: separate;
    border-spacing: 0;
    width: 90%;
    max-height: 1000vh;
    text-align: left;
    background-color: white;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.05);
    position: relative;
    overflow: auto;
  } */
  
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
  text-align: center;
  }
  .project-details{
    margin-top: -10px;
    display: flex;
    flex-direction: column;
    align-items: center; 
    width: 100%;
  }
  .search-bar1 {
      padding: 10px;
      width: 400px;
      border-radius: 25px;
      border: 1px solid #ddd;
      outline: none;
      transition: border-color 0.3s ease;
      margin-top: 10px;
      margin-bottom: 10px;
}

.table-container {
  height: 470px; 
  overflow-y: auto;
}
.employee-table {
  width: 100%;
}

table {
  width: 100%;
  border-collapse: collapse;
}

.employee-table th, td {
  text-align: left;
  padding: 8px;
  border: 1px solid #ddd;
}

.employee-table th {
  background-color: #f2f2f2;
}

.buttons {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}

 .add1-btn {
  padding: 10px 20px;
  margin: 0 10px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}
.cancel-btn{
  padding: 10px 20px;
  margin: 0 10px;
  background-color: #af5c4c;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

 .add1-btn:hover {
  opacity: 0.8;
  background-color: #2b5407;
}
.cancel-btn:hover{
  opacity: 0.8;
  background-color: #7e0909;
}
.modal-title{
  text-align: center;
}
       .pagination1 span{
       margin-top: 30px;
        }
        .pagination1{
          text-align: center;
        }
  
      .pagination-btn1 {
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
  
      .pagination-btn1:hover {
      background-color: #0056b3;
      }
      .pagination-btn1:disabled {
      background-color: #aaa;
      cursor: not-allowed;
      }
  </style>
  