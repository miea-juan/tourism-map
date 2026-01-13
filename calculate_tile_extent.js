// 计算XYZ瓦片的地理范围

// 将瓦片坐标转换为经纬度
function tileToLonLat(x, y, z) {
  const n = Math.PI - 2 * Math.PI * y / Math.pow(2, z);
  const lon = x / Math.pow(2, z) * 360 - 180;
  const lat = 180 / Math.PI * Math.atan(0.5 * (Math.exp(n) - Math.exp(-n)));
  return [lon, lat];
}

// 将经纬度转换为Web Mercator坐标
function lonLatToMercator(lon, lat) {
  const x = lon * 20037508.34 / 180;
  const y = Math.log(Math.tan((90 + lat) * Math.PI / 360)) * 20037508.34 / Math.PI;
  return [x, y];
}

// 分析瓦片范围
function analyzeTileExtent() {
  // 根据实际瓦片文件结构确定的范围
  const tileExtents = {
    z2: { xMin: 2, xMax: 3, yMin: 1, yMax: 1 },
    z3: { xMin: 5, xMax: 7, yMin: 2, yMax: 3 },
    z4: { xMin: 11, xMax: 14, yMin: 5, yMax: 7 },
    z5: { xMin: 22, xMax: 28, yMin: 10, yMax: 16 },
    z6: { xMin: 44, xMax: 56, yMin: 20, yMax: 29 }
  };

  console.log('瓦片范围分析:');
  console.log('====================================');

  // 使用最高层级(6)来确定整个瓦片集的范围
  const z = 6;
  const { xMin, xMax, yMin, yMax } = tileExtents[`z${z}`];

  // 计算左上角瓦片的地理坐标
  const [leftTopLon, leftTopLat] = tileToLonLat(xMin, yMin, z);
  console.log(`左上角瓦片 (${xMin}, ${yMin}, ${z}):`);
  console.log(`  经纬度: ${leftTopLon.toFixed(6)}, ${leftTopLat.toFixed(6)}`);
  console.log(`  Web Mercator: [${lonLatToMercator(leftTopLon, leftTopLat).map(n => n.toFixed(2)).join(', ')}]`);

  // 计算右下角瓦片的地理坐标
  const [rightBottomLon, rightBottomLat] = tileToLonLat(xMax + 1, yMax + 1, z);
  console.log(`右下角瓦片 (${xMax + 1}, ${yMax + 1}, ${z}):`);
  console.log(`  经纬度: ${rightBottomLon.toFixed(6)}, ${rightBottomLat.toFixed(6)}`);
  console.log(`  Web Mercator: [${lonLatToMercator(rightBottomLon, rightBottomLat).map(n => n.toFixed(2)).join(', ')}]`);

  // 计算整个瓦片集的范围
  const extent = [
    lonLatToMercator(leftTopLon, leftTopLat)[0],
    lonLatToMercator(rightBottomLon, rightBottomLat)[1],
    lonLatToMercator(rightBottomLon, rightBottomLat)[0],
    lonLatToMercator(leftTopLon, leftTopLat)[1]
  ];

  console.log('\n整个瓦片集的范围 (Web Mercator):');
  console.log(`  Extent: [${extent.map(n => n.toFixed(2)).join(', ')}]`);

  // 计算中心点
  const centerLon = (leftTopLon + rightBottomLon) / 2;
  const centerLat = (leftTopLat + rightBottomLat) / 2;
  console.log('\n瓦片集中心点:');
  console.log(`  经纬度: ${centerLon.toFixed(6)}, ${centerLat.toFixed(6)}`);
  console.log(`  Web Mercator: [${lonLatToMercator(centerLon, centerLat).map(n => n.toFixed(2)).join(', ')}]`);

  return {
    extent,
    center: {
      lon: centerLon,
      lat: centerLat,
      mercator: lonLatToMercator(centerLon, centerLat)
    }
  };
}

// 执行分析
const tileInfo = analyzeTileExtent();
console.log('\n====================================');
console.log('分析结果:');
console.log(`推荐的extent设置: [${tileInfo.extent.map(n => n.toFixed(2)).join(', ')}]`);
console.log(`推荐的center设置: [${tileInfo.center.lon.toFixed(6)}, ${tileInfo.center.lat.toFixed(6)}]`);