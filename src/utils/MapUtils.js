import { Style, Fill, Stroke, Circle } from 'ol/style'
import { Image } from 'ol/layer'
import { ImageWMS } from 'ol/source'

// 地图工具函数封装
export const mapUtils = {
  // 创建旅游点样式
  createStyle: (radius, fillColor, strokeColor = '#fff', strokeWidth = 2) => 
    new Style({
      image: new Circle({
        radius,
        fill: new Fill({ color: fillColor }),
        stroke: new Stroke({ color: strokeColor, width: strokeWidth })
      })
    }),
  
  // 获取底图图层
  getBaseLayer: (map) => map?.getLayers().item(0),
  
  // 设置图层可见性
  setLayerVisibility: (layer, visible) => layer && layer.setVisible(visible),
  
  // 隐藏底图和区域图层
  hideBaseLayers: (map, areaLayer) => {
    const baseLayer = mapUtils.getBaseLayer(map)
    mapUtils.setLayerVisibility(baseLayer, false)
    mapUtils.setLayerVisibility(areaLayer, false)
  },
  
  // 创建WMS参数
  createWmsParams: (layerName) => ({
    'SERVICE': 'WMS',
    'FORMAT': 'image/png',
    'SRS': 'EPSG:3857',
    'REQUEST': 'GetMap',
    'LAYERS': `Tiles:${layerName}`
  }),
  
  // 更新WMS图层
  updateWms: (map, layerName, wmsLayer) => {
    if (!map) return null
    
    const wmsParams = mapUtils.createWmsParams(layerName)
    
    if (wmsLayer) {
      wmsLayer.getSource().updateParams(wmsParams)
      wmsLayer.setVisible(true)
      return wmsLayer
    } else {
      const newWmsLayer = new Image({
        source: new ImageWMS({
          url: 'http://localhost:8085/geoserver/Tiles/wms',
          params: wmsParams
        })
      })
      map.addLayer(newWmsLayer)
      return newWmsLayer
    }
  }
}

// 地图视图相关工具
export const mapViewUtils = {
  // 重置地图视图到全图
  resetView: (map) => {
    if (!map) return
    
    map.getView().animate({
      center: [11000000.0, 4200000.0],
      zoom: 4.2,
      duration: 800
    })
  }
}