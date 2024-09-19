<template>
    <div style="border-bottom: solid gray;">
        <h2 style="text-align: center">Quản lý ngày đánh giá</h2>
    </div>
    <div class="mt-4 mb-2">
        <button type="button" class="btn btn-primary" @click="isVisible=true">Sắp xếp thời gian đánh giá</button>
    </div>
    <div v-if="isVisible" class="modal-backdrop">
        <div class="p-3 flex-container">
            <div class="modal-header" style="border-bottom: solid 0.1em grey;">
                <h5 class="modal-title">Sắp xếp ngày đánh giá</h5>
                <button type="button" class="btn-close ms-auto" @click="isVisible=false" aria-label="Close"></button>
            </div>
            <div class="modal-body mb-2" style=" border-bottom: solid 0.05em gray;">
                <i>Vui lòng chọn bộ phận trước khi sắp xếp lịch đánh giá!</i>
                <select class="form-select mt-2" aria-label="Default select example" @change="handleSelectChange">
                    <option value="" selected>Chọn bộ phận</option>
                    <option v-for="(item, index) in DataTest" :key="index" :value="item.department">
                        {{ item.department }}
                    </option>
                </select>
                <div>
                    <form class="form-date" @submit.prevent="submitForm" ref="evaluationForm">
                        <div class="row">
                            <div class="col-md-6 mb-2">
                                <label for="startDate">Từ ngày:</label>
                                <input type="date" class="form-control" id="startDate" v-model="formData.startDate" :disabled="!selectedDepartment || formDisabled" :class="{ 'is-invalid': showError && !formData.startDate }">
                                <span v-if="showError && !formData.startDate" class="text-danger">Vui lòng chọn ngày bắt đầu!</span>
                            </div>
                            <div class="col-md-6 mb-2">
                                <label for="endDate">Đến ngày:</label>
                                <input type="date" class="form-control" id="endDate" v-model="formData.endDate" :disabled="!selectedDepartment || formDisabled" :class="{ 'is-invalid': showError && !formData.endDate }">
                                <span v-if="showError && !formData.endDate" class="text-danger">Vui lòng chọn ngày kết thúc!</span>
                                <span v-if="showError2 && formData.endDate <= formData.startDate" class="text-danger">Ngày kết thúc phải sau ngày bắt đầu!</span>
                            </div>
                        </div>
                        <div class="mb-2">
                            <label for="resultDate">Ngày thông báo kết quả:</label>
                            <input type="date" class="form-control" id="resultDate" v-model="formData.resultDate" :disabled="formDisabled" :class="{ 'is-invalid': showError && !formData.resultDate }">
                            <span v-if="showError && !formData.resultDate" class="text-danger">Vui lòng chọn ngày thông báo kết quả!</span>
                            <span v-if="showError2 && formData.resultDate <= formData.endDate" class="text-danger">Ngày thông báo kết quả phải sau ngày kết thúc!</span>
                        </div>
                    </form>
                </div>
            </div>
            <div class="modal-footer">
                <button type="submit" class="btn btn-primary me-2" @click="submitForm" v-if="!formSubmitted && !hiddenButton" :disabled="!selectedDepartment">Xác nhận</button>
                <button type="button" class="btn btn-secondary" @click="resetFormData">Hủy</button>
            </div>
        </div>
    </div>
    <div>
        <div class="calendar-container">
            <div class="calendar-header">
                <button @click="prevMonth">&lt;</button>
                <h2>{{ currentMonth }} {{ currentYear }}</h2>
                <button @click="nextMonth">&gt;</button>
            </div>
            <table class="calendar-table">
                <thead>
                    <tr>
                        <th>Sun</th>
                        <th>Mon</th>
                        <th>Tue</th>
                        <th>Wed</th>
                        <th>Thu</th>
                        <th>Fri</th>
                        <th>Sat</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="week in calendar" :key="week[0].date">
                        <td v-for="day in week" :key="day.date" :class="{'today': day.isToday, 'event': day.hasEvent, 'in-range': day.inRange, 'start-date': day.isStartDate, 'end-date': day.isEndDate}">
                            {{ day.date.getDate() }}
                            <div v-if="day.hasEvent" class="event-indicator"></div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            events: [],
            currentDate: new Date(),
            currentMonth: '',
            currentYear: new Date().getFullYear(),
            calendar: [],
            isVisible: false,
            DataTest: [
                { ID: '1', department: 'abc', state: 'Chưa sắp xếp thời gian đánh giá' },
                { ID: '2', department: 'xyz', state: 'Chưa sắp xếp thời gian đánh giá' }
            ],
            selectedDepartment: '',
            formData: {
                startDate: '',
                endDate: '',
                resultDate: '',
            },
            savedFormData: {},
            formSubmitted: false,
            formDisabled: false,
            formDisabledStatus: {},
            confirmationTimes: {},
            showError: false,
            showError2: false,
            hiddenButton: false,
        };
    },
    created() {
        this.setCurrentMonth();
        this.generateCalendar();
    },
    methods: {
        setCurrentMonth() {
            this.currentMonth = this.currentDate.toLocaleString('default', { month: 'long' });
            this.currentYear = this.currentDate.getFullYear();
        },
        prevMonth() {
            this.currentDate.setMonth(this.currentDate.getMonth() - 1);
            this.setCurrentMonth();
            this.generateCalendar();
        },
        nextMonth() {
            this.currentDate.setMonth(this.currentDate.getMonth() + 1);
            this.setCurrentMonth();
            this.generateCalendar();
        },
        generateCalendar() {
            const startOfMonth = new Date(this.currentYear, this.currentDate.getMonth(), 1);
            const endOfMonth = new Date(this.currentYear, this.currentDate.getMonth() + 1, 0);
            const startDate = startOfMonth.getDay();
            const daysInMonth = endOfMonth.getDate();

            let calendar = [];
            let week = [];

            for (let i = 0; i < startDate; i++) {
                week.push({ date: new Date(this.currentYear, this.currentDate.getMonth(), i - startDate + 1), isToday: false, hasEvent: false, inRange: false, isStartDate: false, isEndDate: false });
            }

            for (let day = 1; day <= daysInMonth; day++) {
                const date = new Date(this.currentYear, this.currentDate.getMonth(), day);
                const isToday = date.toDateString() === new Date().toDateString();
                const hasEvent = this.events.some(event => new Date(event.date).toDateString() === date.toDateString());
                const inRange = date >= new Date(this.formData.startDate) && date <= new Date(this.formData.endDate);
                const isStartDate = date.toDateString() === new Date(this.formData.startDate).toDateString();
                const isEndDate = date.toDateString() === new Date(this.formData.endDate).toDateString();

                week.push({ date, isToday, hasEvent, inRange, isStartDate, isEndDate });

                if (week.length === 7) {
                    calendar.push(week);
                    week = [];
                }
            }
            if (week.length > 0) {
                for (let i = week.length; i < 7; i++) {
                    week.push({ date: new Date(this.currentYear, this.currentDate.getMonth() + 1, i - week.length + 1), isToday: false, hasEvent: false, inRange: false, isStartDate: false, isEndDate: false });
                }
                calendar.push(week);
            }

            this.calendar = calendar;
        },
        handleSelectChange(event) {
            this.selectedDepartment = event.target.value;
            this.resetFormData();
            if (this.savedFormData[this.selectedDepartment]) {
                this.formData = { ...this.savedFormData[this.selectedDepartment] };
            }
        },
        resetFormData() {
            this.formData = {
                startDate: '',
                endDate: '',
                resultDate: '',
            };
            this.formSubmitted = false;
            this.formDisabled = false;
            this.hiddenButton = false;
            this.showError = false;
        },
        validateDates() {
            const { startDate, endDate, resultDate } = this.formData;
            if (!startDate || !endDate || !resultDate) {
                this.showError = true;
                return false;
            }
            if (new Date(resultDate) <= new Date(endDate) || new Date(endDate) <= new Date(startDate)) {
                this.showError2 = true;
                return false;
            }
            this.showError = false;
            this.showError2 = false;
            return true;
        },
        submitForm() {
            const validate = this.validateDates();
            if (validate) {
                this.generateEvents();
                this.generateCalendar();
                this.accept();
            }
        },
        generateEvents() {
            const eventsToAdd = [
                { date: this.formData.startDate, title: 'Start Date' },
                { date: this.formData.endDate, title: 'End Date' },
                { date: this.formData.resultDate, title: 'Result Date' },
            ];

            // Thêm từng sự kiện vào mảng this.events
            eventsToAdd.forEach(event => {
                this.events.push(event); // Thêm mỗi sự kiện vào this.events
            });
        },
        accept() {
            this.formSubmitted = true;
            this.formDisabled = true;
            this.hiddenButton = true;
            this.confirmationTimes[this.selectedDepartment] = new Date().toLocaleString();
            this.formDisabledStatus[this.selectedDepartment] = true;
            this.savedFormData[this.selectedDepartment] = { ...this.formData };
            const departmentIndex = this.DataTest.findIndex(item => item.department === this.selectedDepartment);
            if (departmentIndex !== -1) {
                this.DataTest[departmentIndex].state = 'Đã sắp xếp thời gian đánh giá';
            }
            this.isVisible = false;
        },
    }
};
</script>



