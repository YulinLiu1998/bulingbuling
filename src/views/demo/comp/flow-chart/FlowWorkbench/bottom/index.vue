<template>
  <div class="dnd-title">算子区域</div>
  <div id="js_custom-dnd">
    <div data-type="input" class="dnd-item">数据输入算子</div>
    <div data-type="output" class="dnd-item"> 数据输出算子</div>
    <div data-type="custom-react" class="dnd-item">数据预处理算子</div>
    <div data-type="custom-react" class="dnd-item">风险行程轨迹算法</div>
    <div data-type="custom-react" class="dnd-item">路网匹配算法</div>
    <div data-type="custom-react" class="dnd-item">正地理地址解码</div>
    <div data-type="custom-react" class="dnd-item">逆地理地址解码</div>
    <div data-type="customCircle" class="dnd-item">点转轨迹</div>
  </div>
</template>

<script setup>
  // import { storeToRefs } from 'pinia';
  // import { useFlowChartDataStore } from '/@/store/module/flowChartData';
  // const flowChartData = useFlowChartDataStore();
  // const { key } = storeToRefs(flowChartData);
</script>

<style lang="less" scoped>
  .dnd-title {
    font-weight: bold;
    font-size: 16px;
    margin: 5px;
  }

  #js_custom-dnd {
    padding: 5px;
    background-color: rgb(252, 251, 253);
    border-radius: 20px;

    .dnd-item {
      padding: 5px 0;
      font-size: 14px;
      user-select: none;
    }
  }
</style>
