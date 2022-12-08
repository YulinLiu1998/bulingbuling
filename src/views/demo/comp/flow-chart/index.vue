<template>
  <div class="flow-chart">
    <FlowWorkbench class="flow-workbench" />
    <PageWrapper
      :title="`行程数据挖掘解析平台`"
      content=""
      contentFullHeight
      fixedHeight
      class="flow-area"
    >
      <FlowChart :data="flowChartData" />
    </PageWrapper>
  </div>
</template>

<script setup>
  import { onBeforeMount } from 'vue';
  import { FlowChart } from '/@/components/FlowChart';
  // import FlowChart from './FlowChart/index.vue';
  import { PageWrapper } from '/@/components/Page';
  import FlowWorkbench from './FlowWorkbench/index.vue';
  import { storeToRefs } from 'pinia';

  import { useFlowChartDataStore } from '/@/store/module/flowChartData';
  const flowChartDataState = useFlowChartDataStore();
  const { flowChartData } = storeToRefs(flowChartDataState);
  onBeforeMount(async () => {
    const data = localStorage.getItem('flowChartDataALL');
    if (!data) {
      localStorage.setItem('flowChartDataALL', JSON.stringify({}));
    }
  });
</script>
<style lang="less" scoped>
  .flow-chart {
    width: 100%;
    height: 100%;
    display: flex;
  }

  .flow-workbench {
    width: 200px !important;
    margin-right: 5px;
    background-color: white;
  }

  .flow-area {
    flex: 1;
  }
</style>
