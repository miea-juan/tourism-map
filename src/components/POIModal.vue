<template>
  <!-- 模态框容器 -->
  <div v-if="visible" class="modal-overlay" @click="$emit('close')">
    <div class="modal-content" @click.stop>
      <div class="modal-header">
        <h3>{{ isEditing ? '编辑旅游点' : '添加旅游点' }}</h3>
        <button class="btn-close" @click="$emit('close')">&times;</button>
      </div>
      <div class="modal-body">
        <form @submit.prevent="handleSubmit">
          <div class="form-group">
            <label for="poi-name">旅游点名称:</label>
            <input type="text" id="poi-name" v-model="localPoiData.name" required>
          </div>
          <div class="form-group">
            <label for="poi-travel">所属旅行:</label>
            <select id="poi-travel" v-model="localPoiData.travel" required>
              <option value="">请选择旅行</option>
              <option v-for="trip in trips" :key="trip.id" :value="trip.destination">
                {{ trip.destination }} ({{ trip.startDate }} - {{ trip.endDate }})
              </option>
            </select>
          </div>

          <div class="form-group">
            <label for="poi-plantime">预期时间:</label>
            <input type="date" id="poi-plantime" v-model="localPoiData.plantime" required>
          </div>
          <div class="form-group">
            <label for="poi-describe">描述:</label>
            <textarea id="poi-describe" v-model="localPoiData.describe" rows="3" placeholder="简短描述旅游点"></textarea>
          </div>
          <div class="form-group">
            <label for="poi-other">备注:</label>
            <textarea id="poi-other" v-model="localPoiData.other" rows="2" placeholder="其他信息"></textarea>
          </div>
          <div class="form-actions">
            <button type="button" class="btn-cancel" @click="$emit('close')">取消</button>
            <button type="submit" class="btn-save">保存</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'POIModal',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    isEditing: {
      type: Boolean,
      default: false
    },
    poiData: {
      type: Object,
      default: () => ({
        id: '',
        name: '',
        longitude: 0,
        latitude: 0,
        travel: '',
        plantime: '',
        describe: '',
        other: ''
      })
    },
    trips: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      localPoiData: { ...this.poiData }
    }
  },
  watch: {
    poiData: {
      handler(newData) {
        this.localPoiData = { ...newData }
      },
      deep: true
    }
  },
  methods: {
    handleSubmit() {
      // 转换日期为时间戳
      const timestamp = new Date(this.localPoiData.plantime).getTime();
      const processedData = {
        ...this.localPoiData,
        plantime: timestamp
      };
      
      // 触发保存事件
      this.$emit('save', processedData);
    }
  }
}
</script>

<style scoped>
.modal-header {
  padding: 15px;
  background: #409eff;
  color: white;
  border-radius: 8px 8px 0 0;
}

.modal-header .btn-close {
  color: white;
}

.form-actions {
  padding: 15px;
  border-top: 1px solid #eee;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.btn-cancel, .btn-save {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.btn-cancel { background: #eee; color: #333; }
.btn-save { background: #409eff; color: white; }

.btn-cancel:hover { background: #ddd; }
.btn-save:hover { background: #66b1ff; }
</style>