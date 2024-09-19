<template>
<div v-if="isVisible" class="modal-backdrop">
  <div class="modal fade show " tabindex="-1"  id="myModal1"  aria-hidden="false" style="display: block; ">
    <div class="modal-dialog " style="display: block;">
          <div class="modal-content" style="background-color: rgb(183, 213, 236);">
            <div class="modal-header" style=" border-bottom: solid 0.05em gray;">
              <h5 class="modal-title" >Thêm mới nhân viên</h5>
              <button type="button" class="btn-close" @click="closeModal" aria-label="Close"></button>
            </div>
            <div class="modal-body" style=" border-bottom: solid 0.05em gray;">
              <form ref="employeeForm" class="form" @submit.prevent="submitForm">
                <div class="mb-3">
                  <label for="profilePicture" class="form-label">Ảnh đại diện</label>
                  <input type="file" class="form-control" id="profilePicture" @change="previewImage" accept="image/*" />
                </div>
                <div class="mb-3">
                  <img :src="employee.profilePicture" alt="Profile Picture" class="img-thumbnail" v-if="employee.profilePicture" />
                </div>
                <div class="mb-3">
                  <label for="employeeName" class="form-label">Họ tên</label>
                  <input type="text" class="form-control" id="employeeName" v-model="employee.name" required>
                </div>
                <div class="mb-3">
                  <label for="username" class="form-label">Tên đăng nhập</label>
                  <input type="text" class="form-control" id="username" v-model="employee.username"
                    autocomplete="username" required pattern="[a-zA-Z0-9]+"
                    title="Tên đăng nhập chỉ chứa chữ cái và số">
                </div>
                <div class="col-md-6 mb-3">
                  <label for="password" class="form-label">Mật khẩu</label>
                  <input type="password" class="form-control" id="password" v-model="employee.password"
                    autocomplete="current-password" required minlength="6">
                </div>
                <div class="row">
                <div class="col-md-6 mb-3">
                  <label for="employeePosition" class="form-label">Chức vụ</label>
                  <select class="form-select" v-model="employee.position" required>
                    <option value="Admin">Admin</option>
                    <option value="Manager" selected>Manager</option>
                    <option value="Senior">Senior</option>
                    <option value="Middle">Middle</option>
                    <option value="Junior">Junior</option>
                    <option value="Fresher">Fresher</option>
                    <option value="Tester">Tester</option>
                  </select>
                </div>
                <div class="col-md-6 mb-3">
                  <label for="level" class="form-label">Cấp bậc</label>
                  <select class="form-select" v-model="employee.level" required>
                    <option value="1" selected>1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                  </select>
                </div>
              </div>
              <div class="row">
                <div class="col-md-6 mb-3">
                  <label for="date" class="form-label">Thuộc dự án</label>
                  <select class="form-select" v-model="employee.project" required>
                    <option v-for="project in projects" :key="project.id" :value="project.name">
                      {{ project.name }}
                    </option>
                  </select>
                </div>
                <div class="col-md-6 mb-3">
                  <label for="date" class="form-label">Ngày vào công ty</label>
                  <input type="date" class="form-control" id="date" v-model="employee.dateJoinCompany" required>
                </div>
              </div>
            </form>
          <div class="modal-footer">
            <button type="submit" class="btn btn-primary" @click="addEmployee">Thêm</button>
                <div class="row">
                  <div class="col-md-6 mb-3">
                    <label for="level" class="form-label" >Cấp bậc</label>
                    <select class="form-select" v-model="employee.level" required>
                      <option value="Nhân viên">Nhân viên</option>
                      <option value="Quản lý">Quản lý</option>
                      <option value="Admin">Admin</option>
                    </select>
                  </div>
                  <div class="col-md-6 mb-3">
                    <label for="date" class="form-label">Ngày tham gia</label>
                    <input type="date" class="form-control" id="date" v-model="employee.date" required>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
  </div>
  </div>
</template>


<script>
import axios from 'axios';
import Swal from 'sweetalert2';

export default {
  name: 'AddEmployee',
  props: {
    isVisible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      apiUrl: process.env.VUE_APP_DB_URL,
      projects: [],
      employee: {
        avatar: '',
        name: '',
        username: '',
        password: '',
        position: '',
        level: '',
        project: '',
        dateJoinCompany: '',
      },
    };
  },
  mounted() {
    this.fetchProjects();
  },
  methods: {
    closeModal() {
      this.$emit('close');
    },
    previewImage(event) {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          this.employee.avatar = e.target.result;
        };
        reader.readAsDataURL(file);
      }
    },
    async fetchProjects() {
      try {
        const response = await axios.get(this.apiUrl + '/projects');
        this.projects = response.data;
      } catch (error) {
        console.error('Error fetching projects:', error);
      }
    },
    async addEmployee() {
      const form = this.$refs.employeeForm;
      if (form.reportValidity()) {
        const newEmployee = JSON.parse(JSON.stringify(this.employee));
        try {
          await axios.post(this.apiUrl + '/employees', newEmployee)

          const project = this.projects.find(proj => proj.name === newEmployee.project);
          if (project) {
            const employeeExists = project.members.some(member => member.id === newEmployee.id);

            if (!employeeExists) {
              project.members.push({
                id: newEmployee.id,
                name: newEmployee.name,
                position: newEmployee.position,
                level: newEmployee.level,
                dateJoinCompany: newEmployee.dateJoinCompany,
                avatar: newEmployee.avatar
              });
            }

            await axios.put(`${this.apiUrl}/projects/${project.id}`, project);

            this.$emit('employee-added');
            Swal.fire({
              title: 'Thêm nhân viên thành công!',
              icon: 'success',
              timer: 1500,
              showConfirmButton: false
            });

            this.resetForm();
            setTimeout(() => {
              this.closeModal();
            }, 1500);
          }
        } catch (error) {
          Swal.fire({
            title: 'Lỗi!',
            text: 'Có lỗi xảy ra khi thêm nhân viên.',
            icon: 'error',
            confirmButtonText: 'Đóng'
          });
        }
      }
    },
    submitForm() {
      const newEmployee = JSON.parse(JSON.stringify(this.employee));
      this.$emit('add-employee', newEmployee);
      this.resetForm();
    },
    resetForm() {
      this.employee.avatar = ''
      this.employee.name = ''
      this.employee.username = ''
      this.employee.password = ''
      this.employee.position = ''
      this.employee.level = ''
      this.employee.date = ''
    }
  },
}
</script>
<style scoped>
label {
  font-size:large;
}
.img-thumbnail {
  width: 30%;
}

label {
  font-size:large;
}
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
