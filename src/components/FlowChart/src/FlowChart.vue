<template>
  <a-spin class="h-full" :spinning="spinning">
    <div class="h-full" :class="prefixCls">
      <FlowChartToolbar
        :prefixCls="prefixCls"
        v-if="toolbar"
        @view-data="handlePreview"
        @save-data="handleSaveData"
        @run-data="handleRunData"
      />
      <div ref="lfElRef" class="h-full"></div>
      <BasicModal @register="register" title="流程数据" width="50%">
        <JsonPreview :data="graphData" />
      </BasicModal>
      <StartConfig
        v-if="visibleStart"
        :configData="configData"
        :key="configData.id"
        @close-start="closeStart"
        @save-start="saveStart"
      />
      <EndConfig
        v-if="visibleEnd"
        :configData="configData"
        :graphData="graphData"
        :key="configData.id"
        @close-start="closeEnd"
        @save-start="saveEnd"
      />
      <CommonConfig
        v-if="visibleCommon"
        :configData="configData"
        :graphData="graphData"
        :key="configData.id"
        @close-start="closeCommon"
        @save-start="saveCommon"
      />
    </div>
  </a-spin>
</template>
<script setup lang="ts">
  import type { Ref } from 'vue';
  import type { Definition } from '@logicflow/core';
  import { ref, onMounted, unref, nextTick, computed, watch } from 'vue';
  import FlowChartToolbar from './FlowChartToolbar.vue';
  import LogicFlow from '@logicflow/core';
  import { Snapshot, BpmnElement, Menu, DndPanel, SelectionSelect } from '@logicflow/extension';
  import { useDesign } from '/@/hooks/web/useDesign';
  import { useAppStore } from '/@/store/modules/app';
  import { createFlowChartContext } from './useFlowContext';
  // import { toLogicFlowData } from './adpterForTurbo';
  import { useModal, BasicModal } from '/@/components/Modal';
  import { JsonPreview } from '/@/components/CodeEditor';
  import { configDefaultDndPanel } from './config';
  import '@logicflow/core/dist/style/index.css';
  import '@logicflow/extension/lib/style/index.css';
  import StartConfig from './SetConfig/StartConfig.vue';
  import EndConfig from './SetConfig/EndConfig.vue';
  import CommonConfig from './SetConfig/CommonConfig.vue';
  import customCircle from './styleConfig/customCircle';
  import UserTask from './styleConfig/customStyle';
  import InputNode from './styleConfig/inputStyle';
  import OutputNode from './styleConfig/ouputStyle';
  import CustomReact from './styleConfig/customReact';
  import { useFlowChartDataStore } from '/@/store/module/flowChartData';
  import { storeToRefs } from 'pinia';
  // import { executeFlow } from '/@/api/flow';
  import { message } from 'ant-design-vue';
  import socketIO from 'socket.io-client';

  const props = defineProps({
    flowOptions: {
      type: Object as PropType<Definition>,
      default: () => ({}),
    },

    data: {
      type: Object as PropType<any>,
      default: () => ({}),
    },

    toolbar: {
      type: Boolean,
      default: true,
    },
    patternItems: {
      type: Array,
    },
  });
  const flowChartDataState = useFlowChartDataStore();
  const { flowChartData } = storeToRefs(flowChartDataState);
  const lfElRef = ref(null);
  const graphData = ref({});
  let configData = ref({
    id: '',
    type: '',
  });
  let visibleStart = ref(false);
  let visibleEnd = ref(false);
  let visibleCommon = ref(false);
  const lfInstance = ref(null) as Ref<LogicFlow | null>;
  const websocket_url = 'http://127.0.0.1:5000/testnamespace';
  const socket = socketIO(websocket_url);
  const { prefixCls } = useDesign('flow-chart');
  const appStore = useAppStore();
  const [register, { openModal }] = useModal();
  createFlowChartContext({
    logicFlow: lfInstance as unknown as LogicFlow,
  });
  const spinning = ref<boolean>(false);

  const getFlowOptions = computed(() => {
    const { flowOptions } = props;

    const defaultOptions: Partial<Definition> = {
      grid: true,
      background: {
        color: appStore.getDarkMode === 'light' ? '#f7f9ff' : '#151515',
      },
      keyboard: {
        enabled: true,
      },
      ...flowOptions,
    };
    return defaultOptions as Definition;
  });

  watch(
    () => props.data,
    () => {
      onRender();
    },
  );

  watch(
    () => unref(getFlowOptions),
    (options) => {
      unref(lfInstance)?.updateEditConfig(options);
    },
  );

  // init logicFlow
  async function init() {
    await nextTick();

    const lfEl = unref(lfElRef);
    if (!lfEl) {
      return;
    }
    LogicFlow.use(DndPanel);

    // Canvas configuration
    LogicFlow.use(Snapshot);
    // Use the bpmn plug-in to introduce bpmn elements, which can be used after conversion in turbo
    LogicFlow.use(BpmnElement);
    // Start the right-click menu
    LogicFlow.use(Menu);
    LogicFlow.use(SelectionSelect);

    lfInstance.value = new LogicFlow({
      ...unref(getFlowOptions),
      container: lfEl,
    });
    const lf = unref(lfInstance)!;
    lf?.setDefaultEdgeType('line');
    lf.extension.menu.addMenuConfig({
      nodeMenu: [
        {
          text: '设置',
          async callback(node: any) {
            if (node.type === 'input') {
              console.log('start');
              configData.value = node;
              await nextTick();
              visibleStart.value = true;
            } else if (node.type === 'output') {
              console.log('end');
              configData.value = node;
              graphData.value = unref(lf).getGraphData();
              await nextTick();
              visibleEnd.value = true;
            } else if (node.type === 'custom-react') {
              console.log('common');
              configData.value = node;
              graphData.value = unref(lf).getGraphData();
              await nextTick();
              visibleCommon.value = true;
            } else if (node.type === 'bpmn:userTask') {
              console.log('end');
            }
          },
        },
      ],
    });
    // 自定义节点
    lf?.register(customCircle);
    lf?.register(UserTask);
    lf?.register(InputNode);
    lf?.register(OutputNode);
    lf?.register(CustomReact);
    onRender();
    lf?.setPatternItems(props.patternItems || configDefaultDndPanel(lf));

    document.querySelector('#js_custom-dnd')?.addEventListener('mousedown', (e) => {
      console.log('aaaa');
      const el = e.target as HTMLInputElement;
      const type = el.getAttribute('data-type');
      console.log(el.innerText);
      if (type) {
        lf.dnd.startDrag({
          type,
          text: `${el.innerText}`,
          properties: {
            type: `${el.innerText}`,
          },
        });
      }
    });
  }

  async function onRender() {
    await nextTick();
    const lf = unref(lfInstance);
    if (!lf) {
      return;
    }
    // 渲染当前数据 props.data
    // const lFData = toLogicFlowData(props.data);
    const lFData = props.data;
    console.log('数据渲染');
    lf.render(lFData);
  }

  function handlePreview() {
    console.log('查看数据');
    const lf = unref(lfInstance);
    if (!lf) {
      return;
    }
    graphData.value = unref(lf).getGraphData();
    openModal();
  }

  function handleSaveData() {
    console.log('保存数据');
    const lf = unref(lfInstance);
    if (!lf) {
      return;
    }
    graphData.value = unref(lf).getGraphData();
    // 保存数据
    flowChartDataState.changFlowChartData(graphData.value);
  }
  async function handleRunData() {
    console.log('运行', flowChartData);
    const lf = unref(lfInstance);
    if (!lf) {
      return;
    }

    lf.updateEditConfig({
      adjustEdge: false,
      adjustNodePosition: false,
    });

    // 图表数据
    let graphData = unref(lf).getGraphData();
    let param: any = {};
    graphData.nodes.forEach((node) => {
      if (node.type == 'input') {
        param.inputTable = node.properties.databaseTableName;
      } else if (node.type == 'output') {
        param.outputTable = node.properties.databaseTableName;
      } else {
        if (node.properties.type == '风险行程轨迹算法') {
          param.properties = {
            maxDistance: node.properties.maxDistance,
            maxTime: node.properties.maxTime,
            type: node.properties.type,
          };
        } else {
          param.properties = {
            type: node.properties.type,
          };
        }
      }
    });
    socket.emit('request_for_response', { param: param });
  }
  //监听回复的消息
  socket.on('response', function (data) {
    if (data.code == '200') {
      // 正在运行
      spinning.value = true;

      message.info(data.msg);
      console.log(data.msg);
    } else if (data.code == '201') {
      // 已完成
      const lf = unref(lfInstance);
      if (!lf) {
        return;
      }
      lf.updateEditConfig({
        adjustEdge: true,
        adjustNodePosition: true,
      });
      spinning.value = false;
      message.success(data.msg);
      console.log(data.msg);
    } else {
      const lf = unref(lfInstance);
      if (lf) {
        lf.updateEditConfig({
          adjustEdge: true,
          adjustNodePosition: true,
        });
      }
      message.error(data.msg);
    }
  });

  onMounted(init);
  const closeStart = (data) => {
    visibleStart.value = false;
    console.log(data.properties.value);
  };
  const saveStart = (data) => {
    console.log('data', data);
    const lf = unref(lfInstance);
    if (!lf) {
      return;
    }

    // 图表数据
    let graphData = unref(lf).getGraphData();
    console.log('graphData', graphData);
    let index = graphData.nodes.find((item) => {
      console.log(item.id == data.id);
      return item.id == data.id;
    });
    index = graphData.nodes.indexOf(index);
    console.log(index);
    graphData.nodes[index] = data;
    flowChartDataState.changFlowChartData(graphData);
  };
  const closeEnd = (data) => {
    visibleEnd.value = false;
    console.log(data.properties.value);
  };
  const saveEnd = (data) => {
    console.log('data', data);
    const lf = unref(lfInstance);
    if (!lf) {
      return;
    }

    // 图表数据
    let graphData = unref(lf).getGraphData();
    console.log('graphData', graphData);
    let index = graphData.nodes.find((item) => {
      console.log(item.id == data.id);
      return item.id == data.id;
    });
    index = graphData.nodes.indexOf(index);
    console.log(index);
    graphData.nodes[index] = data;
    flowChartDataState.changFlowChartData(graphData);
  };
  const closeCommon = (data) => {
    visibleCommon.value = false;
    console.log(data.properties.value);
  };
  const saveCommon = (data) => {
    console.log('data', data);
    const lf = unref(lfInstance);
    if (!lf) {
      return;
    }

    // 图表数据
    let graphData = unref(lf).getGraphData();
    console.log('graphData', graphData);
    let index = graphData.nodes.find((item) => {
      console.log(item.id == data.id);
      return item.id == data.id;
    });
    index = graphData.nodes.indexOf(index);
    console.log(index);
    graphData.nodes[index] = data;
    flowChartDataState.changFlowChartData(graphData);
  };
</script>
<style lang="less" scoped>
  /deep/ .ant-spin-container {
    height: 100%;
  }

  .ant-spin-nested-loading {
    height: 100%;
  }
</style>
