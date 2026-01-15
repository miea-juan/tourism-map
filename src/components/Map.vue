<template>
  <div class="map-container"><!-- 地图工具栏 -->
    <div class="map-toolbar">
      <button class="btn-tool" @click="resetView">返回全图</button>
    </div>
    <div id="map" ref="mapRef"></div>
    
    <!-- 旅游点信息面板组件 -->
    <POIInfo 
      :poi="selPoi" 
      @close="closePoi" 
      @edit="editPoi" 
      @delete="removePoi"
      @add-expense="addExpense"
    />
    
    <!-- 旅游点添加/编辑模态框组件 -->
    <POIModal 
      :visible="modalVisible"
      :isEditing="isEditing"
      :poiData="modalData"
      :trips="trips"
      @close="closeModal"
      @save="savePoi"
    />
    
    <!-- 旅游点列表侧边栏组件 -->
    <POIList ref="poiList"
      :pois="pois"
      :trips="trips"
      :sel-poi="selPoi"
      :sel-trip="selTrip"
      @view="showPoi"
      @add-poi="addPoiModal"
    />
    <!-- 区域数据表格 -->
    <AreaTable @view-area="viewArea" @restore-view="resetView" />
  </div>
</template>

<script>
import { ref, onMounted, watch } from 'vue'
import 'ol/ol.css'
import { Map, View, Feature } from 'ol'
import { Tile as TileLayer, Vector as VectorLayer } from 'ol/layer'
import { Vector as VectorSource } from 'ol/source'
import { Point } from 'ol/geom'
import { Style, Fill, Stroke } from 'ol/style'
import { XYZ } from 'ol/source'
import GeoJSON from 'ol/format/GeoJSON'
import { fromLonLat, toLonLat } from 'ol/proj'
import areaData from '@/assets/area.json'
import { createNewPoi, mapPoiUtils } from '../utils/Poi'
import { mapUtils, mapViewUtils } from '../utils/MapUtils'
import POIInfo from './POIInfo.vue'
import POIModal from './POIModal.vue'
import POIList from './POIList.vue'
import AreaTable from './AreaTable.vue'

