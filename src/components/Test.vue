<template>
  <div>
    <el-cascader
        style="width: 500px"
        :props="props"
        :options="dataList"
        v-model="data"
        @change="handleChange"
        placeholder="请选择地区"
    >
    </el-cascader>
  </div>
</template>

<script setup lang="ts">
import {onMounted, ref} from 'vue'
import {getCitiesByProvince, getCountiesByCity, getProvinces, getTownByCounty, getVillageByTown} from "@/api"
import {CascaderProps} from "element-plus"

const cityList = ref([])
const countyList = ref([])
const townList = ref([])
const village = ref([])
const dataList = ref([
  {
    provinceCode: "",
    name: "",
    cityCode: "",
    areaCode: '',
    streetCode: ''

  },
])
const props: CascaderProps = {
  value: "areaCode",
  label: "name",
  lazy: true,
  lazyLoad: (node: any, resolve: any) => {
    getChildData(node.data, resolve, node.level)
  },
}
const provinceCode = ref("")
const cityCode = ref("")
const data = ref('')
const areaCode = ref('')
onMounted(() => {
  getProvince()
})

function getChildData(data, resolve, level) {
  switch (level) {
    case 1:
      provinceCode.value = data.provinceCode
      getCity(provinceCode.value, resolve)
      break;
    case 2:
      cityCode.value = data.provinceCode
      getCounty(cityCode.value, data.cityCode, resolve)
      break;
    case 3:
      cityCode.value = data.provinceCode
      getTown(cityCode.value, data.cityCode, data.areaCode, resolve)
      break;
    case 4:
      cityCode.value = data.provinceCode
      getVillage(cityCode.value, data.cityCode, data.areaCode, data.streetCode, resolve)
      break;
    default:
      // 处理其他情况（可选）
      break;
  }
}

function handleChange(value) {
  console.log(value)
}

// 获取省
const getProvince = () => {
  getProvinces().then((res) => {
    if (res.status === 200) {
      dataList.value = res.data
    }
  })
}

// 获取市
const getCity = (code, resolve) => {
  getCitiesByProvince(code).then((res) => {
    if (res.status === 200) {
      cityList.value = res.data
      resolve(cityList.value)
    }
  })
}

// 获取区县
const getCounty = (code, cityCode, resolve) => {
  getCountiesByCity(code, cityCode).then((res) => {
    if (res.status === 200) {
      countyList.value = res.data
      resolve(countyList.value)
    }
  })
}

const getTown = (code, cityCode, areaCode, resolve) => {
  getTownByCounty(code, cityCode, areaCode).then((res) => {
    if (res.status === 200) {
      // data.forEach((item: any) => {
      //   item.leaf = true
      // })
      townList.value = res.data
      resolve(townList.value)
    }
  })
}

const getVillage = (provinceCode, cityCode, areaCode, streetCode, resolve) => {
  getVillageByTown(provinceCode, cityCode, areaCode, streetCode).then(res => {
    if (res.status === 200) {
      let data = res.data
      data.forEach((item: any) => {
        item.leaf = true
      })
      village.value = data
      resolve(village.value)
    }
  })
}
</script>
