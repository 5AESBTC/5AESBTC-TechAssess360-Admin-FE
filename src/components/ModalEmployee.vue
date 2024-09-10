<template>
    <div class="modal fade show" tabindex="-1" aria-labelledby="addEmployeeModalLabel" aria-hidden="true" style="display: block; ">
      <div class="modal-dialog">
        <div class="modal-content" style="border-radius: 20px;">
          <div class="modal-header" style="background-color:rgba(25, 135, 84, 0.25); border-bottom: solid 0.1em #333;">
            <h5 class="modal-title" id="addEmployeeModalLabel">Thêm mới nhân viên</h5>
            <button type="button" class="btn-close" @click="$emit('close')" aria-label="Close"></button>
          </div>
          <div class="modal-body " style="background-color:rgba(25, 135, 84, 0.25);">
            <form class="form" @submit.prevent="submitForm">
                <div class="mb-3">
                    <label for="profilePicture" class="form-label">Ảnh đại diện</label>
                    <input type="file" class="form-control" id="profilePicture" @change="previewImage" accept="image/*" />
                </div>
                <div class="mb-3">
                    <img :src="employee.profilePicture" alt="Profile Picture" class="img-thumbnail" v-if="employee.profilePicture"  />
                </div>
              <div class="mb-3">
                <label for="employeeName" class="form-label">Họ tên</label>
                <input type="text" class="form-control" id="employeeName" v-model="employee.name" required>
              </div>
              <div class="mb-3">
                <label for="username" class="form-label">Tên đăng nhập</label>
                <input type="text" class="form-control" id="username" v-model="employee.username" required>
              </div>
              <div class="mb-3">
                <label for="password" class="form-label">Mật khẩu</label>
                <input type="password" class="form-control" id="password" v-model="employee.password" required>
            </div>
              <!-- <div class="row">
                  <div class="col-md-6 mb-3 d-flex align-items-center">
                      <div data-mdb-input-init class="form-outline datepicker w-100">
                      <label for="birthdayDate" class="form-label">Ngày sinh</label>
                      <input type="text" class="form-control" id="birthdayDate" />
                      </div>
                  </div>
                  <div class="col-md-6 mb-3">
                      <label for="employeeGender" class="form-label">Giới tính</label>
                      <select class="form-select" v-model="employee.gender" required>
                          <option value="Male">Nam</option>
                          <option value="Female">Nữ</option>
                          <option value="Other">Khác</option>
                      </select>
                      </div>
                  </div> -->
              <div class="row">
                  <div class="col-md-6 mb-3 ">
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
                <button type="submit" class="btn btn-primary">Thêm</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>

  export default {
    name: 'ModalEmployee',
    data() {
      return {
        employee: {
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
      submitForm() {
        this.$emit('add-employee', this.employee);
        this.employee.name = '';
        this.employee.username = '',
        this.employee.password = '',
        this.employee.department = '',
        this.employee.position = '';
        this.employee.level = '',
        this.employee.date = ''
      },
    },
  };
  </script>
  <style> 

  .modal-body input{
    background-color: rgba(244, 244, 244, 0.984);
    width: 80%;
  }
</style>