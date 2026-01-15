<template>
  <div class="sidebar">
    <!-- 侧边栏内容 -->
    <div class="sidebar-content" :class="{ 'sidebar-close': close }">
      <button class="btn-toggle" @click="toggleSidebar">{{ close ? '>' : '<' }}</button>
      <div class="sidebar-body">  
        <!-- 标题 -->
        <h3 class="poi-list-title">旅游点列表</h3>

        <!-- 旅游点表格 -->
        <div class="poi-table">
          <table class="poi-table">
            <thead>
              <tr>
                <th>名称</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="filteredPois.length === 0">
                <td colspan="2" class="empty-state">暂无旅游点数据</td>
              </tr>
              <tr v-else v-for="poi in filteredPois" :key="poi.id">
                <td class="poi-name">{{ poi.name }}</td>
                <td class="poi-actions">
                  <button class="btn-view" @click="$emit('view', poi)">查看</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <!-- 添加旅行点按钮 -->
        <div class="btn-add-container">
          <button class="btn-add" @click="$emit('add-poi')">添加旅行点</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'POIList',
  props: {
    pois: {
      type: Array,
      default: () => []
    },
    selPoi: {
      type: Object,
      default: null
    },
    selTrip: {
      type: Object,
      default: null
    }
  },
  emits: ['view', 'add-poi'],
  data() {
    return {
        close: true
      }
  },
  computed: {
    filteredPois() {
      // 如果有选中的旅行，则只显示该旅行下的旅游点
      if (this.selTrip) {
        return this.pois.filter(poi => poi.travel === this.selTrip.destination)
      }
      // 否则显示所有旅游点
      return this.pois
    }
  },

  methods: {
    toggleSidebar() {
      this.close = !this.close;
    }
  }
}
</script>

<style scoped>

/* 侧边栏容器样式 */
.sidebar {
  position: absolute;
  top: 15%;
  left: 0;
  height: 60%;
  z-index: 100;
  display: flex;
  transition: all 0.3s ease;
}

/* 侧边栏内容样式 */
.sidebar-content {
  width: 200px;
  height: 100%;
  background-color: white;
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  border-radius: 0 8px 8px 0;
  transition: all 0.3s ease;
}

/* 侧边栏折叠状态 */
.sidebar-content.sidebar-close {
  width:20px;
}

/* 侧边栏切换按钮 */
.btn-toggle {
  position: absolute;
  top: 10px;
  right: -5px;
  border: 1px solid #ddd;
  background-color:  #409eff;
  border-radius: 4px;
  width: 18px;
  height: 32px;
  color: white;
  cursor: pointer;
  z-index: 10;
}

.btn-toggle:hover {
  background-color: #66b1ff;;
}

/* 侧边栏内容区域 */
.sidebar-body {
  flex: 1;
  padding: 10px;
  overflow-y: auto;
  transition: opacity 0.3s ease;
}

.sidebar-content.sidebar-close .sidebar-body {
  opacity: 0;
  overflow: hidden;
}

/* 标题样式 */
.poi-list-title {
  font-weight: 700;
  text-align: center;
  padding-bottom: 8px;
}

/* 表格容器样式 */
.poi-table {
  width: 100%;
  overflow-x: auto;
}

/* 表格样式 */
.poi-table {
  width: 100%;
  border-collapse: collapse;
}

.poi-table th,
.poi-table td {
  font-size: 12px;
  padding: 6px 4px;
  text-align: center;
  border-bottom: 1px solid #eee;
}

.poi-table th {
  background-color: #f5f7fa;
  color: #333;
  font-weight: 500;
  white-space: nowrap;
}

.poi-table tr:hover {
  background-color: #fafafa;
}

/* 表格单元格样式 */
.poi-name {
  font-weight: 500;
  color: #333;
}

/* 操作按钮样式 */
.poi-actions {
  display: flex;
  gap: 5px;
  justify-content: center;
}

.btn-view {
  padding: 3px 6px;
  border: none;
  border-radius: 3px;
  cursor: pointer;
  font-size: 11px;
  background-color: #e6f7ff;
  color: #1890ff;
}

.btn-view:hover {
  background-color: #bae7ff;
}

/* 空状态样式 */
.empty-state {
  text-align: center;
  padding: 40px 0;
  color: #999;
}


/* 添加按钮容器 */
.btn-add-container {
  padding-top: 15px;
  border-top: 1px solid #eee;
  text-align: center;
}

/* 添加按钮样式 */
.btn-add {
  padding: 6px 12px;
  background-color: #1890ff;
  color: white;
  border: none;
  border-radius: 6px;
}

.btn-add:hover {
  background-color: #40a9ff;
}
</style>