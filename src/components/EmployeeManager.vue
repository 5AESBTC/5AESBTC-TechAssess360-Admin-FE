<template>
  <div style="border-bottom: solid gray;">
    <h2 style="text-align: center">Quản lý danh sách nhân viên</h2>
  </div>
  <div class="content">
    <nav class="navbar navbar-light mt-3">
      <div class="top-bar">
        <button class="btn btn-success me-3" type="button" @click="openModal">Thêm nhân viên</button>
        <!-- Search Bar -->
        <input type="text" v-model="searchQuery" placeholder="Tìm kiếm tên nhân viên hoặc bộ phận..."
          class="search-bar" />
      </div>
    </nav>
    <div class="table-responsive-md mt-2">
      <table class="table table-hover table-bordered employee-table">
        <thead>
          <tr>
            <th scope="col">STT</th>
            <th scope="col">Tên</th>
            <th scope="col">Bộ phận</th>
            <th scope="col">Chức vụ</th>
            <th scope="col">Cấp bậc</th>
            <th scope="col">Ngày vào công ty</th>
            <th scope="col">Tác vụ</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="t in paginatedAdmin" :key="t.id">
            <td>{{ t.id }}</td>
            <td>{{ t.name }}</td>
            <td>{{ t.department }}</td>
            <td>{{ t.position }}</td>
            <td>{{ t.level }}</td>
            <td>{{ t.date }}</td>
            <td>
              <a type='button' class="btn btn-warning me-3" @click="editEmployee(t)">Sửa</a>
              <button class="btn btn-primary me-3">Đánh giá</button>
              <button type="button" class="btn btn-danger" @click="confirmDelete(t.id)">Xoá</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination -->
    <div class="pagination-wrapper">
      <button @click="prevPage" :disabled="currentPage === 1" class="pagination-btn">
        <i class="fas fa-arrow-left"></i>
      </button>
      <span>Trang {{ currentPage }} / {{ totalPages }}</span>
      <button @click="nextPage" :disabled="currentPage === totalPages" class="pagination-btn">
        <i class="fas fa-arrow-right"></i>
      </button>
    </div>

    <!-- Modal Component -->
    <AddEmployeeModal :isVisible="isModalVisible" @close="closeModal" @add-employee="addEmployee" />
    <EditEmployeeModal :is-visible1="isModalVisible1" :employeeData="selectedEmployee" @close="closeModal1"
      @update="handleUpdate" />
  </div>
</template>

<script>
import AddEmployeeModal from './modal/AddEmployeeModal.vue';
import axios from 'axios';
import EditEmployeeModal from './modal/EditEmployeeModal.vue';
export default {
  components: {
    AddEmployeeModal,
    EditEmployeeModal,
  },
  data() {
    return {
      isModalVisible: false,
      isModalVisible1: false,
      selectedEmployee: null,
      DataTest: [
        { id: 1, name: 'Trịnh Thái Quân', username: 'adnka', password: 'akdakd', department: 'a', position: 'Manager', level: '1', date: '1/1/1' },
        { id: 2, name: 'Quang', department: 'd', position: 'Manager', level: '1' },
        { id: 3, name: 'Hải', department: 'c', position: 'Manager', level: '2' },
        { id: 4, name: 'Đại', department: '2', position: 'Manager', level: '1' },
        { id: 5, name: 'Tùng', department: '1', position: 'Manager', level: '1' },
      ],
      currentPage: 1,
      itemsPerPage: 4,
    };
  },
  computed: {
    totalPages() {
      return Math.ceil(this.DataTest.length / this.itemsPerPage);
    },
    paginatedAdmin() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return this.DataTest.slice(start, end);
    }
  },
  methods: {
    openModal() {
      this.isModalVisible = true;
    },
    openModal1() {
      this.isModalVisible1 = true;
    },
    closeModal() {
      this.isModalVisible = false;
    },
    closeModal1() {
      this.isModalVisible1 = false;
    },
    editEmployee(employee) {
      this.selectedEmployee = { ...employee }; // Đảm bảo tạo một bản sao của đối tượng nhân viên
      this.openModal1();
    },
    handleUpdate(updatedEmployee) {
      const index = this.DataTest.findIndex(emp => emp.id === updatedEmployee.id);
      if (index !== -1) {
        this.DataTest.splice(index, 1, updatedEmployee);
      }
      this.closeModal1();
    },
    confirmDelete(id) {
      const confirmed = window.confirm('Bạn có chắc chắn muốn xóa nhân viên này? ');
      if (confirmed) {
        this.deleteUser(id);
      }
    },
    async deleteUser(id) {
      try {
        await axios.delete(`https://jsonplaceholder.typicode.com/posts/${id}`);
        this.DataTest = this.DataTest.filter(emp => emp.id !== id);
        console.log('Employee deleted successfully');
      } catch (error) {
        console.error('Error deleting employee:', error);
      }
    },
    prevPage() {
      if (this.currentPage > 1) {
        this.currentPage--;
      }
    },
    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++;
      }
    },
    goToPage(page) {
      this.currentPage = page;
    },
    addEmployee(newEmployee) {
      this.DataTest.push(newEmployee)
      console.log(newEmployee)
      this.closeModal();
    }
  }
};
</script>
<style scoped>
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

.employee-table {
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

.employee-table th,
.employee-table td {
  padding: 7px;
  vertical-align: middle;
  border-bottom: 1px solid #f0f0f0;
  text-align: center;
}

.employee-table th {
  background-color: #000044;
  color: white;
  font-weight: 600;
  font-size: 20px;
  cursor: pointer;
}

.employee-table tr:hover {
  background-color: #f9f9f9;
}

.employee-table tr:nth-child(even) {
  background-color: #f2f2f2;
}

.employee-table td.project-name {
  transition: color 0.3s ease, background-color 0.3s ease;
}

.employee-table td.project-name:hover {
  color: #007bff;
  background-color: #f0f8ff;
  cursor: pointer;
}

.pagination-wrapper {
  display: flex;
  justify-content: center;
  margin-top: 30px;
}

.pagination-wrapper span {
  margin-top: 28px;
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
</style>
