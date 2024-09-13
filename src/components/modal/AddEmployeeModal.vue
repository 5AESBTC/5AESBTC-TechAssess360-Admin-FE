<template>
<div v-if="isVisible" class="modal-backdrop">
  <div class="modal fade show " tabindex="-1"  id="myModal1"  aria-hidden="false" style="display: block; ">
    <div class="modal-dialog ">
            <div class="modal-content" >
            <div class="modal-header" style="background-color:rgba(25, 135, 84, 0.25); border-bottom: solid 0.05em gray;">
              <h5 class="modal-title" >Sửa thông tin</h5>
              <button type="button" class="btn-close" @click="closeModal" aria-label="Close"></button>
            </div>
            <div class="modal-body" style="background-color:rgba(25, 135, 84, 0.25); border-bottom: solid 0.05em gray;">
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
                  <input type="text" class="form-control" id="username" v-model="employee.username" autocomplete="username" required pattern="[a-zA-Z0-9]+" title="Tên đăng nhập chỉ chứa chữ cái và số">
                </div>
                <div class="mb-3">
                  <label for="password" class="form-label">Mật khẩu</label>
                  <input type="password" class="form-control" id="password" v-model="employee.password" autocomplete="current-password" required minlength="6">
                </div>
                <div class="row">
                  <div class="col-md-6 mb-3">
                    <label for="department" class="form-label">Bộ phận</label>
                    <select class="form-select" v-model="employee.department" required>
                      <option value="Nhân viên">Nhân viên</option>
                      <option value="Quản lý">Quản lý</option>
                      <option value="Admin">Admin</option>
                    </select>
                  </div>
                  <div class="col-md-6 mb-3">
                    <label for="employeePosition" class="form-label">Chức vụ</label>
                    <select class="form-select" v-model="employee.position" required>
                      <option value="Nhân viên">Nhân viên</option>
                      <option value="Quản lý">Quản lý</option>
                      <option value="Admin">Admin</option>
                    </select>
                  </div>
                </div>
                <div class="row">
                  <div class="col-md-6 mb-3">
                    <label for="level" class="form-label">Cấp bậc</label>
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
              </form>
            </div>
            <div class="modal-footer" style="background-color:rgba(25, 135, 84, 0.25);">
              <button type="submit" class="btn btn-primary" @click="submitExternal">Thêm</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  

<script>
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
      employee: {
        profilePicture: '',
        name: '',
        username: '',
        password: '',
        department: '',
        position: '',
        level: '',
        date: '',
      },
    };
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
        this.employee.profilePicture = e.target.result;
      };
      reader.readAsDataURL(file);
    }
     },
    submitExternal() {
    const form = this.$refs.employeeForm;
    if (form.reportValidity()) {
      form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
      this.closeModal();
      }
    },
    submitForm() {
      // Tạo một bản sao sâu của đối tượng employee
      const newEmployee = JSON.parse(JSON.stringify(this.employee));
      this.$emit('add-employee', newEmployee);
      this.resetForm();
    },
    resetForm() {
      this.employee.profilePicture = '',
      this.employee.name = '';
      this.employee.username = '';
      this.employee.password = '';
      this.employee.department = '';
      this.employee.position = '';
      this.employee.level = '';
      this.employee.date = '';
    }
  },
}
</script>
<style scoped>
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
