<template>
  <div class="app-container">
    <header class="app-header">
      <h1>旅游规划与预算</h1>
    </header>
    <main class="app-main">
      <div class="left-panel" :class="{ 'left-panel-hidden': !showLeftPanel }">
        <div class="trip-section">
          <TripManager :trips="trips" @add-trip="addTrip" @update-trip="updateTrip" @delete-trip="deleteTrip" @select-trip="selectTrip" />
        </div>
      </div>
      <button class="toggle-panel-btn" @click="toggleLeftPanel">
        {{ showLeftPanel ? '«' : '»' }}
      </button>
      <div class="map-section">
        <div class="map-section-header">
          <h2>旅游地图</h2>
        </div>
        <MapCmp ref="mapCmp" :selTrip="selTrip" :pois="pois" :trips="trips" @delete-poi="handleDeletePoi" @update-poi="handleUpdatePoi" @add-poi="handleAddPoi" @add-expense="handleAddExpense" @clear-trip="clearSelTrip" />
      </div>
      <div class="right-panel" :class="{ 'right-panel-hidden': !showRightPanel }">
        <div class="budget-section">
          <BudgetCmp ref="budgetCmp" :trips="trips" :pois="pois" :budgetItems="budgetItems" @add-budget-item="addBudgetItem" @update-budget-item="updateBudgetItem" @delete-budget-item="deleteBudgetItem" />
        </div>
      </div>
      <button class="toggle-panel-btn toggle-right-btn" @click="toggleRightPanel">
        {{ showRightPanel ? '»' : '«' }}
      </button>
    </main>
  </div>
</template>

<script>
import MapCmp from './components/Map.vue'
import BudgetCmp from './components/Budget.vue'
import TripManager from './components/TripManager.vue'
import { getLsPois, addPoi, updPoi, delPoi } from './utils/Poi'
import { saveLsTrips, getAllTrips, updTrip, delTrip } from './utils/Trip'
import { getLsBudgetItems, saveLsBudgetItems, addBudgetItem as addBudgetItemUtil, updateBudgetItem as updateBudgetItemUtil, deleteBudgetItem as deleteBudgetItemUtil } from './utils/Budget'

export default {
  name: 'App',
  components: {
    MapCmp,
    BudgetCmp,
    TripManager
  },
  data() {
    return {
      // 旅行数据：包含所有旅行信息
      trips: [],
      // 当前选中的旅行
      selTrip: null,
      // 旅游点数据：包含所有旅游点信息
      pois: [],
      // 预算项数据：包含所有消费记录
      budgetItems: [],
      // 控制面板显示状态
      showLeftPanel: true,
      showRightPanel: true
    }
  },
  mounted() {
    this.loadTripData()
    this.loadPoiData()
    this.loadBudgetItems()
  },
  methods: {
    loadTripData() {
      this.trips = getAllTrips()
    },
    
    loadPoiData() {
      this.pois = getLsPois()
    },
    
    // 旅行管理方法
    addTrip(trip) {
      const newTrip = {
        ...trip,
        id: trip.id || Date.now().toString()
      }
      this.trips.push(newTrip)
      saveLsTrips(this.trips)
    },
    async updateTrip(updatedTrip) {
      await updTrip(updatedTrip)
      const index = this.trips.findIndex(trip => trip.id === updatedTrip.id)
      if (index !== -1) {
        this.trips[index] = updatedTrip
      }
    },
    async deleteTrip(tripId) {
      const tripToDelete = this.trips.find(trip => trip.id === tripId)
      
      await delTrip(tripId)
      this.trips = this.trips.filter(trip => trip.id !== tripId)
      
      if (tripToDelete) {
        this.pois = this.pois.filter(poi => poi.travel !== tripToDelete.destination)
      }
      
      this.budgetItems = this.budgetItems.filter(item => item.tripId !== tripId)
      saveLsBudgetItems(this.budgetItems)
      
      if (this.selTrip && this.selTrip.id === tripId) {
        this.selTrip = null
      }
    },
    
    // 选择当前旅行
    selectTrip(trip) {
      // 选择当前旅行
      this.selTrip = trip
      // 同时触发旅行详情查看事件
      if (this.$refs.mapCmp) {
        this.$refs.mapCmp.viewArea(trip)
      }
      // 设置预算组件的选中旅行，实现联动
      if (this.$refs.budgetCmp) {
        this.$refs.budgetCmp.selTripId = trip.id
        this.$refs.budgetCmp.onTripChange()
      }
    },
    
    // 切换左侧面板显示/隐藏
    toggleLeftPanel() {
      this.showLeftPanel = !this.showLeftPanel
    },
    
    // 切换右侧面板显示/隐藏
    toggleRightPanel() {
      this.showRightPanel = !this.showRightPanel
    },
    // 预算管理方法
    addBudgetItem(item) {
      // 添加新预算项
      this.budgetItems = addBudgetItemUtil(item)
    },
    updateBudgetItem(updatedItem) {
      // 更新预算项信息
      this.budgetItems = updateBudgetItemUtil(updatedItem)
    },
    deleteBudgetItem(id) {
      // 删除预算项
      this.budgetItems = deleteBudgetItemUtil(id)
    },
    
    // 删除旅游点
    async handleDeletePoi(id) {
      await delPoi(id)
      this.pois = this.pois.filter(poi => poi.id !== id)
    },
    
    // 更新旅游点
    async handleUpdatePoi(updatedPoi) {
      await updPoi(updatedPoi)
      this.pois = this.pois.map(poi => {
        if (poi.id === updatedPoi.id) {
          return updatedPoi
        }
        return poi
      })
    },
    
    // 添加旅游点
    async handleAddPoi(newPoi) {
      const savedPoi = await addPoi(newPoi)
      this.pois.push(savedPoi)
    },

    loadBudgetItems() {
      this.budgetItems = getLsBudgetItems()
    },
    // 处理添加消费事件
    handleAddExpense(poi) {
      if (this.$refs.budgetCmp) {
        this.$refs.budgetCmp.openAddExpenseModal(poi)
      }
    },
    // 清空当前选择的旅行
    clearSelTrip() {
      this.selTrip = null
      // 更新预算组件的选中旅行
      if (this.$refs.budgetCmp) {
        this.$refs.budgetCmp.selTripId = ''
        this.$refs.budgetCmp.selTrip = null
        this.$refs.budgetCmp.tripCosts = []
        this.$refs.budgetCmp.updBudgetSum()
      }
    }
  }
}
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  user-select: none;
}

