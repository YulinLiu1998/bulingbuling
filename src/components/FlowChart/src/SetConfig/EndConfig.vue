<template>
  <Drawer :title="nodeType" :size="size" :visible="visible" @close="onClose">
    <template #extra>
      <Button style="margin-right: 8px" @click="onClose">取消</Button>
      <Button type="primary" @click="onSave">保存</Button>
    </template>
    <a-form
      :model="formState"
      name="basic"
      :label-col="{ span: 8 }"
      :wrapper-col="{ span: 10 }"
      autocomplete="off"
      labelAlign="left"
    >
      <a-form-item
        label="算子名称"
        name="operatorName"
        :rules="[{ required: true, message: '请输入算子名称!' }]"
      >
        <a-input v-model:value="formState.operatorName" />
      </a-form-item>
      <a-form-item
        label="上级算子名称"
        name="startNodeName"
        :rules="[{ required: true, message: '请输入算子名称!' }]"
      >
        <span>{{ startNode.data.text ? startNode.data.text.value : '' }}</span>
      </a-form-item>
      <a-form-item
        label="上级算子类型"
        name="startNodeType"
        :rules="[{ required: true, message: '请输入算子名称!' }]"
      >
        <span>{{ startNode.data.properties ? startNode.data.properties.type : '' }}</span>
      </a-form-item>
      <p>数据输出选择：</p>
      <a-tabs v-model:activeKey="activeKey">
        <a-tab-pane key="1">
          <template #tab>
            <span>
              <file-outlined />
              已有表
            </span>
          </template>
          <!-- <a-form-item
            name="databaseName"
            label="数据库名称"
            has-feedback
            :rules="[{ required: true, message: '请选择数据库名称!' }]"
          >
            <a-select v-model:value="formState.databaseName" placeholder="Please select a country">
              <a-select-option value="china">China</a-select-option>
              <a-select-option value="usa">U.S.A</a-select-option>
            </a-select>
          </a-form-item> -->
          <a-form-item
            name="databaseTableName"
            label="数据表名称"
            has-feedback
            :rules="[{ required: true, message: 'Please select your country!' }]"
          >
            <a-select
              v-model:value="formState.databaseTableName"
              placeholder="Please select a country"
            >
              <a-select-option value="a_risk_place">a_risk_place</a-select-option>
              <a-select-option value="a_risk_trip">a_risk_trip</a-select-option>
            </a-select>
          </a-form-item>
        </a-tab-pane>
        <a-tab-pane key="2" force-render>
          <template #tab>
            <span>
              <file-add-outlined />
              新建表
            </span>
          </template>
          <!-- <a-form-item
            label="数据库名称"
            name="databaseName"
            :rules="[{ required: true, message: '请输入数据库名称!' }]"
          >
            <a-input v-model:value="formState.databaseName" />
          </a-form-item> -->
          <a-form-item
            label="数据表名称"
            name="databaseTableName"
            :rules="[{ required: true, message: '请输入数据表名称!' }]"
          >
            <a-input v-model:value="formState.databaseTableName" />
          </a-form-item>
        </a-tab-pane>
      </a-tabs>
    </a-form>
  </Drawer>
</template>
<script setup>
  import { ref, reactive, onMounted } from 'vue';
  import { Drawer, Button } from 'ant-design-vue';
  import { FileAddOutlined, FileOutlined } from '@ant-design/icons-vue';
  const props = defineProps({
    configData: Object,
    graphData: Object,
  });
  const emit = defineEmits(['closeStart', 'saveStart']);
  const nodeType = ref(props.configData.properties.type);
  const visible = ref(true);
  const size = ref('default');
  const value = ref('');
  const activeKey = ref('1');
  const startNode = reactive({ data: {} });
  const formState = reactive({
    operatorName: props.configData.text.value,
    fload: '',
    databaseTableName: props.configData.properties
      ? props.configData.properties.databaseTableName
      : '',
    databaseName: '',
    dataKind: 'new',
  });
  const onClose = () => {
    visible.value = false;
    let data = props.configData;
    data.properties = {
      value,
    };
    emit('closeStart', data);
  };
  const onSave = () => {
    // 算子名称 saveStart
    let data = {
      operatorName: formState.operatorName,
      databaseTableName: formState.databaseTableName,
      type: props.configData.properties.type,
    };
    let node = props.configData;
    node.text.value = data.operatorName;
    node.properties = data;
    emit('saveStart', node);
  };
  onMounted(async () => {
    const node = props.configData;
    const targetNodeId = node.id;
    const graphData = props.graphData;
    if (graphData.edges.length > 0) {
      const edges = graphData.edges;
      console.log('edges', edges);
      const seflEdge = edges.filter((item) => {
        return item.targetNodeId == targetNodeId;
      });
      const operatorOutputList = [];
      seflEdge.forEach((edge) => {
        const key = graphData.nodes.find((node) => {
          return node.id == edge.sourceNodeId;
        });
        operatorOutputList.push(key);
      });
      startNode.data = operatorOutputList[0];
    }
    console.log('node', node);
    console.log('graphData', graphData);
    console.log('startNode', startNode);
  });
</script>
