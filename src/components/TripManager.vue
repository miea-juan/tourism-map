<template>
  <div class="trip-manager-container">
    <div class="trip-header">
      <h2>旅行管理</h2>
      <button class="btn-primary" @click="addTrip">添加旅行</button>
    </div>
    
    <div class="trip-cards">
      <TripCard 
        v-for="trip in trips" 
        :key="trip.id" 
        :trip="trip"
        @edit="editTrip"
        @delete="deleteTrip"
        @select="viewTripDetails"
      />
      
      <div v-if="trips.length === 0" class="empty-state">
        <p>暂无旅行计划</p>
        <button class="btn-primary" @click="addTrip">立即添加</button>
      </div>
    </div>
    
    <!-- 添加/编辑旅行模态框 -->
    <TripModal
      :visible="showAddEditModal"
      :isEditing="isEditing"
      :tripData="currentTrip"
      @close="closeModal"
      @save="saveTrip"
    />
  </div>
</template>

<script>
import TripCard from './TripCard.vue'
import TripModal from './TripModal.vue'

export default {
  name: 'TripManager',
  components: {
    TripCard,
    TripModal
  },
  props: {
    // 接收来自父组件的旅行数据
    trips: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      showAddEditModal: false,
      isEditing: false,
      selTrip: null,
      currentTrip: {
        id: null,
        destination: '',
        startDate: '',
        endDate: '',
        days: null,
        totalBudget: 0,
        poiCount: 0
      }
    }
  },
  methods: {
    addTrip() {
      this.isEditing = false
      this.currentTrip = {
        id: Date.now().toString(),
        destination: '',
        startDate: '',
        endDate: '',
        days: 1,
        totalBudget: 0,
        poiCount: 0
      }
      this.showAddEditModal = true
    },
    editTrip(trip) {
      this.isEditing = true
      this.selTrip = trip
      this.currentTrip = { ...trip }
      this.showAddEditModal = true
    },
    deleteTrip(trip) {
      if (confirm('确定要删除这个旅行吗？删除后无法恢复。')) {
        this.$emit('delete-trip', trip.id)
      }
    },
    viewTripDetails(trip) {
      this.$emit('select-trip', trip)
    },
    saveTrip(tripData) {
      // 表单验证已经在TripModal中处理
      if (this.isEditing) {
        this.$emit('update-trip', tripData)
      } else {
        this.$emit('add-trip', tripData)
      }
      
      this.showAddEditModal = false
    },
    closeModal() {
      this.showAddEditModal = false
    }
  }
}
</script>

<style scoped>
.trip-manager-container {
  padding: 15px;
  width: 100%;
}

.trip-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.trip-header h2 {
  font-size: 16px;
  margin: 0;
}

.trip-cards {
  display: grid;
  grid-template-columns: 1fr;
  gap: 15px;
  padding: 5px;
}

.empty-state {
  grid-column: 1 / -1;
  text-align: center;
  padding: 30px 15px;
  background-color: #f9f9f9;
  border: 2px dashed #ddd;
  border-radius: 6px;
}

.empty-state p {
  margin-bottom: 15px;
  color: #666;
}

/* 按钮样式 */
.btn-primary {
  padding: 6px 12px;
  background-color: #409eff;
  color: white;
  border: none;
  border-radius: 3px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.btn-primary:hover {
  background-color: #66b1ff;
}
</style>