<template>
  <div class="budget-section">
    <h3>预算汇总</h3>
    <div class="section-content">
      <div class="sum-grid">
        <div class="sum-item">
          <span class="sum-label">总预算:</span>
          <span class="sum-value">¥{{ totalBudget || 0 }}</span>
        </div>
        <div class="sum-item">
          <span class="sum-label">已消费:</span>
          <span class="sum-value">¥{{ totalSpent || 0 }}</span>
        </div>
        <div class="sum-item">
          <span class="sum-label">剩余预算:</span>
          <span class="sum-value">¥{{ remBudget || 0 }}</span>
        </div>
        <div class="sum-item">
          <span class="sum-label">预算使用率:</span>
          <span class="sum-value">{{ budgetUsageRate || 0 }}%</span>
        </div>
      </div>
      
      <div class="categ-sum">
        <h4>消费分类汇总</h4>
        <div class="categ-item">
          <span class="categ-name">餐饮</span>
          <span class="categ-total">¥{{ totalFoodCost || 0 }}</span>
        </div>
        <div class="categ-item">
          <span class="categ-name">住宿</span>
          <span class="categ-total">¥{{ totalAccCost || 0 }}</span>
        </div>
        <div class="categ-item">
          <span class="categ-name">交通</span>
          <span class="categ-total">¥{{ totalTranCost || 0 }}</span>
        </div>
        <div class="categ-item">
          <span class="categ-name">门票</span>
          <span class="categ-total">¥{{ totalTickCost || 0 }}</span>
        </div>
        <div class="categ-item">
          <span class="categ-name">购物</span>
          <span class="categ-total">¥{{ totalShopCost || 0 }}</span>
        </div>
        <div class="categ-item total">
          <span class="categ-name">总消费</span>
          <span class="categ-total">¥{{ totalSpent || 0 }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'BudgetSum',
  props: {
    totalBudget: {
      type: Number,
      default: 0
    },
    totalSpent: {
      type: Number,
      default: 0
    },
    remBudget: {
      type: Number,
      default: 0
    },
    budgetUsageRate: {
      type: Number,
      default: 0
    },
    totalFoodCost: {
      type: Number,
      default: 0
    },
    totalAccCost: {
      type: Number,
      default: 0
    },
    totalTranCost: {
      type: Number,
      default: 0
    },
    totalTickCost: {
      type: Number,
      default: 0
    },
    totalShopCost: {
      type: Number,
      default: 0
    }
  }
}
</script>

<style scoped>
  h3,h4  {
    text-align: center;
  }
/* 预算汇总 */
.sum-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
  margin-bottom: 15px;
}

.sum-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 10px;
  background-color: #f9f9f9;
  border-radius: 4px;
}

.sum-label {
  font-size: 12px;
  color: #666;
  margin-bottom: 3px;
}

.sum-value {
  font-size: 16px;
  font-weight: bold;
}

/* 分类汇总 */
.categ-sum {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.categ-item {
  display: flex;
  align-items: center;
  padding: 6px;
  border-radius: 4px;
}

.categ-item.total {
  margin-top: 5px;
  padding-top: 8px;
  border-top: 2px solid #409eff;
  font-weight: bold;
  background-color: #f0f8ff;
}

.categ-name {
  flex: 1;
  font-size: 13px;
}

.categ-total {
  font-weight: 500;
}
</style>