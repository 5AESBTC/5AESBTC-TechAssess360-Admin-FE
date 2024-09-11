<template>
  <div style="border-bottom: solid gray;">
    <h2 style="text-align: center">Quản lý nhân viên</h2>
  </div>
  <div>
    <nav class="navbar navbar-light bg-light mt-3" >
      <div class="container-fluid">
        <form class="d-flex ms-auto">
          <input class="form-control me-2" type="search" placeholder="Search" aria-label="Search">
          <button class="btn btn-outline-primary me-1" type="submit">Search</button>
        </form>
        <div>
          <button class="btn btn-outline-success" type="button" @click="showModal = true">Thêm mới</button>
        </div>
      </div>
    </nav>

    <div class="table-responsive-md mt-2">
      <table class="table table-striped table-hover table-bordered m-0 center" border="1" style="text-align: center">
        <thead class="table-success">
        <tr>
          <th scope="col">Stt</th>
          <th scope="col">Tên</th>
          <th scope="col">Chức vụ</th>
          <th scope="col">Sửa</th>
          <th scope="col">Xoá</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="t in paginatedAdmin" :key="t.id">
          <td>{{ t.id }}</td>
          <td>{{ t.name }}</td>
          <td>{{ t.position }}</td>
          <td>
            <a type='button' class="btn btn-warning">Chi tiết</a>
          </td>
          <td>
            <button type="button" class="btn btn-danger">Xoá</button>
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
    <ModalEmployee v-if="showModal" @close="showModal = false" @add-employee="addEmployee" />
  </div>
</template>

<script>
import ModalEmployee from './ModalEmployee.vue';

export default {
  name: 'EmployeeManager',
  components: {
    ModalEmployee
  },
  data() {
    return {
      showModal: false,
      DataTest: [
        {id: 1, name: 'Trịnh Thái Quân', position: 'Manager'},
        {id: 2, name: 'Quang', position: 'Manager'},
        {id: 3, name: 'Hải', position: 'Manager'},
        {id: 4, name: 'Đại', position: 'Manager'},
        {id: 5, name: 'Tùng', position: 'Manager'},
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
    goToPage(page) {
      this.currentPage = page;
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
    addEmployee(employee) {
      const newId = this.DataTest.length + 1;
      this.DataTest.push({ id: newId, ...employee });
      this.showModal = false;
    }
  }
};
</script>
