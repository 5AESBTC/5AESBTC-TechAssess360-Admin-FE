<template>
  <div>
    <button type="button" class="btn btn-primary" @click="showModal = true">
      Open Modal
    </button>
    <div v-if="showModal" class="modal fade show" tabindex="-1" role="dialog" style="display: block;" aria-modal="true">
      <div class="modal-dialog modal-dialog-scrollable" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Chi tiết đánh giá</h5>
            <button type="button" class="btn-close" @click="closeModal"></button>
          </div>
          <div class="modal-body">
            <!-- Thanh hiển thị dữ liệu -->
            <div class="data-display-bar">
              <div class="data-item" v-for="(item, index) in dataItems" :key="index">
                <span>{{ item.label }}</span>
                <input type="checkbox" v-model="item.checked" />
              </div>
              <div class="year-dropdown">
                <label for="year">Năm</label>
                <select id="year" v-model="selectedYear">
                  <option v-for="year in years" :key="year" :value="year">{{ year }}</option>
                </select>
              </div>
            </div>
            <!-- Nội dung đánh giá -->
            <div v-for="(item, index) in DataTest" :key="index" class="evaluation-item">
              <p>{{ item.Evaluation }}</p>
              <div class="radio-group-with-image">
                <div v-for="n in 5" :key="n" class="radio-with-image">
                  <input
                      class="form-check-input"
                      type="checkbox"
                      :name="'radioGroup' + index"
                      :id="'radio' + index + '-' + n"
                      :value="n"
                      :checked="item.currentValues.includes(n)"
                      disabled
                  />
                  <label class="form-check-label" :for="'radio' + index + '-' + n">{{ n }}</label>
                  <div v-if="getImagesForValue(item.ratings, n)" class="employee-images">
                    <div v-for="image in getImagesForValue(item.ratings, n)" :key="image" class="employee-image">
                      <img :src="image" alt="Employee Image">
                    </div>
                  </div>
                </div>
              </div>
              <br/><br/>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="closeModal">Close</button>
          </div>
        </div>
      </div>
    </div>

    <div v-if="showModal" class="modal-backdrop fade show"></div>
  </div>
</template>

<script>
import { ref } from 'vue';

export default {
  setup() {
    const showModal = ref(false);
    const selectedYear = ref('2021');
    const years = ['2021', '2022', '2023', '2024'];
    const dataItems = ref([
      { label: 'Đợt 1', checked: false },
      { label: 'Đợt 2', checked: false },
      { label: 'Đợt 3', checked: false },
      { label: 'Đợt 4', checked: false },
      { label: 'Đợt 5', checked: false }
    ]);

    const DataTest = ref([
      {
        Evaluation: 'Bạn đã hoàn tất các mục tiêu công việc trong thời gian qua 1?',
        ratings: [
          { value: 1, images: [require('@/assets/img1.png'), require('@/assets/img1.png'), require('@/assets/img1.png')] },
          { value: 3, images: [require('@/assets/img1.png'), require('@/assets/img1.png')] },
          { value: 5, images: [require('@/assets/img1.png'), require('@/assets/img1.png')] }
        ],
        currentValues: [1, 3, 5]
      },
      {
        Evaluation: 'Bạn đã hoàn tất các mục tiêu công việc trong thời gian qua 2?',
        ratings: [
          { value: 1, images: [require('@/assets/img1.png'), require('@/assets/img1.png')] },
          { value: 2, images: [require('@/assets/img1.png'), require('@/assets/img1.png')] },
          { value: 3, images: [require('@/assets/img1.png'), require('@/assets/img1.png')] },
          { value: 4, images: [require('@/assets/img1.png'), require('@/assets/img1.png')] },
          { value: 5, images: [require('@/assets/img1.png'), require('@/assets/img1.png')] }
        ],
        currentValues: [1, 2, 3, 4, 5]
      },
      {
        Evaluation: 'Bạn đã hoàn tất các mục tiêu công việc trong thời gian qua 3?',
        ratings: [
          { value: 4, images: [require('@/assets/img1.png'), require('@/assets/img1.png')] },
          { value: 5, images: [require('@/assets/img1.png'), require('@/assets/img1.png')] }
        ],
        currentValues: [4, 5]
      },
      {
        Evaluation: 'Bạn đã hoàn tất các mục tiêu công việc trong thời gian qua 4?',
        ratings: [],
        currentValues: []
      },
    ]);

    const closeModal = () => {
      showModal.value = false;
    };

    const getImagesForValue = (ratings, value) => {
      const rating = ratings.find(r => r.value === value);
      return rating ? rating.images : [];
    };

    return {
      showModal,
      selectedYear,
      years,
      dataItems,
      DataTest,
      closeModal,
      getImagesForValue
    };
  }
};
</script>

<style scoped>
.modal-dialog-scrollable {
  max-height: 90vh;
}

.modal-dialog-scrollable {
  max-width: 150vh;
}

/* Add spacing between radio buttons */
.form-check-inline {
  margin-right: 100px;
}

/* Styling for the radio group and image */
.radio-group-with-image {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
}

/* Styling for each radio button with image */
.radio-with-image {
  display: flex;
  align-items: center;
}

/* Styling the employee images */
.employee-images {
  display: flex;
  gap: 5px; /* Giảm khoảng cách giữa các hình ảnh */
}

/* Styling each employee image */
.employee-image img {
  width: 50px; /* Small size */
  height: 50px;
  border-radius: 50%; /* Circular image */
  margin-left: -10px; /* Đè lên nhau một chút */
}

/* Styling the data display bar */
.data-display-bar {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}

/* Styling each data item */
.data-item {
  display: flex;
  align-items: center;
  margin-right: 20px;
}

/* Styling the year dropdown */
.year-dropdown {
  display: flex;
  align-items: center;
}

.year-dropdown label {
  margin-right: 10px;
}
</style>
