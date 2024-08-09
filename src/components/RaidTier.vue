<template>
    <div class="web-global">
        <h2>总力战档线</h2>
        <div class="flex flex-wrap gap-4 items-center choose-box">
            <div class="echarts">
                <div ref="echartsRef" style="width: 100%;height: 500px;"></div>
            </div>

            <div class="select">
                <el-select v-model="server" placeholder="Select" style="width: 200px;margin-left: 16px;"
                    @change="fetchTierData">
                    <el-option v-for="item in serverOptions" :key="item.value" :label="item.label"
                        :value="item.value" />
                </el-select>
                <el-select v-model="boss" placeholder="Select" style="width: 200px">
                    <el-option v-for="item in bossOptions" :key="item.value" :label="item.label" :value="item.value" />
                </el-select>
            </div>

            <span>更新时间:{{ timestampDisplay }}</span>
        </div>
        <div><el-button type="primary" class="button" @click="queryTier">查询档线</el-button></div>
        <div><el-button class="button" @click="queryRank">查询排名</el-button></div>
        <div class="content-header"><span>各档线分数</span></div>
        <div class="content-init">
            <el-row>
                <el-col :span="8">
                    <div class="grid-content">
                        <img src="../assets/tier4.webp" class="tier-icon" alt="一档" />
                        <span style="font-weight: bold;">{{ tierDataDisplay[0]?.BestRankingPoint || 'N/A' }}</span>
                        <span style="font-style: italic;">{{ tierDataDisplay[0]?.Hard || 'N/A' }} {{
                            tierDataDisplay[0]?.BattleTime || 'N/A' }}</span>
                    </div>
                </el-col>
                <el-col :span="8">
                    <div class="grid-content">
                        <img src="../assets/tier3.webp" class="tier-icon" alt="二档" />
                        <span style="font-weight: bold;">{{ tierDataDisplay[1]?.BestRankingPoint || 'N/A' }}</span>
                        <span style="font-style: italic;">{{ tierDataDisplay[1]?.Hard || 'N/A' }} {{
                            tierDataDisplay[1]?.BattleTime || 'N/A' }}</span>
                    </div>
                </el-col>
                <el-col :span="8">
                    <div class="grid-content">
                        <img src="../assets/tier2.webp" class="tier-icon" alt="三档" />
                        <span style="font-weight: bold;">{{ tierDataDisplay[2]?.BestRankingPoint || 'N/A' }}</span>
                        <span style="font-style: italic;">{{ tierDataDisplay[2]?.Hard || 'N/A' }} {{
                            tierDataDisplay[2]?.BattleTime || 'N/A' }}</span>
                    </div>
                </el-col>
            </el-row>
        </div>
        <div class="content-header"><span>各难度最低排名</span></div>
        <div class="content-init">
            <el-row>
                <el-col :span="8">
                    <div class="grid-content">
                        <span style="font-weight: bold;">Torment</span>
                        <span>{{ hardLowestDataDisplay[0]?.Count || 'N/A' }}</span>
                    </div>
                </el-col>
                <el-col :span="8">
                    <div class="grid-content">
                        <span style="font-weight: bold;">Insane</span>
                        <span>{{ hardLowestDataDisplay[1]?.Count || 'N/A' }}</span>
                    </div>
                </el-col>
                <el-col :span="8">
                    <div class="grid-content">
                        <span style="font-weight: bold;">Extreme</span>
                        <span>{{ hardLowestDataDisplay[2]?.Count || 'N/A' }}</span>
                    </div>
                </el-col>
                <el-col :span="6">
                    <div class="grid-content">
                        <span style="font-weight: bold;">Hardcore</span>
                        <span>{{ hardLowestDataDisplay[3]?.Count || 'N/A' }}</span>
                    </div>
                </el-col>
                <el-col :span="6">
                    <div class="grid-content">
                        <span style="font-weight: bold;">VeryHard</span>
                        <span>{{ hardLowestDataDisplay[4]?.Count || 'N/A' }}</span>
                    </div>
                </el-col>
                <el-col :span="6">
                    <div class="grid-content">
                        <span style="font-weight: bold;">Hard</span>
                        <span>{{ hardLowestDataDisplay[5]?.Count || 'N/A' }}</span>
                    </div>
                </el-col>
                <el-col :span="6">
                    <div class="grid-content">
                        <span style="font-weight: bold;">Normal</span>
                        <span>{{ hardLowestDataDisplay[6]?.Count || 'N/A' }}</span>
                    </div>
                </el-col>
            </el-row>
        </div>

        <div class="content-init">
            <el-table :data="tableDisplay" style="width: 100%">
                <el-table-column prop="Rank" label="排名" width="160" />
                <el-table-column prop="BestRankingPoint" label="分数" width="280" />
                <el-table-column prop="Hard" label="难度" width="100" />
                <el-table-column prop="BattleTime" label="用时" />
            </el-table>
            <el-pagination v-model:current-page="currentPage" background layout="prev, pager, next, jumper"
                :pager-count="3" :page-size="pageSize" :total="totalItems" @current-change="handlePageChange"
                style="justify-content: flex-end;margin-top: 16px;" />
        </div>
    </div>
