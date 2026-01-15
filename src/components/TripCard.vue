<template>
  <div class="trip-card">
    <div class="trip-card-header">
      <h3>{{ trip.destination }}</h3>
      <div class="trip-card-actions">
        <button class="btn-edit" @click="$emit('edit', trip)">编辑</button>
        <button class="btn-delete" @click="$emit('delete', trip)">删除</button>
      </div>
    </div>
    <div class="trip-card-content">
      <div class="trip-info">
        <span class="info-item">
          <strong>出发日期:</strong> {{ trip.startDate || '未设置' }}
        </span>
        <span class="info-item">
          <strong>结束日期:</strong> {{ trip.endDate || '未设置' }}
        </span>
        <span class="info-item">
          <strong>旅行天数:</strong> {{ trip.days }}天
        </span>
      </div>
      <div class="trip-stats">
        <span class="stat-item">
          <strong>总预算:</strong> ¥{{ trip.totalBudget || 0 }}
        </span>
      </div>
    </div>
    <div class="trip-card-footer">
      <button class="btn-view" @click="$emit('select', trip)">查看详情</button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TripCard',
  props: {
    trip: {
      type: Object,
      required: true,
      default: () => ({
        id: '',
        destination: '',
        startDate: '',
        endDate: '',
        days: null,
        totalBudget: 0,
        poiCount: 0
      })
    }
  },
  emits: ['edit', 'delete', 'select']
}
</script>

<style scoped>
.trip-card {
  border: 1px solid #ddd;
  border-radius: 6px;
  background-color: white;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s;
}

.trip-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.15);
}

.trip-card-header {
  background-color: #f0f8ff;
  padding: 10px 6px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #ddd;
}

.trip-card-header h3 {
  margin: 0;
  color: #333;
  font-family:  'KaiTi', '楷体', serif;
  font-size: 20px;
  font-weight: 600;
}

.trip-card-actions {
  display: flex;
  gap: 5px;
}

.trip-card-content {
  text-align: center;
  padding: 5px;
  background-color: #fffcfc;
}

.info-item {
  display: block;
  color: #666;
  font-size: 14px;
}

.trip-stats {
  border-top: 1px solid #eee;
  padding-top: 4px;
}

.stat-item {
  text-align: center;
  display: block;
  color: #333;
  font-weight: 500;
  font-size: 14px;
}

.trip-card-footer {
  padding: 5px;
  text-align: center;
  border-top: 1px solid #ddd;
  background-color: #f9f9f9;
}

/* 按钮样式 */
.btn-edit, .btn-delete, .btn-view {
  border: none;
  border-radius: 3px;
  cursor: pointer;
  font-size: 12px;
  transition: background-color 0.3s ease;
}

.btn-edit { background-color: #e6a23c; color: white; padding: 3px 6px; }
.btn-delete { background-color: #f56c6c; color: white; padding: 3px 6px; }
.btn-view { background-color: #67c23a; color: white; padding: 4px 9px; border-radius: 5px; }

.btn-edit:hover { background-color: #ebb563; }
.btn-delete:hover { background-color: #f78989; }
.btn-view:hover { background-color: #85ce61; }
</style>