<template>
  <div class="area-table-container" :class="{ 'area-table-hidden': !showTable }">
    <table class="area-table">
      <thead>
        <tr>
          <th>
            名称
            <input 
              type="text" 
              v-model="searchQuery" 
              placeholder="搜索名称" 
              class="search-input"
            />
          </th>
          <th>
            <select v-model="selType" class="type-filter">
              <option v-for="option in typeOptions" :key="option.value" :value="option.value">
                {{ option.label }}
              </option>
            </select>
          </th>
          <th>操作</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in filteredAreaData" :key="item.name">
          <td>{{ item.name }}</td>
          <td>{{ item.type === 'province' ? '省份' : item.type === 'city' ? '城市' : '景区' }}</td>
          <td>
            <button class="view-btn" @click="handleViewArea(item.name)">查看</button>
            <button class="restore-btn" @click="handleRestore">还原</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
  <button class="toggle-table-btn" @click="toggleTable">
    {{ showTable ? '▼' : '▲' }}
  </button>
</template>

<script>
import areaData from '@/assets/area.json'

export default {
  name: 'AreaTable',
  emits: ['view-area', 'restore-view'],
  data() {
    return {
      areaTableData: [],
      selType: '',
      searchQuery: '', // 搜索关键词
      showTable: true, // 控制表格显示/隐藏
      typeOptions: [
        { value: '', label: '所有' },
        { value: 'province', label: '省份' },
        { value: 'city', label: '城市' },
        { value: 'attractions', label: '景区' }
      ]
    }
  },
  computed: {
    filteredAreaData() {
      return this.areaTableData.filter(item => {
        // 类型过滤
        const typeMatch = !this.selType || item.type === this.selType
        // 名称搜索
        const searchMatch = !this.searchQuery || item.name.toLowerCase().includes(this.searchQuery.toLowerCase())
        return typeMatch && searchMatch
      })
    }
  },
  mounted() {
    this.processAreaData()
  },
  methods: {
    processAreaData() {
      this.areaTableData = areaData.features.map(feature => ({
        name: feature.properties.name,
        type: feature.properties.type
      }))
    },
    handleViewArea(name) {
      this.$emit('view-area', name)
    },
    handleRestore() {
      this.$emit('restore-view')
    },
    toggleTable() {
      this.showTable = !this.showTable
    }
  }
}
</script>

<style scoped>
.area-table-container {
  position: absolute;
  bottom: 10px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 100;
  background-color: white;
  border-radius: 8px;
  overflow: hidden;
  max-height: 170px;
  overflow-y: auto;
  transition: all 0.3s ease;
  height: auto;
}

.area-table-hidden {
  transform: translateX(-50%) translateY(100%);
  max-height: 0;
}

.area-table {
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed;
}

.area-table thead {
  position: sticky;
  top: 0;
  background-color: #f8f9fa;
  z-index: 10;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.area-table th {
  background-color: #f8f9fa;
  padding: 2px 6px;
  text-align: left;
  border-bottom: 2px solid #e9ecef;
  font-weight: 600;
  color: #495057;
  text-align: center;
}

.area-table th:nth-child(1) {
  width: 35%;
}

.area-table th:nth-child(2) {
  width: 30%;
}

.area-table th:nth-child(3) {
  width: 35%;
}

.search-input {
  width: 45%;
  padding: 4px 5px;
  margin-top: 4px;
  border: 1px solid #ced4da;
  border-radius: 4px;
  box-sizing: border-box;
  background-color: white;
  color: #495057;
}

.search-input:focus {
  outline: none;
  border-color: #409eff;
}

/* 类型筛选器样式 */
.type-filter {
  padding: 3px 5px;
  border: 1px solid #ced4da;
  border-radius: 4px;
  font-size: 14px;
  background-color: white;
  color: #495057;
  min-width: 60px;
  transition: border-color 0.3s ease;
}

.type-filter:focus {
  border-color: #409eff;
  box-shadow: 0 0 0 2px rgba(64, 158, 255, 0.1);
}

.area-table td {
  text-align: center;
  padding: 4px 6px;
  border-bottom: 1px solid #e9ecef;
  color: #6c757d;
}

.area-table tbody tr:hover {
  background-color: #f8f9fa;
}

/* 查看按钮样式 */
.view-btn {
  padding: 4px 6px;
  background-color: #409eff;
  color: white;
  border: none;
  border-radius: 4px;
  margin-right: 8px; /* 添加右边距 */
}

.view-btn:hover {
  background-color: #66b1ff;
}

.view-btn:active {
  background-color: #3a8ee6;
}

/* 还原按钮样式 */
.restore-btn {
  padding: 4px 6px;
  background-color: #67c23a;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.restore-btn:hover {
  background-color: #85ce61;
  box-shadow: 0 2px 6px rgba(103, 194, 58, 0.4);
}

.restore-btn:active {
  background-color: #529b2e;
}

/* 切换按钮样式 */
.toggle-table-btn {
  background-color: #409eff;
  color: white;
  border: none;
  border-radius: 4px 4px 0 0;
  padding:2px 12px;
  cursor: pointer;
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  z-index: 101;
}

.toggle-table-btn:hover {
  background-color: #66b1ff;
}

</style>