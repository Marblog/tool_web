<script lang="ts" setup>
import {ref} from "vue"

const url = 'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg'
const activeIndex = ref('1')
const handleSelect = (key: string, keyPath: string[]) => {
  console.log(key, keyPath)
}
</script>

<template>
  <div>
    <el-container>
      <el-header style="padding: 0;">
        <div>
          <el-menu
              :default-active="$route.path"
              mode="horizontal"
              :ellipsis="false"
              @select="handleSelect"
              router
          >
            <el-menu-item index="/">
              <el-image style="width: 50px; height: 50px" :src="url"/>
            </el-menu-item>
            <div class="flex-grow"/>
            <el-sub-menu index="/card">
              <template #title>身份证工具</template>
              <el-menu-item index="/home">身份证生成</el-menu-item>
              <el-menu-item index="/rule">身份证校验</el-menu-item>
            </el-sub-menu>

            <el-sub-menu index="/json">
              <template #title>JSON工具</template>
              <el-menu-item index="2-1">item one</el-menu-item>
              <el-menu-item index="2-2">item two</el-menu-item>
              <el-menu-item index="2-3">item three</el-menu-item>
            </el-sub-menu>
          </el-menu>
        </div>
      </el-header>
      <el-main>
        <router-view></router-view>
      </el-main>
      <el-footer></el-footer>
    </el-container>
  </div>
</template>

<style scoped>
.flex-grow {
  flex-grow: 0;
  margin-left: 10%;
}
</style>