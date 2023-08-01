<template>
  <div>
    <el-form
        ref="ruleFormRef"
        :model="ruleForm"
        :rules="rules"
        label-width="120px"
        class="demo-ruleForm"
        :size="formSize"
        status-icon>
      <el-form-item label="地区" prop="region">
        <el-cascader
            clearable
            style="width: 500px"
            :props="props"
            :options="dataList"
            v-model="ruleForm.region"
            placeholder="请选择地区"
            size="large"
        >
        </el-cascader>
      </el-form-item>
      <el-form-item label="时间" prop="date">
        <el-date-picker
            v-model="ruleForm.date"
            type="date"
            placeholder="请选择日期"
            :size="size"
            format="YYYY/MM/DD"
            value-format="YYYY-MM-DD"
        />
      </el-form-item>
      <el-form-item label="性别" prop="gender">
        <el-select v-model="ruleForm.gender" placeholder="请选择性别" size="large">
          <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="生成个数" prop="numbers">
        <el-select-v2 clearable v-model="ruleForm.numbers" placeholder="请选择数量" :options="lot" size="large">
        </el-select-v2>
      </el-form-item>
      <el-button @click="submitForm(ruleFormRef)">确定</el-button>
      <el-button @click="resetForm(ruleFormRef)">重置</el-button>
      <el-table :data="tableData" border style="width: 360px" v-show="showComponent">
        <el-table-column prop="cardNo" label="号码" width="220"/>
        <el-table-column label="操作" fixed="right" width="140">
          <template #default="{ row }">
            <el-button type="primary" size="default" @click="copyRowData(row)">复制</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-form>

  </div>

</template>

<script setup lang="ts">
import {onMounted, reactive, ref} from 'vue'
import {
  generateCode,
  getCitiesByProvince,
  getCountiesByCity,
  getProvinces,
  getTownByCounty,
  getVillageByTown
} from '@/api'
import {CascaderProps, ElMessage, ElNotification, FormInstance, FormRules} from "element-plus"

interface RuleForm {
  gender: string
  region: []
  date: string
  numbers: string
}

const formSize = ref('default')
const options = [
  {
    value: '1',
    label: '男'
  },
  {
    value: '0',
    label: '女'
  }]

const lot = Array.from({length: 5}).map((_, idx) => ({
  value: `${idx + 1}`,
  label: `${idx + 1}`,
}))

const tableData = ref([]);
let showComponent = ref(false)
let btn = ref(false)
const size = ref<'default' | 'large' | 'small'>('large')
const cityList = ref([])
const countyList = ref([])
const townList = ref([])
const village = ref([])
const dataList = ref([
  {
    provinceCode: '',
    name: '',
    cityCode: '',
    areaCode: '',
    streetCode: ''

  },
])
const ruleFormRef = ref<FormInstance>()
const ruleForm = reactive<RuleForm>({
  gender: '',
  region: [],
  date: '',
  numbers: '1',

})
const rules = reactive<FormRules<RuleForm>>({
  gender: [
    {required: true, message: '请选择性别', trigger: 'blur'},
  ],
  region: [
    {
      type: 'array',
      required: true,
      message: '请选择地区',
      trigger: 'change',
    },
  ],

  date: [
    {
      type: 'date',
      required: true,
      message: '请选择日期',
      trigger: 'change',
    },
  ],
  numbers: [{
    required: true,
    message: '请选择数量',
    trigger: 'change',
  }],
})

const copyRowData = async (row: any) => {
  const content = row.cardNo
  const textarea = document.createElement('textarea')
  textarea.value = content
  document.body.appendChild(textarea);
  textarea.select()
  await navigator.clipboard.writeText(content)
  document.body.removeChild(textarea)
}
const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate((valid, fields) => {
    if (valid) {
      generateCode(ruleForm.region.at(2), ruleForm.date, ruleForm.gender, ruleForm.numbers).then((res: any) => {
        if (res.status === 200) {
          tableData.value = []
          ElMessage.success('生成成功')
          tableData.value = res.data
          showComponent.value = true
          btn.value = true
        }
      }).catch((error:any)=>{
        ElMessage.error('请勿频繁生成，您的IP已经被限制生成，请过半小时再来吧！')
      })
    } else {
      ElMessage.error('信息输入错误')
    }
  })
}

const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.resetFields()
  btn.value = false
  showComponent.value = false
  tableData.value = []
}

const props: CascaderProps = {
  value: "areaCode",
  label: "name",
  lazy: true,
  lazyLoad: (node: any, resolve: any) => {
    getChildData(node.data, resolve, node.level)
  },
}
const provinceCode = ref('')
const cityCode = ref('')


onMounted(() => {
  getProvince()
  tips()
})

const getChildData = (data: any, resolve: any, level: any) => {
  switch (level) {
    case 1:
      provinceCode.value = data.provinceCode
      getCity(provinceCode.value, resolve)
      break
    case 2:
      cityCode.value = data.provinceCode
      getCounty(cityCode.value, data.cityCode, resolve)
      break
    case 3:
      cityCode.value = data.provinceCode
      getTown(cityCode.value, data.cityCode, data.areaCode, resolve)
      break
    case 4:
      cityCode.value = data.provinceCode
      getVillage(cityCode.value, data.cityCode, data.areaCode, data.streetCode, resolve)
      break
    default:
      break
  }
}

const tips = () => {
  ElNotification({
    title: '欢迎使用',
    message: '欢迎使用本工具，为了节省资源，请勿频繁点击生成',
    type: 'success',
  })
}

// 获取省
const getProvince = () => {
  getProvinces().then((res: any) => {
    if (res.status === 200) {
      dataList.value = res.data
    }
  })
}

// 获取市
const getCity = (code: string, resolve: any) => {
  getCitiesByProvince(code).then((res: any) => {
    if (res.status === 200) {
      cityList.value = res.data
      resolve(cityList.value)
    }
  })
}

// 获取区县
const getCounty = (code: string, cityCode: string, resolve: any) => {
  getCountiesByCity(code, cityCode).then((res: any) => {
    if (res.status === 200) {
      countyList.value = res.data
      resolve(countyList.value)
    }
  })
}

const getTown = (code: string, cityCode: string, areaCode: string, resolve: any) => {
  getTownByCounty(code, cityCode, areaCode).then((res: any) => {
    if (res.status === 200) {
      townList.value = res.data
      resolve(townList.value)
    }
  })
}

const getVillage = (provinceCode: string, cityCode: string, areaCode: string, streetCode: string, resolve: any) => {
  getVillageByTown(provinceCode, cityCode, areaCode, streetCode).then((res: any) => {
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
