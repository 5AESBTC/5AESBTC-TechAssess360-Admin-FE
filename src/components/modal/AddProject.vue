<template>
    <!-- Modal Add Project -->
    <div class="modal fade show" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="exampleModalLabel">Thêm mới dự án</h5>
                    <button type="button" class="btn-close" @click="$emit('close')" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <!-- Form nhập tên dự án và chọn bộ phận -->
                    <form>
                        <div class="mb-3 d-flex">
                            <label for="project-name" class="col-form-label text-start w-50 ">Tên dự án:</label>
                            <input type="text" class="form-control" id="project-name" v-model="newProject.name" />
                        </div>
                        <div class="mb-3 d-flex">
                            <label for="project-department" class="col-form-label text-start w-50">Thuộc bộ
                                phận:</label>
                            <select class="form-select" id="project-department">
                                <option value="">Phát triển</option>
                                <option value="Kinh Doanh">Kinh Doanh</option>
                                <option value="Phát Triển">Tổng vụ</option>
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
                        <div class="mb-3 d-flex">
                            <label for="project-start-date" class="col-form-label text-start w-50">Ngày bắt đầu:</label>
                            <input type="date" class="form-control" id="project-start-date"
                                v-model="newProject.startDate" :min="minDate" />
                        </div>
                    </form>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" @click="$emit('close')">
                        Đóng
                    </button>
                    <button button type=" submit" class="btn btn-primary">
                        Thêm dự án
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    name: 'AddProject',
    data() {
        return {
            isModalVisible: false,
            newProject: {
                name: "",
                department: "",
                startDate: "",
                endDate: "",
                details: [],
            },
            minDate: "2023-01-01",
        };
    },
    method: {
        showModal() {
            this.isModalVisible = true;
        },
    },
}
</script>

<style scoped></style>