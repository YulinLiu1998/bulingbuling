<template>
  <Drawer :title="nodeType" :size="size" :visible="visible" @close="onClose">
    <template #extra>
      <Button style="margin-right: 8px" @click="onClose">取消</Button>
      <Button type="primary" @click="onSave">保存</Button>
    </template>
    <a-form
      :model="formState"
      name="basic"
      :label-col="{ span: 7 }"
      :wrapper-col="{ span: 13 }"
      autocomplete="off"
      labelAlign="left"
    >
      <a-form-item
        label="算子名称"
        name="operatorName"
        :label-col="{ span: 7 }"
        :wrapper-col="{ span: 13 }"
        :rules="[{ required: true, message: '请输入该算子名称!' }]"
      >
        <a-input v-model:value="formState.operatorName" />
      </a-form-item>

      <div v-if="nodeType == '风险行程轨迹算法'">
        <!-- 算子数据来源 -->
        <a-form-item
          name="operatorInput"
          label="数据来源:"
          :label-col="{ span: 7 }"
          :wrapper-col="{ span: 13 }"
          has-feedback
          :rules="[{ required: true, message: '请选择数据类型!' }]"
        >
          <a-select
            v-for="operatorInputItem in operatorInputList.data"
            :key="operatorInputItem.id"
            v-model:value="formState.operatorInput"
            placeholder="Please select a country"
          >
            <a-select-option :value="operatorInputItem.id">{{
              operatorInputItem.text.value
            }}</a-select-option>
          </a-select>
        </a-form-item>
        <!-- 算子执行参数 -->
        <a-form-item
          name="operatorParams"
          label="算子执行参数:"
          :label-col="{ span: 7 }"
          :wrapper-col="{ span: 13 }"
          has-feedback
        >
          <span>{{ nodeType ? nodeType : '您未进行选择！' }}</span>
        </a-form-item>
        <a-form-item
          name="maxDistance"
          label="最大距离(米):"
          :label-col="{ span: 7 }"
          :wrapper-col="{ span: 13 }"
          style="margin-bottom: 8px"
        >
          <a-input v-model:value.number="formState.maxDistance" />
        </a-form-item>
        <a-form-item
          name="maxTime"
          label="最大时间(分):"
          :label-col="{ span: 7 }"
          :wrapper-col="{ span: 13 }"
        >
          <a-input v-model:value.number="formState.maxTime" />
        </a-form-item>
      </div>
      <div v-if="nodeType == '数据预处理算子'">
        <!-- 算子数据来源 -->
        <a-form-item
          name="operatorInput"
          label="数据来源:"
          :label-col="{ span: 7 }"
          :wrapper-col="{ span: 13 }"
          has-feedback
          :rules="[{ required: true, message: '请选择数据类型!' }]"
        >
          <a-select
            v-for="operatorInputItem in operatorInputList.data"
            :key="operatorInputItem.id"
            v-model:value="formState.operatorInput"
            placeholder="Please select a country"
          >
            <a-select-option :value="operatorInputItem.id">{{
              operatorInputItem.text.value
            }}</a-select-option>
          </a-select>
        </a-form-item>
        <!-- 算子执行参数 -->
        <a-form-item
          name="operatorParams"
          label="算子执行参数:"
          :label-col="{ span: 7 }"
          :wrapper-col="{ span: 13 }"
          has-feedback
        >
          <span>{{ nodeType ? nodeType : '您未进行选择！' }}</span>
        </a-form-item>
        <a-form-item :label-col="{ span: 7 }" :wrapper-col="{ span: 13 }" label="数据类型">
          <a-select v-model:value="formState.dataType" placeholder="please select your zone">
            <a-select-option value="轨迹数据">轨迹数据</a-select-option>
            <a-select-option value="路网数据">路网数据</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item
          :label-col="{ span: 7 }"
          :wrapper-col="{ span: 13 }"
          v-if="formState.dataType == '轨迹数据'"
          label="时间间隔(分)"
        >
          <a-input v-model:value="formState.timeInterval" />
        </a-form-item>
        <a-form-item
          name="operatorParams"
          label="筛选时域特征："
          v-if="formState.dataType == '轨迹数据'"
          :label-col="{ span: 7 }"
          :wrapper-col="{ span: 13 }"
          has-feedback
        >
          <span>若不填写则默认全部</span>
        </a-form-item>
        <a-form-item
          name="operatorParams"
          label="截取区域范围："
          v-if="formState.dataType == '路网数据'"
          :label-col="{ span: 7 }"
          :wrapper-col="{ span: 13 }"
          has-feedback
        >
          <span>若不填写则默认全部</span>
        </a-form-item>
        <a-form-item
          :label-col="{ span: 7 }"
          :wrapper-col="{ span: 13 }"
          v-if="formState.dataType == '轨迹数据'"
          label="开始时间"
        >
          <a-date-picker
            v-model:value="formState.startTime"
            show-time
            format="YYYY-MM-DD HH:mm:ss"
            value-format="YYYY-MM-DD HH:mm:ss"
          />
        </a-form-item>
        <a-form-item
          :label-col="{ span: 7 }"
          :wrapper-col="{ span: 13 }"
          v-if="formState.dataType == '轨迹数据'"
          label="结束时间"
        >
          <a-date-picker
            v-model:value="formState.endTime"
            show-time
            format="YYYY-MM-DD HH:mm:ss"
            value-format="YYYY-MM-DD HH:mm:ss"
          />
        </a-form-item>
        <a-form-item :label-col="{ span: 7 }" :wrapper-col="{ span: 13 }" label="最小经度">
          <a-input v-model:value="formState.minLng" />
        </a-form-item>
        <a-form-item :label-col="{ span: 7 }" :wrapper-col="{ span: 13 }" label="最大经度">
          <a-input v-model:value="formState.maxLng" />
        </a-form-item>
        <a-form-item :label-col="{ span: 7 }" :wrapper-col="{ span: 13 }" label="最小纬度">
          <a-input v-model:value="formState.minLat" />
        </a-form-item>
        <a-form-item :label-col="{ span: 7 }" :wrapper-col="{ span: 13 }" label="最大纬度">
          <a-input v-model:value="formState.maxLat" />
        </a-form-item>
      </div>
      <div v-if="nodeType == '路网匹配算法'">
        <!-- 算子数据来源 -->
        <a-form-item
          name="trajectoryInput"
          label="轨迹数据来源:"
          :label-col="{ span: 8 }"
          :wrapper-col="{ span: 13 }"
          has-feedback
          :rules="[{ required: true, message: '请选择数据类型!' }]"
        >
          <a-select v-model:value="formState.trajectoryInput" placeholder="请选择数据源！">
            <a-select-option
              v-for="operatorInputItem in operatorInputList.data"
              :key="operatorInputItem.id"
              :value="operatorInputItem.id"
              >{{ operatorInputItem.text.value }}</a-select-option
            >
          </a-select>
        </a-form-item>
        <a-form-item
          name="roadNetInput"
          label="路网数据来源:"
          :label-col="{ span: 8 }"
          :wrapper-col="{ span: 13 }"
          has-feedback
          :rules="[{ required: true, message: '请选择数据类型!' }]"
        >
          <a-select v-model:value="formState.roadNetInput" placeholder="请选择数据源！">
            <a-select-option
              v-for="operatorInputItem in operatorInputList.data"
              :key="operatorInputItem.id"
              :value="operatorInputItem.id"
              >{{ operatorInputItem.text.value }}</a-select-option
            >
          </a-select>
        </a-form-item>
        <a-form-item
          name="operatorParams"
          label="算子执行参数:"
          :label-col="{ span: 7 }"
          :wrapper-col="{ span: 13 }"
          has-feedback
        >
          <span>{{ nodeType ? nodeType : '您未进行选择！' }}</span>
        </a-form-item>
        <!-- 算子执行参数 -->
        <a-form-item name="radio-group" label="模式选择">
          <a-radio-group v-model:value="formState.roadNetMode">
            <a-radio value="all">全部轨迹数据</a-radio>
            <a-radio value="stay">只匹配驻点位</a-radio>
            <a-radio value="move">只匹配移动点位</a-radio>
          </a-radio-group>
        </a-form-item>
        <a-form-item
          name="maxTime"
          label="映射误差(米):"
          :label-col="{ span: 7 }"
          :wrapper-col="{ span: 13 }"
        >
          <a-input placeholder="默认为50米" v-model:value.number="formState.error" />
        </a-form-item>
        <a-form-item
          name="maxTime"
          label="转换概率:"
          :label-col="{ span: 7 }"
          :wrapper-col="{ span: 13 }"
        >
          <a-input placeholder="默认为2" v-model:value.number="formState.transition" />
        </a-form-item>
      </div>
      <div v-if="nodeType == '逆地理地址解码'">
        <!-- 算子数据来源 -->
        <a-form-item
          name="operatorInput"
          label="数据来源:"
          :label-col="{ span: 7 }"
          :wrapper-col="{ span: 13 }"
          has-feedback
          :rules="[{ required: true, message: '请选择数据类型!' }]"
        >
          <a-select v-model:value="formState.operatorInput" placeholder="Please select a country">
            <a-select-option
              v-for="operatorInputItem in operatorInputList.data"
              :key="operatorInputItem.id"
              :value="operatorInputItem.id"
              >{{ operatorInputItem.text.value }}</a-select-option
            >
          </a-select>
        </a-form-item>
        <!-- 算子执行参数 -->
        <a-form-item
          name="operatorParams"
          label="算子执行参数:"
          :label-col="{ span: 7 }"
          :wrapper-col="{ span: 13 }"
          has-feedback
        >
          <span>{{ nodeType ? nodeType : '您未进行选择！' }}</span>
        </a-form-item>
        <a-form-item name="地址解析模式" label="地址解析模式">
          <a-checkbox-group v-model:value="formState.geoCode">
            <a-row>
              <a-col :span="24">
                <a-checkbox value="province" style="line-height: 32px">所在省</a-checkbox>
              </a-col>
              <a-col :span="24">
                <a-checkbox value="city" style="line-height: 32px">所在城市</a-checkbox>
              </a-col>
              <a-col :span="24">
                <a-checkbox value="district" style="line-height: 32px">所在区</a-checkbox>
              </a-col>
              <a-col :span="24">
                <a-checkbox value="township" style="line-height: 32px">所在乡镇</a-checkbox>
              </a-col>
              <a-col :span="24">
                <a-checkbox value="street" style="line-height: 32px">所在街道</a-checkbox>
              </a-col>
              <a-col :span="24">
                <a-checkbox value="streetNumber" style="line-height: 32px">门牌号</a-checkbox>
              </a-col>
              <a-col :span="24">
                <a-checkbox value="distance" style="line-height: 32px">距离方向</a-checkbox>
              </a-col>
              <a-col :span="24">
                <a-checkbox value="formatted_address" style="line-height: 32px"
                  >标准地址</a-checkbox
                >
              </a-col>
            </a-row>
          </a-checkbox-group>
        </a-form-item>
      </div>
    </a-form>
  </Drawer>
