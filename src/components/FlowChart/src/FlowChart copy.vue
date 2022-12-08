<template>
  <div class="h-full" :class="prefixCls">
    <FlowChartToolbar :prefixCls="prefixCls" v-if="toolbar" @view-data="handlePreview" />
    <div ref="lfElRef" class="h-full"></div>
    <BasicModal @register="register" title="流程数据" width="50%">
      <JsonPreview :data="graphData" />
    </BasicModal>
    <StartConfig v-if="visibleStart" :configData="configData" @closeStart="closeStart" />
  </div>
</template>
<script lang="ts">
  import type { Ref } from 'vue';
  import type { Definition } from '@logicflow/core';
  import { defineComponent, ref, onMounted, unref, nextTick, computed, watch } from 'vue';
  import FlowChartToolbar from './FlowChartToolbar.vue';
  import LogicFlow from '@logicflow/core';
  import { Snapshot, BpmnElement, Menu, DndPanel, SelectionSelect } from '@logicflow/extension';
  import { useDesign } from '/@/hooks/web/useDesign';
  import { useAppStore } from '/@/store/modules/app';
  import { createFlowChartContext } from './useFlowContext';
  import { toLogicFlowData } from './adpterForTurbo';
  import { useModal, BasicModal } from '/@/components/Modal';
  import { JsonPreview } from '/@/components/CodeEditor';
  import { configDefaultDndPanel } from './config';
  import '@logicflow/core/dist/style/index.css';
  import '@logicflow/extension/lib/style/index.css';
  import StartConfig from './SetConfig/StartConfig.vue';
  import customCircle from './styleConfig/customCircle';
  export default defineComponent({
    name: 'FlowChart',
    components: { BasicModal, FlowChartToolbar, JsonPreview, StartConfig },
    props: {
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
    },
    setup(props) {
      const lfElRef = ref(null);
      const graphData = ref({});
      let configData = ref({});
      let visibleStart = ref(false);
      const lfInstance = ref(null) as Ref<LogicFlow | null>;

      const { prefixCls } = useDesign('flow-chart');
      const appStore = useAppStore();
      const [register, { openModal }] = useModal();
      createFlowChartContext({
        logicFlow: lfInstance as unknown as LogicFlow,
      });

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

      // TODO
      // watch(
      //   () => appStore.getDarkMode,
      //   () => {
      //     init();
      //   }
      // );

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
              callback(node: any) {
                if (node.type === 'bpmn:startEvent') {
                  console.log('start');
                  configData.value = node;
                  visibleStart.value = true;
                } else if (node.type === 'bpmn:endEvent') {
                  console.log('end');
                } else if (node.type === 'bpmn:exclusiveGateway') {
                  console.log('end');
                } else if (node.type === 'bpmn:userTask') {
                  console.log('end');
                }
              },
            },
          ],
        });
        lf?.register(customCircle);
        onRender();
        lf?.setPatternItems(props.patternItems || configDefaultDndPanel(lf));

        document.querySelector('#js_custom-dnd')?.addEventListener('mousedown', (e) => {
          console.log('aaaa');
          const el = e.target as HTMLInputElement;
          const type = el.getAttribute('data-type');
          if (type) {
            lf.dnd.startDrag({
              type,
              text: `${type}节点`,
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
        const lFData = toLogicFlowData(props.data);
        lf.render(lFData);
      }

      function handlePreview() {
        const lf = unref(lfInstance);
        if (!lf) {
          return;
        }
        graphData.value = unref(lf).getGraphData();
        openModal();
      }

      onMounted(init);
      function closeStart() {
        visibleStart.value = false;
      }
      return {
        register,
        prefixCls,
        lfElRef,
        handlePreview,
        graphData,
        configData,
        visibleStart,
        closeStart,
      };
    },
  });
</script>
