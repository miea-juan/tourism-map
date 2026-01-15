import poiData from '../assets/旅游点示例.json'

// POI服务方法封装

// 解析POI数据
export const parsePoiData = (data) => {
  return data.features.map(feature => {
    return {
      id: feature.attributes.id,
      name: feature.attributes.name,
      travel: feature.attributes.travel,
      describe: feature.attributes.describe,
      other: feature.attributes.other,
      plantime: feature.attributes.plantime,
      longitude: feature.geometry.x,
      latitude: feature.geometry.y
    }
  })
}

// 初始化本地存储的POI数据
export const initLsPois = () => {
  if (!localStorage.getItem('tourism_pois')) {
    const initialPois = parsePoiData(poiData)
    localStorage.setItem('tourism_pois', JSON.stringify(initialPois))
  }
}

// 获取本地存储的POI数据
export const getLsPois = () => {
  initLsPois()
  return JSON.parse(localStorage.getItem('tourism_pois') || '[]')
}

// 保存POI数据到本地存储
export const saveLsPois = (pois) => {
  localStorage.setItem('tourism_pois', JSON.stringify(pois))
}

// 添加POI
export const addPoi = (poi) => {
  return new Promise((resolve) => {
    const pois = getLsPois()
    const newPoi = {
      ...poi,
      id: Date.now().toString()
    }
    pois.push(newPoi)
    saveLsPois(pois)
    resolve(newPoi)
  })
}

// 更新POI
export const updPoi = (updatedPoi) => {
  return new Promise((resolve) => {
    const pois = getLsPois()
    const index = pois.findIndex(poi => poi.id === updatedPoi.id)
    if (index !== -1) {
      pois[index] = updatedPoi
      saveLsPois(pois)
    }
    resolve(updatedPoi)
  })
}

// 删除POI
export const delPoi = (id) => {
  return new Promise((resolve) => {
    const pois = getLsPois()
    const filteredPois = pois.filter(poi => poi.id !== id)
    saveLsPois(filteredPois)
    resolve(true)
  })
}

// 获取特定旅行下的POI
export const getPoisByTravel = (travelName) => {
  const pois = getLsPois()
  return pois.filter(poi => poi.travel === travelName)
}

// 根据ID获取POI
export const getPoiById = (id) => {
  const pois = getLsPois()
  return pois.find(poi => poi.id === id)
}

// 创建新旅游点对象
export const createNewPoi = (longitude, latitude, travel = '') => ({
  id: Date.now().toString(),
  name: '',
  longitude,
  latitude,
  travel,
  plantime: new Date().toISOString().split('T')[0],
  describe: '',
  other: ''
})

// 地图相关POI操作（需要地图实例和必要参数）
export const mapPoiUtils = {
  // 在地图上添加旅游点标记
  addPoiMarkers: (poiSource, pois, fromLonLat, Point, Feature) => {
    if (!poiSource) return
    
    poiSource.clear()
    poiSource.addFeatures(pois.map(poi => {
      const geometry = new Point(fromLonLat([poi.longitude, poi.latitude]))
      return new Feature({
        geometry,
        id: poi.id,
        poiData: poi
      })
    }))
  },
  
  // 在地图上选择位置添加新旅游点
  selectPoiOnMap: (map, toLonLat, createNewPoiFunc) => {
    return new Promise((resolve) => {
      if (!map) resolve(null)
      
      alert('请在地图上点击选择旅游点位置')
      
      map.once('click', evt => {
        const [longitude, latitude] = toLonLat(evt.coordinate)
        resolve(createNewPoiFunc(longitude, latitude))
      })
    })
  },
  
  // 在地图上查看旅游点
  viewPoiOnMap: (map, poi, fromLonLat, updateWms, hideBaseLayers) => {
    if (!map || !poi) return
    
    const poiCoords = fromLonLat([poi.longitude, poi.latitude])
    map.getView().animate({
      center: poiCoords,
      zoom: 14,
      duration: 500
    })
    
    updateWms(poi.travel)
    hideBaseLayers()
  },
  
  // 在地图上删除旅游点标记
  deletePoiMarker: (poiSource, poiId) => {
    if (!poiSource) return
    
    const feature = poiSource.getFeatures().find(f => f.get('poiData')?.id === poiId)
    if (feature) {
      poiSource.removeFeature(feature)
      return true
    }
    return false
  },
  
  // 过滤旅行下的旅游点
  filterPoisByTravel: (pois, travelDestination) => {
    return pois.filter(poi => poi.travel === travelDestination)
  }
}