</template>
<script setup>
  import { ref, reactive, onMounted } from 'vue';
  import { Drawer, Button } from 'ant-design-vue';
  const props = defineProps({
    configData: Object,
    graphData: Object,
  });
  const nodeType = ref(props.configData.properties.type);
  const emit = defineEmits(['closeStart', 'saveStart']);
  const visible = ref(true);
  const size = ref('default');
  const value = ref('');
  const startNode = reactive({ data: {} });
  const operatorInputList = reactive({ data: [] });
  const formState = reactive({
    operatorName: props.configData.text.value,
    fload: '',
    maxDistance: props.configData.properties.maxDistance
      ? props.configData.properties.maxDistance
      : '',
    maxTime: props.configData.properties.maxTime ? props.configData.properties.maxTime : '',
    operatorInput: props.configData.properties.operatorInput
      ? props.configData.properties.operatorInput
      : '',
    dataType: props.configData.properties.dataType
      ? props.configData.properties.dataType
      : '轨迹数据',
    timeInterval: props.configData.properties.timeInterval
      ? props.configData.properties.timeInterval
      : '',
    startTime: props.configData.properties.startTime ? props.configData.properties.startTime : '',
    endTime: props.configData.properties.endTime ? props.configData.properties.endTime : '',
    minLng: props.configData.properties.minLng ? props.configData.properties.minLng : '',
    maxLng: props.configData.properties.maxLng ? props.configData.properties.maxLng : '',
    minLat: props.configData.properties.minLat ? props.configData.properties.minLat : '',
    maxLat: props.configData.properties.maxLat ? props.configData.properties.maxLat : '',
    trajectoryInput: props.configData.properties.trajectoryInput
      ? props.configData.properties.trajectoryInput
      : '',
    roadNetInput: props.configData.properties.roadNetInput
      ? props.configData.properties.roadNetInput
      : '',
    roadNetMode: props.configData.properties.roadNetMode
      ? props.configData.properties.roadNetMode
      : '',
    geoCode: props.configData.properties.geoCode ? props.configData.properties.geoCode : [],
    error: props.configData.properties.error ? props.configData.properties.error : '',
    transition: props.configData.properties.transition
      ? props.configData.properties.transition
      : '',
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
    let data = {};
    let node = {};
    if (nodeType.value == '风险行程轨迹算法') {
      data = {
        operatorName: formState.operatorName,
        maxTime: formState.maxTime,
        maxDistance: formState.maxDistance,
        operatorInput: formState.operatorInput,
        type: nodeType.value,
      };
      node = props.configData;
      node.text.value = data.operatorName;
      node.properties = data;
    } else if (nodeType.value == '数据预处理算子') {
      if (formState.dataType == '轨迹数据') {
        data = {
          dataType: formState.dataType,
          timeInterval: formState.timeInterval,
          operatorInput: formState.operatorInput,
          operatorName: formState.operatorName,
          type: nodeType.value,
          startTime: formState.startTime,
          endTime: formState.endTime,
          minLng: formState.minLng,
          maxLng: formState.maxLng,
          minLat: formState.minLat,
          maxLat: formState.maxLat,
        };
      } else {
        data = {
          operatorInput: formState.operatorInput,
          operatorName: formState.operatorName,
          type: nodeType.value,
          dataType: formState.dataType,
          minLng: formState.minLng,
          maxLng: formState.maxLng,
          minLat: formState.minLat,
          maxLat: formState.maxLat,
        };
      }
      node = props.configData;
      node.text.value = data.operatorName;
      node.properties = data;
    } else if (nodeType.value == '路网匹配算法') {
      data = {
        dataType: formState.dataType,
        trajectoryInput: formState.trajectoryInput,
        roadNetInput: formState.roadNetInput,
        operatorName: formState.operatorName,
        type: nodeType.value,
        roadNetMode: formState.roadNetMode,
        transition: formState.transition,
        error: formState.error,
      };
      node = props.configData;
      node.text.value = data.operatorName;
      node.properties = data;
    } else if (nodeType.value == '逆地理地址解码') {
      data = {
        operatorInput: formState.operatorInput,
        operatorName: formState.operatorName,
        type: nodeType.value,
        geoCode: formState.geoCode,
      };
      node = props.configData;
      node.text.value = data.operatorName;
      node.properties = data;
    }

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

      seflEdge.forEach((edge) => {
        const key = graphData.nodes.find((node) => {
          return node.id == edge.sourceNodeId;
        });
        operatorInputList.data.push(key);
      });
    }
    console.log('node', node);
    console.log('graphData', graphData);
    console.log('startNode', startNode);
    console.log('operatorInputList', operatorInputList);
  });
</script>