</template>

<script lang="ts" setup>
import axios from 'axios';
import * as echarts from 'echarts';
import { ref, onMounted, computed, markRaw } from 'vue';


const echartsRef = ref<HTMLElement>(null as any);
const echartsInit = ref<echarts.ECharts | null>(null);
const server = ref('TW');
const boss = ref('61');
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
        value: '61',
        label: '第59期 野外 鸡'
    }
]);
const queryMode = ref(0);
const tierDataDisplay = ref<SimpleData[]>([]);
const timestampDisplay = ref<string>('');
const hardLowestDataDisplay = ref<HardCountData[]>([]);
const tableData = ref<ComplexData[]>([]);
const currentPage = ref(1);
const pageSize = ref(10); // 每页显示的条数
const totalItems = ref(0); // 总条数

const tableDisplay = computed(() => {
    const start = (currentPage.value - 1) * pageSize.value;
    const end = start + pageSize.value;
    return tableData.value.slice(start, end);
});

async function setTrackChart() {
    const trackRes = await axios.post<TierDataTrackResponse>("http://localhost:5248/api/v2/raid/tierTrack", { server: server.value });

    const chart = markRaw(echarts.init(echartsRef.value));

    const dateList: string[] = [];
    const dataKeys = Object.keys(trackRes.data.Data.Value);
    const dataList = Array.from({ length: dataKeys.length }, () => [] as number[]);

    for (const [i, ts] of trackRes.data.Data.Key.entries()) {
        const date = new Date(ts);
        dateList.push(`${date.getMonth() + 1}/${date.getDate()} ${date.toTimeString().slice(0, 5)}`);
        // console.log(i, ts);
        for (const [iData, key] of dataKeys.entries()) {
            dataList[iData].push(trackRes.data.Data.Value[key][i]);
        }
    }
    // console.log(dateList, dataKeys, dataList);

    const option: echarts.EChartsOption = {
        title: {
            left: 'center',
            text: '档线趋势'
        },
        xAxis: {
            type: 'category',
            boundaryGap: false,
            data: dateList,
        },
        yAxis: {
            type: 'value',
            scale: true,
            axisLabel: {
                // formatter: (x) => `${x}`.slice(0, -4) + 'w',
            },
            minInterval: 1000, //分割刻度
        },
        dataZoom: [
            {
                type: 'inside',
                start: 0,
                end: 10
            },
            {
                start: 0,
                end: 10
            }
        ],
        series: dataList.map((v, i) => ({
            name: `${dataKeys[i]}`,
            type: 'line',
            symbol: 'none',
            data: v,
            lineStyle: { width: 3 },
        })),
    };
    chart.clear();
    chart.setOption(option);

}

const fetchTierData = async () => {
    try {
        const tierResponse = await axios.post<SimpleDataResponse>('http://localhost:5248/api/v2/raid/tier', { server: server.value });
        const tierData = tierResponse.data;
        tierDataDisplay.value = tierData.Data;
        timestampDisplay.value = new Date(tierData.Timestamp).toLocaleString();

        const hardLowestResponse = await axios.post<HardCountResponse>('http://localhost:5248/api/v2/raid/hard_people', { server: server.value });
        const hardLowestData = hardLowestResponse.data;
        hardLowestDataDisplay.value = hardLowestData.Data;

        if (queryMode.value == 0) {
            const partialListResponse = await axios.post<ComplexDataResponse>('http://localhost:5248/api/v2/raid/partial_list', { server: server.value });
            const partialListData = partialListResponse.data;
            tableData.value = partialListData.Data;
            totalItems.value = tableData.value.length;
        }
        else {
            tableData.value = []
            totalItems.value = 0
        }
        await setTrackChart();
    } catch (error) {
        console.error(error);
    }
}

onMounted(() => {
    fetchTierData();
});

const queryTier = () => {
    queryMode.value = 0;
    fetchTierData();
}
const queryRank = () => {
    queryMode.value = 1;
    fetchTierData();
}


const handlePageChange = (page: number) => {
    currentPage.value = page;
};
</script>

<style lang="scss" scoped>
.web-global {
    text-align: left;
    margin-left: 16px;
    margin-right: 16px;
    padding: 4px;
    // display: flex;
    // flex-direction: column;
    // align-items: center;


    .choose-box {
        /* background-color: white; */
        padding: 4px;
        /* height: 70px; */
        flex-direction: column;
        justify-content: space-around;
        align-items: center;

        .echarts {
            display: flex;
            width: 100%;
        }

        .select {
            display: flex;
            justify-content: space-evenly;
            flex-direction: row;
            flex-wrap: nowrap;
            width: 100%;
        }
    }
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