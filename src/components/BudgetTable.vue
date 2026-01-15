<template>
  <div class="budget-section">
    <h3>消费明细</h3>
    <div class="section-content">
      <table class="budget-table">
        <thead>
          <tr>
            <th>项目</th>
            <th>金额</th>
            <th>类型</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in budgetItems" :key="item.id">
            <td>{{ item.poiName }}</td>
            <td>¥{{ item.cost }}</td>
            <td>{{ item.costType }}</td>
            <td>
              <button class="btn-edit" @click="handleEdit(item)">
                编辑
              </button>
              <button class="btn-delete" @click="handleDelete(item.id)">
                删除
              </button>
            </td>
          </tr>
        </tbody>
      </table>
      <div v-if="budgetItems.length === 0" class="empty-state">
        暂无旅游点消费记录
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'BudgetTable',
  props: {
    budgetItems: {
      type: Array,
      default: () => []
    }
  },
  methods: {
    handleEdit(item) {
      this.$emit('edit-budget-item', item)
    },
    handleDelete(id) {
      if (confirm('确定要删除这条消费记录吗？')) {
        this.$emit('delete-budget-item', id)
      }
    }
  }
}
</script>

<style scoped>
h3 {
  text-align: center;
  padding: 5px 0;
}
/* 表格样式 - 继承全局样式，仅补充特定样式 */
.budget-table {
  width: 100%;
  border-collapse: collapse;
}

.budget-table th,
.budget-table td {
  padding: 5px;
  text-align: center;
  border-bottom: 1px solid #eee;
}

.budget-table th {
  background-color: #f9f9f9;
  font-weight: 600;
}

/* 按钮样式 - 使用全局按钮样式，仅补充特定样式 */
.btn-edit {
  padding: 4px 8px;
  margin-right: 5px;
  font-size: 12px;
}

.btn-delete {
  padding: 4px 8px;
  font-size: 12px;
}

/* 空状态 */
.empty-state {
  text-align: center;
  padding: 20px;
  color: #666;
  background-color: #f9f9f9;
  border-radius: 4px;
}
</style>