body {
  font-family: 'Arial', sans-serif;
  background-color: #f5f5f5;
  font-size: 14px;
}

h1 {
  font-size: 24px;
}

h2 {
  font-size: 18px;
}

h3 {
  font-size: 16px;
}

h4 {
  font-size: 15px;
}

/* 按钮基础样式 */
button {
  font-size: 14px;
}

/* 小型按钮 */
.btn-small, .btn-sm {
  font-size: 12px;
}

.app-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.app-header {
  background-color: #409eff;
  color: white;
  padding: 20px;
  text-align: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.app-header h1 {
  font-size: 24px;
  font-weight: 600;
}

.app-main {
  display: flex;
  flex: 1;
  padding: 20px;
  gap: 20px;
  transition: all 0.3s ease;
}

.left-panel {
  width: 250px;
  height: calc(100vh - 140px);
  transition: all 0.3s ease;
  transform: translateX(0);
  opacity: 1;
  flex-shrink: 0;
}

.left-panel-hidden {
  transform: translateX(-100%);
  opacity: 0;
  width: 0;
  padding: 0;
  margin: 0;
  overflow: hidden;
}

.map-section {
  flex: 1;
  height: calc(100vh - 140px);
  border: 1px solid #ddd;
  border-radius: 8px;
  background-color: white;
  overflow: hidden;
  padding: 15px;
  transition: all 0.3s ease;
}

.map-section h2 {
  margin: 0;
  color: #333;
  font-size: 18px;
}

.toggle-panel-btn {
  background-color: #409eff;
  color: white;
  border: none;
  border-radius: 0 4px 4px 0;
  padding: 10px 6px;
  font-size: 16px;
  cursor: pointer;
  position: fixed;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  z-index: 1000;
  box-shadow: 2px 0 4px rgba(0, 0, 0, 0.1);
}

.toggle-panel-btn:hover {
  background-color: #66b1ff;
}

.right-panel {
  width: 350px;
  height: calc(100vh - 140px);
  transition: all 0.3s ease;
  transform: translateX(0);
  opacity: 1;
  flex-shrink: 0;
}

.right-panel-hidden {
  transform: translateX(100%);
  opacity: 0;
  width: 0;
  padding: 0;
  margin: 0;
  overflow: hidden;
}

.toggle-right-btn {
  left: auto;
  right: 0;
  border-radius: 4px 0 0 4px;
  box-shadow: -2px 0 4px rgba(0, 0, 0, 0.1);
}

.trip-section {
  height: 100%;
  background-color: white;
  border: 1px solid #ddd;
  border-radius: 8px;
  overflow-y: auto;
}

.budget-section {
  height: 100%;
  background-color: white;
  border: 1px solid #ddd;
  border-radius: 8px;
  overflow-y: auto;
}
</style>