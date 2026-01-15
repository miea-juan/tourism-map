<template>
  <div v-if="poi" class="poi-info-panel">
    <div class="poi-info-header">
      <h3>{{ poi.name }}</h3>
      <button class="btn-close" @click="$emit('close')">&times;</button>
    </div>
    <div class="poi-info-content">
      <div class="poi-detail">
        <strong>旅行:</strong> {{ poi.travel }}
      </div>
      <div class="poi-detail">
        <strong>日期:</strong> {{ formatDate(poi.plantime) }}
      </div>
      <div class="poi-detail">
        <strong>描述:</strong> {{ poi.describe || '无' }}
      </div>
      <div class="poi-detail">
        <strong>备注:</strong> {{ poi.other || '无' }}
      </div>
    </div>
    <div class="poi-info-actions">
      <button class="btn-sm" @click="$emit('edit')">编辑</button>
      <button class="btn-sm btn-add-expense" @click="$emit('add-expense', poi)">消费</button>
      <button class="btn-sm btn-delete" @click="$emit('delete')">删除</button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'POIInfo',
  props: {
    poi: {
      type: Object,
      default: null
    }
  },
  methods: {
    formatDate(timestamp) {
      if (!timestamp) return '未设置';
      const date = new Date(timestamp);
      return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
    }
  }
}
</script>

<style scoped>
.poi-info-panel {
  position: absolute;
  top: 50%;
  right: 15px;
  transform: translateY(-50%);
  width: 240px;
  background-color: white;
  border: 1px solid #ddd;
  border-radius: 6px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  z-index: 1000;
}

.poi-info-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  background-color: #f8f9fa;
  border-bottom: 1px solid #ddd;
}

.poi-info-header h3 {
  margin: 0;
  font-size: 16px;
  color: #333;
}

.btn-close {
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
  color: #999;
  padding: 0;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.poi-info-content {
  padding: 10px;
}

.poi-detail {
  margin-bottom: 8px;
  color: #666;
}

.poi-info-actions {
  padding: 10px;
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  border-top: 1px solid #ddd;
}

.btn-sm {
  background-color: #409eff;
  color: white;
  border: none;
  padding: 4px 8px;
  border-radius: 3px;
  cursor: pointer;
  font-size: 12px;
}

.btn-sm.btn-add-expense {
  background-color: #67c23a;
}

.btn-sm.btn-delete {
  background-color: #f56c6c;
}
</style>