<template>
  <div ref="containerEL" class="container">流程图</div>
</template>

<script setup>
  import LogicFlow from '@logicflow/core';
  import '@logicflow/core/dist/style/index.css';
  import { Snapshot, Menu, DndPanel, SelectionSelect } from '@logicflow/extension';
  import '@logicflow/extension/lib/style/index.css';
  import { onMounted, unref, ref, nextTick } from 'vue-demi';
  import { configDefaultDndPanel } from './config';
  import customCircle from './customCircle';

  let LFInstance = ref(null);
  let containerEL = ref(null);
  onMounted(async () => {
    await nextTick();

    LogicFlow.use(DndPanel);
    // Canvas configuration
    LogicFlow.use(Snapshot);
    // Start the right-click menu
    LogicFlow.use(Menu);
    LogicFlow.use(SelectionSelect);

    let container = unref(containerEL);
    LFInstance.value = new LogicFlow({
      container: container,
      grid: {
        size: 20,
        visible: true,
        type: 'mesh',
        config: {
          color: '#ababab',
          thickness: 1,
        },
      },
    });
    const lf = unref(LFInstance);

    lf.register(customCircle);
    lf.render();
    lf.setPatternItems(configDefaultDndPanel(lf));

    document.querySelector('#js_custom-dnd').addEventListener('mousedown', (e) => {
      console.log('aaaa');
      const type = e.target.getAttribute('data-type');
      if (type) {
        lf.dnd.startDrag({
          type,
          text: `${type}节点`,
        });
      }
    });
  });
</script>

<style lang="less" scoped>
  .container {
    width: 100%;
    height: 100%;
    background: pink;
  }</style
>>
