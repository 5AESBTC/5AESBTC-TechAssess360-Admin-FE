<template>
  <div>
    <button type="button" class="btn btn-primary" @click="showModal = true">
      Chi tiết đánh giá
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
                <div class="form-check form-check-inline">
                  <input class="form-check-input" type="checkbox" id="inlineCheckbox1" v-model="item.checked">
                  <label class="form-check-label" for="inlineCheckbox1">{{ item.label }}</label>
                </div>
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
                <div v-for="n in 5" :key="n" class="radio-with-image" style="width: 200px">
                  <input class="form-check-input" type="checkbox"
                         :name="'radioGroup' + index"
                         :id="'radio' + index + '-' + n"
                         :value="n"
                         :checked="item.currentValues.includes(n)"
                         disabled
                  />
                  <label class="form-check-label" :for="'radio' + index + '-' + n">{{ n }}</label>
                  <div v-if="getImagesForValue(item.ratings, n).length" class="employee-images" style="width: 100px">
                    <!-- Chỉ hiển thị tối đa 3 ảnh -->
                    <div class="employee-image" v-for="(image, i) in getImagesForValue(item.ratings, n).slice(0, 3)"
                         :key="i"
                         @mouseover="showDescription(item.ratings, n)"
                         @mouseleave="hideDescription">
                      <img :src="image" alt="Employee Image">
                      <p v-show="showMessage" class="description">{{ hoveredDescription }}</p>
                    </div>
                    <!-- Dấu "..." nếu có nhiều hơn 3 ảnh -->
                    <div v-if="getImagesForValue(item.ratings, n).length > 3" class="more-images">
                      ... <!-- Dấu "..." khi có hơn 3 ảnh -->
                      <div class="tooltip-images">
                        <div v-for="(image, i) in getImagesForValue(item.ratings, n).slice(3)" :key="i">
                          <img :src="image" alt="Employee Image">
                        </div>
                      </div>
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
import {ref} from 'vue';

