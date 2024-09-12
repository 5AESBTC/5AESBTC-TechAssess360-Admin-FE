<template>
  <div style="border-bottom: solid gray;">
    <h2 style="text-align: center">Quản lý nhân viên</h2>
  </div>
  <div>
    <nav class="navbar navbar-light bg-light mt-3">
      <div class="container-fluid">
        <form class="d-flex ms-auto">
          <input class="form-control me-2" type="search" placeholder="Search" aria-label="Search">
          <button class="btn btn-outline-primary me-1" type="submit">Search</button>
        </form>
        <div>
          <button class="btn btn-outline-success" type="button" @click="openModal">Thêm mới</button>
        </div>
      </div>
    </nav>
    <div class="table-responsive-md mt-2">
      <table class="table table-striped table-hover table-bordered m-0 center" style="text-align: center">
        <thead class="table-success">
          <tr>
            <th scope="col">ID</th>
            <th scope="col">Tên</th>
            <th scope="col">Tài khoản</th>
            <th scope="col">Mật khẩu</th>
            <th scope="col">Bộ phận</th>
            <th scope="col">Chức vụ</th>
            <th scope="col">Cấp bậc</th>
            <th scope="col">Ngày tham gia</th>
            <th scope="col">Sửa</th>
            <th scope="col">Xoá</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="t in paginatedAdmin" :key="t.id">
            <td>{{ t.id }}</td>
            <td>{{ t.name }}</td>
            <td>{{ t.username }}</td>
            <td>*********</td>
            <td>{{ t.department }}</td>
            <td>{{ t.position }}</td>
            <td>{{ t.level }}</td>
            <td>{{ t.date }}</td>
            <td>
              <a type='button' class="btn btn-warning" @click="editEmployee(t)">Chi tiết</a>
            </td>
            <td>
              <button type="button" class="btn btn-danger" @click="confirmDelete(t.id)">Xoá</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination Controls -->
    <nav aria-label="Page navigation">
      <ul class="pagination justify-content-center mt-3">
        <li class="page-item" :class="{ disabled: currentPage === 1 }">
          <button class="page-link" @click="prevPage">Trước</button>
        </li>
        <li class="page-item" v-for="page in totalPages" :key="page" :class="{ active: currentPage === page }">
          <button class="page-link" @click="goToPage(page)">{{ page }}</button>
        </li>
        <li class="page-item" :class="{ disabled: currentPage === totalPages }">
          <button class="page-link" @click="nextPage">Sau</button>
        </li>
      </ul>
    </nav>

    <!-- Modal Component -->
    <AddEmployeeModal :isVisible="isModalVisible" @close="closeModal" @add-employee="addEmployee" />
    <EditEmployeeModal :is-visible1="isModalVisible1" :employeeData="selectedEmployee" @close="closeModal1" @update="handleUpdate" />
  </div>
</template>

<script>
import AddEmployeeModal from './AddEmployeeModal.vue';
import axios from 'axios';
import EditEmployeeModal from './EditEmployeeModal.vue';
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
      { id: 1, name: 'Trịnh Thái Quân',username:'adnka',password:'akdakd', department: 'a', position: 'Manager', level: '1', date:'1/1/1' },
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
  addEmployee(newEmployee){
    this.DataTest.push(newEmployee)
    console.log(newEmployee)
    this.closeModal();  
  }
}
};
</script>
