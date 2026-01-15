<template>
  <div v-if="visible" class="modal-overlay">
    <div class="modal-content">
      <div class="modal-header">
        <h3>{{ isEditing ? '编辑消费记录' : '添加消费记录' }}</h3>
        <button class="btn-close" @click="handleClose">&times;</button>
      </div>
      <div class="modal-body">
        <div class="form-group">
          <label>消费记录</label>
          <div class="select-input-group">
            <select v-model="selPoi" @change="handlePoiSelect" class="form-control">
              <option value="">-- 选择旅游点或输入 --</option>
              <option v-for="poi in pois" :key="poi.id" :value="poi.name">{{ poi.name }}</option>
              <option value="custom">输入消费项</option>
            </select>
          </div>
          <div class="form-control" v-if="!selPoi || selPoi === 'custom'">
            <input type="text" v-model="localBudgetItem.poiName" placeholder="请输入旅游点名称">
          </div>
        </div>
        <div class="form-group">
          <label>消费金额</label>
          <input type="number" v-model.number="localBudgetItem.cost" placeholder="请输入消费金额" min="0.01" step="0.01">
        </div>
        <div class="form-group">
          <label>消费类型</label>
          <select v-model="localBudgetItem.costType">
            <option value="餐饮">餐饮</option>
            <option value="住宿">住宿</option>
            <option value="交通">交通</option>
            <option value="门票">门票</option>
            <option value="购物">购物</option>
          </select>
        </div>
      </div>
      <div class="modal-footer">
        <button class="btn-secondary" @click="handleClose">取消</button>
        <button class="btn-primary" @click="handleSave">保存</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'BudgetModal',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    isEditing: {
      type: Boolean,
      default: false
    },
    budgetItem: {
      type: Object,
      default: () => ({
        id: '',
        tripId: '',
        poiId: '',
        poiName: '',
        cost: 0,
        costType: '餐饮'
      })
    },
    pois: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      localBudgetItem: { ...this.budgetItem },
      selPoi: ''
    }
  },
  watch: {
    budgetItem: {
      handler(newData) {
        this.localBudgetItem = { ...newData }
        // 检查是否有匹配的旅游点
        const matchingPoi = this.pois.find(poi => poi.name === newData.poiName)
        this.selPoi = matchingPoi ? newData.poiName : 'custom'
      },
      deep: true
    }
  },
  methods: {
    handleClose() {
      this.$emit('close')
    },
    handlePoiSelect() {
      if (this.selPoi === 'custom' || !this.selPoi) {
        this.localBudgetItem.poiName = ''
      } else {
        this.localBudgetItem.poiName = this.selPoi
      }
    },
    handleSave() {
      if (!this.localBudgetItem.poiName) {
        alert('请输入旅游点名称')
        return
      }
      
      if (this.localBudgetItem.cost <= 0) {
        alert('请输入有效的消费金额')
        return
      }
      
      this.$emit('save', this.localBudgetItem)
    }
  }
}
</script>

<style scoped>
/* BudgetModal特有样式 */
.modal-content {
  width: 400px;
}
</style>