<style scoped>
.close-button {
    position: absolute;
    top: 10px; /* Điều chỉnh khoảng cách từ trên xuống */
    right: 10px; /* Điều chỉnh khoảng cách từ phải sang */
    z-index: 1051; /* Đảm bảo nút nằm trên các phần tử khác */
}

.flex-container {
    width: 50%;
    height: fit-content;
    color: white;
    margin-top: 10px;
    background-color: rgb(85, 75, 204);
    border: solid grey 0.1em;
    border-radius: 10px;
    display: block;
    justify-content: space-between;
}
.modal-backdrop {
    display: flex;
    justify-content: center;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
}
.text-danger {
    color: red;
}
.is-invalid {
    border-color: red;
}
.calendar-container {
  max-width: 900px;
  margin: 0 auto;
  padding: 20px;
  background-color: #fff;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  border-radius: 10px;
}

.calendar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.calendar-header h2 {
  margin: 0;
}

.calendar-header button {
  background-color: transparent;
  border: none;
  font-size: 1.5em;
  cursor: pointer;
}

.calendar-table {
  width: 100%;
  border-collapse: collapse;
}

.calendar-table th, .calendar-table td {
  width: 14.28%;
  padding: 10px;
  text-align: center;
  border: 1px solid #ddd;
}

.today {
  background-color: #f0f8ff;
}

.event {
  background-color: #f9cd8b;
}

.in-range {
  background-color: #d3f9d8;
}

.start-date {
  background-color: #83dfcd;
}

.end-date {
  background-color: #83dfcd;
}

.event-indicator {
  width: 5px;
  height: 5px;
  background-color: red;
  border-radius: 50%;
  display: inline-block;
  margin-top: 5px;
}
</style>
