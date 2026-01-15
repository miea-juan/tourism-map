// 旅行服务方法封装

// 获取本地存储的旅行数据
export const getLsTrips = () => {
  try {
    const trips = localStorage.getItem('tourism_trips')
    return trips ? JSON.parse(trips) : []
  } catch (error) {
    console.error('读取旅行数据失败:', error)
    return []
  }
}

// 保存旅行数据到本地存储
export const saveLsTrips = (trips) => {
  try {
    localStorage.setItem('tourism_trips', JSON.stringify(trips))
  } catch (error) {
    console.error('保存旅行数据失败:', error)
  }
}

// 获取所有旅行
export const getAllTrips = () => {
  return getLsTrips()
}

// 更新旅行
export const updTrip = (updatedTrip) => {
  return new Promise((resolve) => {
    const trips = getLsTrips()
    const index = trips.findIndex(trip => trip.id === updatedTrip.id)
    if (index !== -1) {
      trips[index] = updatedTrip
      saveLsTrips(trips)
    }
    resolve(updatedTrip)
  })
}

// 删除旅行
export const delTrip = (id) => {
  return new Promise((resolve) => {
    const trips = getLsTrips()
    const filteredTrips = trips.filter(trip => trip.id !== id)
    saveLsTrips(filteredTrips)
    resolve(true)
  })
}

// 根据ID获取旅行
export const getTripById = (id) => {
  const trips = getLsTrips()
  return trips.find(trip => trip.id === id)
}