export default {
  setup() {
    const showModal = ref(false);
    const selectedYear = ref('2021');
    const years = ['2021', '2022', '2023', '2024'];
    const dataItems = ref([
      {label: 'Đợt 1', checked: false},
      {label: 'Đợt 2', checked: false},
      {label: 'Đợt 3', checked: false},
      {label: 'Đợt 4', checked: false},
      {label: 'Đợt 5', checked: false}
    ]);

    const DataTest = ref([
      {
        Evaluation: 'Bạn đã hoàn tất các mục tiêu công việc trong thời gian qua 1?',
        ratings: [
          {
            value: 1,
            images: [require('@/assets/logo.png'), require('@/assets/logo.png'),
              require('@/assets/logo.png'), require('@/assets/logo.png'),
              require('@/assets/logo.png'), require('@/assets/logo.png'),
              require('@/assets/logo.png')],
            description: 'Test description'
          },
          {
            value: 2,
            images: [require('@/assets/logo.png'), require('@/assets/logo.png')],
            description: 'Test description'
          },
          {
            value: 3,
            images: [require('@/assets/logo.png'), require('@/assets/logo.png')],
            description: 'Test description'
          },
          {
            value: 4,
            images: [require('@/assets/logo.png'), require('@/assets/logo.png')],
            description: 'Test description'
          },
          {
            value: 5,
            images: [require('@/assets/logo.png'), require('@/assets/logo.png')],
            description: 'Test description'
          }
        ],
        currentValues: [1, 2, 4, 3, 5],
      },
      {
        Evaluation: 'Bạn đã hoàn tất các mục tiêu công việc trong thời gian qua 2?',
        ratings: [
          {
            value: 1,
            images: [require('@/assets/logo.png'), require('@/assets/logo.png')],
            description: 'Test description'
          },
          {
            value: 2,
            images: [require('@/assets/logo.png'), require('@/assets/logo.png')],
            description: 'Test description'
          },
          {
            value: 3,
            images: [require('@/assets/logo.png'), require('@/assets/logo.png')],
            description: 'Test description'
          },
          {
            value: 4,
            images: [require('@/assets/logo.png'), require('@/assets/logo.png')],
            description: 'Test description'
          },
          {
            value: 5,
            images: [require('@/assets/logo.png'), require('@/assets/logo.png'), require('@/assets/logo.png'), require('@/assets/logo.png'), require('@/assets/logo.png'), require('@/assets/logo.png'), require('@/assets/logo.png')]
          }
        ],
        currentValues: [1, 2, 3, 4, 5]
      },
      {
        Evaluation: 'Bạn đã hoàn tất các mục tiêu công việc trong thời gian qua 3?',
        ratings: [
          {
            value: 1,
            images: [require('@/assets/logo.png'), require('@/assets/logo.png')],
            description: 'Test description5'
          },
          {
            value: 2,
            images: [require('@/assets/logo.png'), require('@/assets/logo.png')],
            description: 'Test description4'
          },
          {
            value: 3,
            images: [require('@/assets/logo.png'), require('@/assets/logo.png')],
            description: 'Test description3'
          },
          {
            value: 4,
            images: [require('@/assets/logo.png'), require('@/assets/logo.png')],
            description: 'Test description2'
          },
          {
            value: 5,
            images: [require('@/assets/logo.png'), require('@/assets/logo.png')],
            description: 'Test description6'
          }
        ],
        currentValues: [1, 2, 3, 4, 5],
      }
    ]);


    const closeModal = () => {
      showModal.value = false;
    };

    const getImagesForValue = (ratings, value) => {
      const rating = ratings.find(r => r.value === value);
      return rating ? rating.images : [];
    };

    const hoveredDescription = ref('');
    const showMessage = ref(false);

    // Show description when hovering over an image
    const showDescription = (ratings, value) => {
      const rating = ratings.find(r => r.value === value);
      if (rating) {
        hoveredDescription.value = rating.description;
        showMessage.value = true;
      }
    };

    // Hide description when the mouse leaves
    const hideDescription = () => {
      hoveredDescription.value = '';
      showMessage.value = false;
    };

    return {
      showModal,
      selectedYear,
      years,
      dataItems,
      DataTest,
      closeModal,
      getImagesForValue,
      showDescription,
      hideDescription,
      showMessage,
      hoveredDescription
    };
  },

};
</script>

<style scoped>
.description {
  position: absolute;
  background-color: white;
  padding: 5px;
  border: 1px solid gray;
  top: 40px; /* Adjust this for positioning */
  left: 0;
  z-index: 10;
}
.modal-dialog-scrollable {
  max-height: 90vh;
  max-width: 200vh;
}

.data-display-bar {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  margin-bottom: 20px;
  gap: 15px;
}

.data-item {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-right: 20px;
}

.data-item input[type="checkbox"] {
  width: 20px;
  height: 20px;
}

.data-item span {
  font-size: 16px;
}

.year-dropdown {
  display: flex;
  align-items: center;
  gap: 0px;
}

.year-dropdown label {
  margin-right: 5px;
}

.radio-group-with-image {
  display: flex;
  align-items: flex-start; /* Giúp tất cả các phần tử trong hàng thẳng với nhau */
  gap: 40px;
}

.radio-with-image {
  display: flex;
  align-items: center;
  gap: 4px;
}

.form-check-input {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: 2px solid gray;
  margin-right: 3px;
}

.employee-images {
  display: flex;
  gap: 0;
  margin-left: 10px;
  position: relative;
}

.employee-image {
  position: relative;
  margin-left: -10px;
}

.employee-image img {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  border: 2px solid gray;
  position: relative;
}

.more-images {
  display: inline-block;
  position: relative;
  cursor: pointer;
}

.more-images:hover .tooltip-images {
  display: flex;
  position: absolute;
  top: -50px; /* Vị trí hover của tooltip */
  left: 0;
}

.tooltip-images {
  display: none;
  background: white;
  padding: 5px;
}

.tooltip-images img {
  width: 30px;
  height: 30px;
  margin: -8px;
  border-radius: 50%;
  border: 2px solid gray;
}
</style>
