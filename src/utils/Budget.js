// 预算服务方法封装

// 获取本地存储的预算数据
export const getLsBudgetItems = () => {
  try {
    const items = localStorage.getItem('tourism_budget_items')
    return items ? JSON.parse(items) : []
  } catch (error) {
    console.error('读取预算数据失败:', error)
    return []
  }
}

// 保存预算数据到本地存储
export const saveLsBudgetItems = (items) => {
  try {
    localStorage.setItem('tourism_budget_items', JSON.stringify(items))
  } catch (error) {
    console.error('保存预算数据失败:', error)
  }
}

// 添加预算项目
export const addBudgetItem = (item) => {
  const items = getLsBudgetItems()
  items.push(item)
  saveLsBudgetItems(items)
  return items
}

// 更新预算项目
export const updateBudgetItem = (updatedItem) => {
  const items = getLsBudgetItems()
  const index = items.findIndex(item => item.id === updatedItem.id)
  if (index !== -1) {
    items[index] = updatedItem
    saveLsBudgetItems(items)
  }
  return items
}

// 删除预算项目
export const deleteBudgetItem = (id) => {
  const items = getLsBudgetItems()
  const filteredItems = items.filter(item => item.id !== id)
  saveLsBudgetItems(filteredItems)
  return filteredItems
}

// 根据旅行ID获取预算项目
export const getBudgetItemsByTrip = (tripId) => {
  const items = getLsBudgetItems()
  return items.filter(item => item.tripId === tripId)
}

// 创建新预算项目
export const createNewBudgetItem = (itemData) => {
  return {
    ...itemData,
    id: itemData.id || Date.now().toString()
  }
}

// 预算计算工具
export const budgetCalculationUtils = {
  // 计算总消费
  calculateTotalSpent: (budgetItems) => {
    return budgetItems.reduce((sum, item) => sum + item.cost, 0)
  },
  
  // 计算剩余预算
  calculateRemainingBudget: (totalBudget, totalSpent) => {
    return totalBudget - totalSpent
  },
  
  // 计算预算使用率
  calculateBudgetUsageRate: (totalBudget, totalSpent) => {
    if (totalBudget <= 0) return 0
    return Math.round((totalSpent / totalBudget) * 100)
  },
  
  // 计算特定类别的消费总和
  calculateCategoryTotal: (budgetItems, category) => {
    return budgetItems
      .filter(item => item.costType === category)
      .reduce((sum, item) => sum + item.cost, 0)
  },
  
  // 计算所有类别的消费总和
  calculateAllCategories: (budgetItems) => {
    return {
      totalFoodCost: budgetCalculationUtils.calculateCategoryTotal(budgetItems, '餐饮'),
      totalAccCost: budgetCalculationUtils.calculateCategoryTotal(budgetItems, '住宿'),
      totalTransCost: budgetCalculationUtils.calculateCategoryTotal(budgetItems, '交通'),
      totalTickCost: budgetCalculationUtils.calculateCategoryTotal(budgetItems, '门票'),
      totalShopCost: budgetCalculationUtils.calculateCategoryTotal(budgetItems, '购物')
    }
  },
  
  // 计算完整的预算汇总信息
  calculateBudgetSummary: (trip, budgetItems) => {
    const totalSpent = budgetCalculationUtils.calculateTotalSpent(budgetItems)
    const totalBudget = trip?.totalBudget || 0
    const remainingBudget = budgetCalculationUtils.calculateRemainingBudget(totalBudget, totalSpent)
    const usageRate = budgetCalculationUtils.calculateBudgetUsageRate(totalBudget, totalSpent)
    const categoryTotals = budgetCalculationUtils.calculateAllCategories(budgetItems)
    
    return {
      totalSpent,
      totalBudget,
      remBudget: remainingBudget,
      budgetUsageRate: usageRate,
      ...categoryTotals
    }
  }
}