export default {
  name: 'MapCmp',
  components: {
    POIInfo,
    POIModal,
    POIList,
    AreaTable
  },
  props: {
    selTrip: {
      type: Object,
      default: null
    },
    pois: {
      type: Array,
      default: () => []
    },
    trips: {
      type: Array,
      default: () => []
    }
  },
  emits: ['add-poi', 'update-poi', 'delete-poi', 'add-expense', 'clear-trip'],
  setup(props, { emit }) {
    // 地图相关引用
    const mapRef = ref(null)
    const poiList = ref(null)
    
    // 状态管理
    const selPoi = ref(null)
    const modalVisible = ref(false)
    const isEditing = ref(false)
    const modalData = ref({})
    
    // 地图实例和图层引用
    let map, poiLayer, poiSource, areaLayer, wmsLayer, layerHideTimer
    
    // 使用地图工具函数创建样式
    
    // 样式定义
    const poiStyle = mapUtils.createStyle(6, '#3399CC')
    const selectedPoiStyle = mapUtils.createStyle(8, '#FF0000')
    
    // GeoJSON 格式对象
    const geojsonFormat = new GeoJSON()
    
    // 图层管理函数使用MapUtils实现
    
    // 初始化地图
    const initMap = (mapRef) => {
      
      // 创建图层
      const tileSource = new XYZ({
        url: '/bankground/{z}/{x}/{y}.png',
        tileSize: 256,
        minZoom: 2,
        maxZoom: 6
      })
      
      areaLayer = new VectorLayer({
        source: new VectorSource(),
        style: new Style({
          fill: new Fill({ color: 'rgba(0, 0, 255, 0.1)' }),
          stroke: new Stroke({ color: '#3399CC', width: 1.5 })
        }),
        visible: false
      })
      
      poiSource = new VectorSource()
      poiLayer = new VectorLayer({
        source: poiSource,
        zIndex: 99,
        style: feature => {
          const poiData = feature.get('poiData')
          return poiData && selPoi.value && poiData.id === selPoi.value.id ? selectedPoiStyle : poiStyle
        }
      })
      
      map = new Map({
        target: mapRef,
        layers: [
          new TileLayer({ source: tileSource }),
          areaLayer,
          poiLayer
        ],
        view: new View({
          projection: 'EPSG:3857',
          center: [11000000.0, 4200000.0],
          zoom: 4,
          minZoom: 4,
          maxZoom: 16
        })
      })
      
      return map
    }
    
    // 添加地图点击事件处理
    const addClickHandler = (onPoiSelect) => {
      if (!map) return
      
      map.on('click', evt => {
        map.forEachFeatureAtPixel(evt.pixel, feature => {
          const poiData = feature.get('poiData')
          if (poiData) {
            onPoiSelect(poiData)
            return true
          }
          return false
        }, {
          layerFilter: layer => layer === poiLayer
        })
      })
    }
    
    // 添加新旅游点
    const addPoi = (onAddPoi) => {
      if (!map) return
      
      mapPoiUtils.selectPoiOnMap(map, toLonLat, (lon, lat) => {
        const travel = props.selTrip ? props.selTrip.destination : ''
        return createNewPoi(lon, lat, travel)
      }).then(newPoi => {
        if (newPoi) onAddPoi(newPoi)
      })
    }
    
    // 查看旅游点
    const viewPoi = (poi) => {
      mapPoiUtils.viewPoiOnMap(map, poi, fromLonLat, updateWms, () => mapUtils.hideBaseLayers(map, areaLayer))
    }
    
    // 更新旅游点标记
    const updateMarkers = (pois) => {
      mapPoiUtils.addPoiMarkers(poiSource, pois, fromLonLat, Point, Feature)
    }
    
    // 更新WMS图层
    const updateWms = (layerName) => {
      if (!map) return
      wmsLayer = mapUtils.updateWms(map, layerName, wmsLayer)
    }
    
    // 删除旅游点
    const deletePoi = (poiId, onDelete) => {
      const success = mapPoiUtils.deletePoiMarker(poiSource, poiId)
      if (success) {
        onDelete?.(poiId)
      }
    }
    
    // 查看区域
    const viewArea = (param) => {
      if (!map || !areaLayer) return
      
      const name = typeof param === 'string' ? param : param.destination
      
      // 获取区域特征
      const allFeatures = geojsonFormat.readFeatures(areaData, {
        dataProjection: 'EPSG:4326',
        featureProjection: 'EPSG:3857'
      })
      const targetFeature = allFeatures.find(feature => feature.get('name') === name)
      
      if (!targetFeature) {
        console.error(`未找到名称为"${name}"的区域要素`)
        return
      }
      
      // 更新地图
      const source = areaLayer.getSource()
      source.clear()
      source.addFeature(targetFeature)
      
      areaLayer.setVisible(true)
      map.getView().fit(targetFeature.getGeometry(), {
        padding: [50, 50, 50, 50],
        duration: 1000
      })
      
      updateWms(name)
      
      // 设置图层隐藏定时器
      clearTimeout(layerHideTimer)
      layerHideTimer = setTimeout(() => mapUtils.hideBaseLayers(map, areaLayer), 3000)
    }
    

    
    // 确认删除旅游点
    const confirmDeletePoi = (poi, onDelete) => {
      if (confirm(`确定要删除旅游点"${poi.name}"吗？`)) {
        deletePoi(poi.id, onDelete)
      }
      mapUtils.hideBaseLayers(map, areaLayer)
    }
    

    
    // 初始化地图
    onMounted(() => {
      if (mapRef.value) {
        initMap(mapRef.value)
        
        // 添加地图点击事件处理
        addClickHandler((poiData) => {
          selPoi.value = poiData
        })
        
        // 更新初始旅游点标记
        updateMarkers(props.pois)
      }
    })
    
    // 监听旅游点变化，更新地图标记
    watch(() => props.pois, (newPois) => {
      updateMarkers(newPois)
    }, { deep: true })
    
    // 监听选中的旅游点变化，更新地图标记样式
    watch(() => selPoi.value, () => {
      poiLayer?.changed()
    }, { deep: true })
    
    // 监听选中的旅行变化，自动打开旅游点列表并过滤旅游点
    watch(() => props.selTrip, (newSelTrip) => {
      if (newSelTrip && poiList.value) {
        poiList.value.close = false
        // 过滤并显示当前旅行下的旅游点
        const filteredPois = mapPoiUtils.filterPoisByTravel(props.pois, newSelTrip.destination)
        updateMarkers(filteredPois)
      } else if (!newSelTrip && poiList.value) {
        poiList.value.close = true
        // 显示所有旅游点
        updateMarkers(props.pois)
      }
    }, { deep: true })
    
    // 添加旅游点处理
    const addPoiModal = () => {
      addPoi((newPoiData) => {
        // 设置默认旅行值
        newPoiData.travel = props.selTrip ? props.selTrip.destination : ''
        modalData.value = newPoiData
        isEditing.value = false
        modalVisible.value = true
      })
    }
    
    // 查看旅游点处理
    const showPoi = (poi) => {
      selPoi.value = poi
      viewPoi(poi)
    }
    
    // 关闭旅游点信息面板
    const closePoi = () => {
      selPoi.value = null
    }
    
    // 打开编辑模态框
    const editPoi = () => {
      if (selPoi.value) {
        const formatDate = new Date(selPoi.value.plantime).toISOString().split('T')[0]
        modalData.value = {
          ...selPoi.value,
          plantime: formatDate
        }
        isEditing.value = true
        modalVisible.value = true
      }
    }
    
    // 隐藏模态框
    const closeModal = () => {
      modalVisible.value = false
      modalData.value = {}
    }
    
    // 处理模态框保存事件
    const savePoi = (poiData) => {
      if (isEditing.value) {
        // 更新旅游点数据
        emit('update-poi', poiData)
        
        // 更新当前选中的旅游点
        selPoi.value = poiData
      } else {
        // 添加新旅游点
        emit('add-poi', poiData)
      }
      
      // 隐藏模态框
      closeModal()
    }
    
    // 删除旅游点
    const removePoi = () => {
      if (selPoi.value) {
        confirmDeletePoi(selPoi.value, (poiId) => {
          emit('delete-poi', poiId)
        })
        // 关闭信息面板
        selPoi.value = null
      }
    }
    

    

    
    // 恢复地图视图
    const resetView = () => {
      if (!map || !areaLayer) return
      
      clearTimeout(layerHideTimer)
      
      // 显示底图，隐藏其他图层
      const baseLayer = mapUtils.getBaseLayer(map)
      mapUtils.setLayerVisibility(baseLayer, true)
      mapUtils.setLayerVisibility(areaLayer, false)
      mapUtils.setLayerVisibility(wmsLayer, false)
      
      // 清空区域图层数据
      areaLayer.getSource().clear()
      
      // 重置视图
      mapViewUtils.resetView(map)
      
      selPoi.value = null
      // 关闭旅游点列表
      if (poiList.value) {
        poiList.value.close = true
      }
      // 触发清空选择旅行事件
      emit('clear-trip')
    }
    
    // 处理添加消费事件
    const addExpense = (poi) => {
      // 将添加消费事件传递给父组件App.vue
      emit('add-expense', poi)
    }
    
    return {
      mapRef,
      poiList,
      selPoi,
      modalVisible,
      isEditing,
      modalData,
      addPoiModal,
      showPoi,
      closePoi,
      editPoi,
      closeModal,
      savePoi,
      removePoi,
      viewArea,
      resetView,
      addExpense
    }
  }
}
</script>

<style scoped>
.map-container {
  width: 100%;
  height: 100%;
  position: relative;
}

#map {
  width: 100%;
  height: 100%;
}

.map-toolbar {
  position: absolute;
  top: 10px;
  right: 10px;
  z-index: 100;
  display: flex;
  gap: 10px;
}

.btn-tool {
  padding: 8px 16px;
  background-color: white;
  border: 1px solid #ddd;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s;
}

.btn-tool:hover {
  background-color: #f5f5f5;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}
</style>