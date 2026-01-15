<template>
  <div class="budget-container">
    <h2>旅游预算</h2>
    <!-- 旅行选择 -->
    <div class="trip-selector">
      <select v-model="selTripId" @change="onTripChange">
        <option value="">请选择旅行</option>
        <option v-for="trip in trips" :key="trip.id" :value="trip.id">
          {{ trip.destination }} ({{ trip.startDate }} - {{ trip.endDate }})
        </option>
      </select>
      <button class="btn-primary btn-small" @click="addBudgetItem">添加消费</button>
    </div>
    
    <div v-if="selTrip" class="budget-content">
      <!-- 旅行点消费明细 -->
      <BudgetTable 
        :budgetItems="tripCosts" 
        @edit-budget-item="editBudgetItem"
        @delete-budget-item="delBudgetItem"
      />
      <!-- 预算汇总 -->
      <BudgetSum 
        :totalBudget="selTrip.totalBudget" 
        :totalSpent="totalSpent"
        :remBudget="remBudget"
        :budgetUsageRate="budgetUsageRate"
        :totalFoodCost="totalFoodCost"
        :totalAccCost="totalAccCost"
        :totalTranCost="totalTranCost"
        :totalTickCost="totalTickCost"
        :totalShopCost="totalShopCost"
      />
    </div>
    
    <div v-else-if="trips.length > 0" class="no-selection">
      请选择一个旅行查看预算详情
    </div>
    
    <div v-else class="no-trips">
      暂无旅行记录，请先创建旅行
    </div>
    
    <!-- 预算项编辑模态框 -->
    <BudgetModal 
      :visible="showBudgetModal"
      :isEditing="isEditBudget"
      :budgetItem="currBudgetItem"
      :pois="selTrip ? pois.filter(poi => poi.travel === selTrip.destination) : []"
      @close="clsBudgetModal"
      @save="saveBudgetItem"
    />
  </div>
</template>

<script>
import BudgetTable from './BudgetTable.vue'
import BudgetSum from './BudgetSum.vue'
import BudgetModal from './BudgetModal.vue'
import { budgetCalculationUtils } from '../utils/Budget'

export default {
  name: 'BudgetCmp',
  components: {
    BudgetTable,
    BudgetSum,
    BudgetModal
  },
  props: {
    // 接收来自父组件的旅行数据
    trips: {
      type: Array,
      default: () => []
    },
    // 接收来自父组件的旅游点数据
    pois: {
      type: Array,
      default: () => []
    },
    // 接收来自父组件的预算项数据
    budgetItems: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      selTripId: '',
      selTrip: null,
      tripCosts: [],

      totalSpent: 0,
      remBudget: 0,
      budgetUsageRate: 0,
      // 分类汇总
      totalFoodCost: 0,
      totalAccCost: 0,
      totalTransCost: 0,
      totalTickCost: 0,
      totalShopCost: 0,
      // 预算项编辑
      showBudgetModal: false,
      isEditBudget: false,
      currBudgetItem: {
        id: '',
        tripId: '',
        poiId: '',
        poiName: '',
        cost: 0,
        costType: '餐饮'
      }
    }
  },
  watch: {
    trips: {
      handler() {
        if (this.selTripId && this.trips.length > 0) {
          this.onTripChange()
        }
      },
      deep: true
    },
    pois: {
      handler() {
        if (this.selTripId) {
          this.onTripChange()
        }
      },
      deep: true
    },
    budgetItems: {
      handler() {
        if (this.selTripId) {
          this.onTripChange()
        }
      },
      deep: true
    }
  },
  methods: {
    onTripChange() {
      // 切换旅行时更新预算数据
      this.selTrip = this.trips.find(trip => trip.id === this.selTripId)
      if (this.selTrip) {
        this.genBudgetData()
      } else {
        this.rstBudgetData()
      }
    },
    addBudgetItem() {
      if (!this.selTripId) {
        alert('请先选择一个旅行')
        return
      }
      
      this.isEditBudget = false
      this.currBudgetItem = {
        id: Date.now().toString(),
        tripId: this.selTripId,
        poiId: '',
        poiName: '',
        cost: 0,
        costType: '餐饮'
      }
      this.showBudgetModal = true
    },
    editBudgetItem(item) {
      this.isEditBudget = true
      this.currBudgetItem = { ...item }
      this.showBudgetModal = true
    },
    delBudgetItem(id) {
      this.$emit('delete-budget-item', id)
    },
    saveBudgetItem(item) {
      if (this.isEditBudget) {
        this.$emit('update-budget-item', item)
      } else {
        this.$emit('add-budget-item', item)
      }
      
      this.showBudgetModal = false
    },
    clsBudgetModal() {
      this.showBudgetModal = false
    },
    genBudgetData() {
      // 生成旅行点消费明细
      this.tripCosts = this.budgetItems.filter(item => item.tripId === this.selTripId)
      
      // 更新预算汇总信息
      this.updBudgetSum()
    },

    updBudgetSum() {
      // 使用预算计算工具函数简化计算
      const budgetSummary = budgetCalculationUtils.calculateBudgetSummary(this.selTrip, this.tripCosts)
      
      // 更新预算汇总信息
      this.totalSpent = budgetSummary.totalSpent
      this.remBudget = budgetSummary.remBudget
      this.budgetUsageRate = budgetSummary.budgetUsageRate
      
      // 更新分类汇总信息
      this.totalFoodCost = budgetSummary.totalFoodCost
      this.totalAccCost = budgetSummary.totalAccCost
      this.totalTransCost = budgetSummary.totalTransCost
      this.totalTickCost = budgetSummary.totalTickCost
      this.totalShopCost = budgetSummary.totalShopCost
    },
    rstBudgetData() {
      this.tripCosts = []
      this.updBudgetSum()
    },
    
    openAddExpenseModal(poi) {
      // 根据旅游点的travel属性找到对应的旅行
      const trip = this.trips.find(trip => trip.destination === poi.travel)
      
      // 设置当前选择的旅行
      this.selTripId = trip.id
      this.selTrip = trip
      
      // 预填充预算项信息
      this.isEditBudget = false
      this.currBudgetItem = {
        id: Date.now().toString(),
        tripId: trip.id,
        poiName: poi.name, // 预填充为旅游点名称
        cost: 0,
        costType: '餐饮'
      }
      this.showBudgetModal = true
    }
  }
}
</script>

<style scoped>
.budget-container {
  width: 100%;
  padding: 10px;
  box-sizing: border-box;
}

h2 {
  margin-bottom: 10px;
  text-align: center;
}

/* 旅行选择器 */
.trip-selector {
  margin-bottom: 10px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  align-items: stretch;
}

/* 预算内容 */
.budget-content {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

/* 空状态 */
.no-selection,
.no-trips {
  text-align: center;
  padding: 20px;
  color: #666;
  background-color: #f9f9f9;
  border-radius: 4px;
}
</style>