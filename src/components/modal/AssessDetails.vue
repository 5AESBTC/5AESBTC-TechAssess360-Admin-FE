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
                <input type="checkbox" v-model="item.checked" />
                <span>{{ item.label }}</span>
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

/* Styling the data display bar */
.data-display-bar {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  margin-bottom: 20px;
  padding: 0 10px;
}

/* Styling each data item */
.data-item {
  display: flex;
  align-items: center;
  gap: 3px;
  margin-right: 20px;
}

/* Styling the year dropdown */
.year-dropdown {
  display: flex;
  align-items: center;
  gap: 0px;
}

.year-dropdown label {
  margin-right: 5px;
}

/* Styling for the radio group and image */
.radio-group-with-image {
  display: flex;
  align-items: center;
  gap: 10px;
}

/* Styling each radio button with image */
.radio-with-image {
  display: flex;
  align-items: center;
  gap: 0px; /* Add spacing between radio button and label */
}

/* Circular radio buttons */
.form-check-input {
  width: 20px;
  height: 20px;
  border-radius: 50%; /* Make the radio button circular */
  border: 2px solid gray;
  margin-right: 3px; /* Space between the radio button and its label */
}

/* Styling the employee images container with overlap */
.employee-images {
  display: flex;
  gap: 0; /* No gap to overlap the images */
  margin-left: 10px; /* Add space between the currentValues and the images */
  position: relative;
}

.employee-image {
  position: relative;
  margin-left: -10px; /* Negative margin to create overlap */
}

/* Styling each employee image */
.employee-image img {
  width: 40px; /* Set the size of the image */
  height: 40px;
  border-radius: 50%; /* Circular image */
  border: 2px solid gray; /* Add gray border around */
  position: relative;
}

/* Spacing between current values and images */
.radio-group-with-image .form-check-label {
  margin-right: 0px;
}
</style>
