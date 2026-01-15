<template>
  <!-- 旅行添加/编辑模态框 -->
  <div v-if="visible" class="modal-overlay" @click="$emit('close')">
    <div class="modal-content" @click.stop>
      <div class="modal-header">
        <h3>{{ isEditing ? '编辑旅行' : '添加旅行' }}</h3>
        <button class="btn-close" @click="$emit('close')">&times;</button>
      </div>
      <div class="modal-body">
        <div class="form-group">
          <label>旅行目的地</label>
          <div class="select-group">
            <select v-model="selProvince" class="form-select">
              <option value="">请选择省份</option>
              <option v-for="province in provinces" :key="province.gb" :value="province.name">
                {{ province.name }}
              </option>
            </select>
            
            <select v-model="selCity" class="form-select">
              <option value="">请选择城市</option>
              <option v-for="city in filteredCities" :key="city.gb" :value="city.name">
                {{ city.name }}
              </option>
            </select>
            
            <select v-model="selAttraction" class="form-select">
              <option value="">请选择景区</option>
              <option v-for="attraction in filteredAttractions" :key="attraction.gb" :value="attraction.name">
                {{ attraction.name }}
              </option>
            </select>
          </div>
        </div>
        <div class="form-group">
          <label>出发日期</label>
          <input type="date" v-model="localTripData.startDate" @change="calculateDays">
        </div>
        <div class="form-group">
          <label>结束日期</label>
          <input type="date" v-model="localTripData.endDate" @change="calculateDays">
        </div>
        <div class="form-group">
          <label>旅行天数</label>
          <input type="number" v-model="localTripData.days" placeholder="请输入天数" min="1">
        </div>
        <div class="form-group">
          <label>总预算</label>
          <input type="number" v-model="localTripData.totalBudget" placeholder="请输入预算" min="0" step="100">
        </div>
      </div>
      <div class="modal-footer">
        <button class="btn-secondary" @click="$emit('close')">取消</button>
        <button class="btn-primary" @click="handleSave">保存</button>
      </div>
    </div>
  </div>
</template>

<script>
// 导入区域数据
import areaData from '@/assets/area.json'

export default {
  name: 'TripModal',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    isEditing: {
      type: Boolean,
      default: false
    },
    tripData: {
      type: Object,
      default: () => ({
        id: null,
        destination: '',
        startDate: '',
        endDate: '',
        days: null,
        totalBudget: 0,
        poiCount: 0
      })
    }
  },
  emits: ['close', 'save'],
  data() {
    return {
      localTripData: { ...this.tripData },
      // 区域数据
      provinces: [],
      cities: [],
      attractions: [],
      // 选中值
      selProvince: '',
      selCity: '',
      selAttraction: ''
    }
  },
  computed: {
    // 根据gb编码前缀匹配同省城市
    filteredCities() {
      if (!this.selProvince) return []
      const provinceGb = this.provinces.find(p => p.name === this.selProvince)?.gb
      if (!provinceGb) return []
      const provinceGbPrefix = provinceGb.substring(0, 5)
      return this.cities.filter(city => city.gb && city.gb.substring(0, 5) === provinceGbPrefix)
    },
    // 根据gb编码前缀匹配同市景区
    filteredAttractions() {
      if (!this.selCity) return []
      const cityGb = this.cities.find(c => c.name === this.selCity)?.gb
      if (!cityGb) return []
      const cityGbPrefix = cityGb.substring(0, 7)
      return this.attractions.filter(attr => attr.gb && attr.gb.substring(0, 7) === cityGbPrefix)
    }
  },
  watch: {
    tripData: {
      handler(newData) {
        this.localTripData = { ...newData }
        // 初始化选中值
        this.initSelectedValues()
      },
      deep: true
    },
    // 当省变化时，重置市和景区
    selProvince() {
      this.selCity = ''
      this.selAttraction = ''
      this.updDestination()
    },
    // 当市变化时，重置景区
    selCity() {
      this.selAttraction = ''
      this.updDestination()
    },
    // 当景区变化时，更新目的地
    selAttraction() {
      this.updDestination()
    }
  },
  mounted() {
    this.parseAreaData()
  },
  methods: {
    // 解析区域数据
    parseAreaData() {
      const features = areaData.features
      // 提取省、市、景区数据
      this.provinces = features
        .filter(feature => feature.properties.type === 'province')
        .map(feature => ({
          name: feature.properties.name,
          gb: feature.properties.gb
        }))
      
      this.cities = features
        .filter(feature => feature.properties.type === 'city')
        .map(feature => ({
          name: feature.properties.name,
          gb: feature.properties.gb
        }))
      
      this.attractions = features
        .filter(feature => feature.properties.type === 'attractions')
        .map(feature => ({
          name: feature.properties.name,
          gb: feature.properties.gb
        }))
      
      // 初始化选中值
      this.initSelectedValues()
    },
    
    // 初始化选中值
    initSelectedValues() {
      if (this.localTripData.destination) {
        // 尝试根据目的地名称匹配选中值
        const destination = this.localTripData.destination
        
        // 检查是否为景区
        const attraction = this.attractions.find(attr => attr.name === destination)
        if (attraction && attraction.gb) {
          this.selAttraction = attraction.name
          
          // 查找对应的市
          const city = this.cities.find(city => 
            city.gb && city.gb.substring(0, 7) === attraction.gb.substring(0, 7)
          )
          if (city) {
            this.selCity = city.name
            
            // 查找对应的省
            const province = this.provinces.find(province => 
              province.gb && province.gb.substring(0, 5) === city.gb.substring(0, 5)
            )
            if (province) {
              this.selProvince = province.name
            }
          }
        }
      }
    },
    
    // 更新目的地
    updDestination() {
      if (this.selAttraction) {
        this.localTripData.destination = this.selAttraction
      } else if (this.selCity) {
        this.localTripData.destination = this.selCity
      } else if (this.selProvince) {
        this.localTripData.destination = this.selProvince
      } else {
        this.localTripData.destination = ''
      }
    },
    
    calculateDays() {
      // 自动计算旅行天数
      if (this.localTripData.startDate && this.localTripData.endDate) {
        const start = new Date(this.localTripData.startDate)
        const end = new Date(this.localTripData.endDate)
        const diffTime = Math.abs(end - start)
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
        this.localTripData.days = diffDays + 1
      }
    },
    
    handleSave() {
      if (!this.localTripData.destination) {
        alert('请选择旅行目的地')
        return
      }
      
      // 确保天数有效
      if (!this.localTripData.days || this.localTripData.days < 1) {
        this.localTripData.days = 1
      }
      
      // 确保总预算为数字
      if (this.localTripData.totalBudget === undefined || this.localTripData.totalBudget === null) {
        this.localTripData.totalBudget = 0
      }
      
      // 触发保存事件
      this.$emit('save', this.localTripData)
    }
  }
}
</script>

<style scoped>


.form-group input:focus,
.form-group select:focus {
  outline: none;
  border-color: #409eff;
}

.select-group {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.form-select {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 14px;
  background-color: white;
  cursor: pointer;
  transition: border-color 0.3s;
}

.form-select:hover {
  border-color: #409eff;
}
</style>