<template>
  <div class="left">
    <Top />
    <Bottom />
  </div>
</template>

<script setup>
  import Top from './top/index.vue';
  import Bottom from './bottom/index.vue';
</script>

<style lang="less" scoped>
  .left {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
  }
</style>
