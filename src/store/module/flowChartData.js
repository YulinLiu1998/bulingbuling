import { defineStore } from 'pinia';

export const useFlowChartDataStore = defineStore('flowChartData', {
  state: () => ({ key: 0, name: '', flowChartData: {} }),
  getters: {
    double: (state) => state.key * 2,
  },
  actions: {
    changeKey(data) {
      this.key = data;
      // 查询 key 对应的数据
      let flowChartDataAll = localStorage.getItem('flowChartDataALL');
      flowChartDataAll = JSON.parse(flowChartDataAll);
      console.log('flowChartDataAll', flowChartDataAll);
      if (flowChartDataAll[data]) {
        this.flowChartData = flowChartDataAll[data];
      } else {
        this.flowChartData = {
          nodes: [
            {
              id: '194b7c4d-aa09-4fcd-9cc5-69c28bdfa957',
              type: 'input',
              x: 160,
              y: 120,
              properties: {},
              text: {
                x: 160,
                y: 120,
                value: '数据输入算子' + data,
              },
            },
          ],
          edges: [],
        };
      }
    },
    changeName(data) {
      this.name = data;
    },
    changFlowChartData(data) {
      this.flowChartData = data;
      // 保存当前数据
      let flowChartDataAll = localStorage.getItem('flowChartDataALL');
      flowChartDataAll = JSON.parse(flowChartDataAll);
      flowChartDataAll[this.key] = data;
      localStorage.setItem('flowChartDataALL', JSON.stringify(flowChartDataAll));
    },
  },
});
