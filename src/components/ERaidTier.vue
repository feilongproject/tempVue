<template>
  <div class="web-global">
    <h2>大决战档线</h2>
    <div class="flex flex-wrap gap-4 items-center choose-box">
      <el-select v-model="server" placeholder="Select" style="width: 200px;" @change="fetchTierData">
        <el-option v-for="item in serverOptions" :key="item.value" :label="item.label" :value="item.value" />
      </el-select>
      <el-select v-model="boss" placeholder="Select" style="width: 200px">
        <el-option v-for="item in bossOptions" :key="item.value" :label="item.label" :value="item.value" />
      </el-select>
      <span>更新时间:{{ timestampDisplay }}</span>
    </div>
    <div class="content-header"><span>各档线分数</span></div>
    <div class="content-init">
      <el-row>
        <el-col :span="8">
          <div class="grid-content">
            <img src="../assets/tier4.webp" class="tier-icon" alt="一档" />
            <span style="font-weight: bold;">{{ tierDataDisplay[0]?.BestRankingPoint || 'N/A' }}</span>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="grid-content">
            <img src="../assets/tier3.webp" class="tier-icon" alt="二档" />
            <span style="font-weight: bold;">{{ tierDataDisplay[1]?.BestRankingPoint || 'N/A' }}</span>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="grid-content">
            <img src="../assets/tier2.webp" class="tier-icon" alt="三档" />
            <span style="font-weight: bold;">{{ tierDataDisplay[2]?.BestRankingPoint || 'N/A' }}</span>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script lang="ts" setup>
import axios from 'axios';
import { ref, onMounted } from 'vue';

const server = ref('TW');
const boss = ref('9');
const serverOptions = ref([
  {
    value: 'TW',
    label: '港澳台',
  },
  {
    value: 'AS',
    label: '亚服',
  },
  {
    value: 'NA',
    label: '北美服',
  },
  {
    value: 'KR',
    label: '韩服',
  },
  {
    value: 'GL',
    label: '全球服',
  },
]);
const bossOptions = ref([
  {
    value: '9',
    label: '第9期 ?? ?'
  }
]);
const tierDataDisplay = ref<SimpleData[]>([]);
const timestampDisplay = ref<string>('');



const fetchTierData = async () => {
  try {
    const tierResponse = await axios.post<SimpleDataResponse>('http://localhost:5248/api/v2/eraid/tier', { server: server.value });
    const tierData = tierResponse.data;
    tierDataDisplay.value = tierData.Data;
    timestampDisplay.value = new Date(tierData.Timestamp).toLocaleString();
  } catch (error) {
    console.error(error);
  }
}

onMounted(() => {
  fetchTierData();
});
</script>

<style lang="scss" scoped>
.web-global {
  text-align: left;
  margin-left: 16px;
  margin-right: 16px;
  padding: 4px;
  display: flex;
  flex-direction: column;
  align-items: center;

  .echarts {
    display: flex;
  }
}

.choose-box {
  /* background-color: white; */
  padding: 4px;
  /* height: 70px; */
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
}

span {
  font-size: 14px;
}

.button {
  width: 100%;
  margin-top: 8px;
}

.content-header {
  text-align: center;
  margin-top: 20px;
  background-color: #344b6f;
  color: white;
  display: flex;
  /* 使 div 成为 flexbox 容器 */
  align-items: center;
  /* 垂直居中子元素 */
  justify-content: center;
  height: 24px;
}

.content-init {
  margin-top: 8px;
  background-color: white;
  padding: 2px;
}

.el-row {
  margin-bottom: 20px;
}

.el-row:last-child {
  margin-bottom: 0;
}

.el-col {
  border-radius: 4px;
}

.grid-content {
  display: flex;
  /* 使 div 成为 flexbox 容器 */
  align-items: center;
  /* 垂直居中子元素 */
  justify-content: center;
  padding: 4px;
  flex-direction: column;
}

.tier-icon {
  height: 40px;
  max-width: 100%;
}
</style>