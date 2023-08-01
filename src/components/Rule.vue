<template>
  <el-form :model="form" :rules="rules" ref="formRef">
    <el-form-item label="身份证号码" prop="idCard">
      <el-input v-model="form.idCard"></el-input>
    </el-form-item>
    <el-button @click="submitForm">提交</el-button>
  </el-form>

  <el-table :data="tableData" border style="width: 700px" v-show="showComponent">
    <el-table-column prop="cardNo" label="号码" width="200"/>
    <el-table-column prop="gender" label="性别" width="100"/>
    <el-table-column prop="region" label="地址" width="300"/>
    <el-table-column prop="age" label="年龄" width="100"/>
  </el-table>
</template>

<script lang="ts" setup>
import {Ref, ref} from 'vue'
import {ElMessage} from "element-plus"
import {checkCard} from "@/api"

interface DataType {
  cardNo: string
  gender: string
  region: string
  age: string
}

let showComponent = ref(false)
const tableData: Ref<DataType[]> = ref([]);
const formRef: Ref<any> = ref(null)
const form = ref({
  idCard: '',
})

const rules = {
  idCard: [
    {required: true, message: '请输入身份证号码', trigger: 'blur'},
    {
      validator: (rule: any, value: any) => {
        if (!isValidIdCard(value)) {
          ElMessage.error('请输入正确的身份证号码')
          return
        }
        return true
      },
      trigger: 'blur',
    },
  ],
};

function isValidIdCard(idCard: string) {
  // 使用正则表达式验证身份证号码
  const regExp = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/
  return regExp.test(idCard)
}

async function submitForm() {
  const valid = await formRef.value.validate()
  if (valid) {
    tableData.value = []
    showComponent.value = false
    checkCard(form.value.idCard).then((res: any) => {
      ElMessage.success('验证通过')
      tableData.value.push(res.data as DataType)
      showComponent.value = true
    })
  } else {
    console.log('表单验证不通过')
  }
}
</script>
