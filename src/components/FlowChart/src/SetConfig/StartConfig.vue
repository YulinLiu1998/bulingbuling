<template>
  <Drawer :title="nodeType" :size="size" :visible="visible" @close="onClose">
    <template #extra>
      <Button style="margin-right: 8px" @click="onClose">取消</Button>
      <Button type="primary" @click="onSave(configData)">保存</Button>
    </template>
    <a-form
      :model="formState"
      name="basic"
      :label-col="{ span: 7 }"
      :wrapper-col="{ span: 15 }"
      autocomplete="off"
      labelAlign="left"
    >
      <a-form-item
        label="算子名称"
        name="operatorName"
        :rules="[{ required: true, message: '请输入任务名称!' }]"
      >
        <a-input v-model:value="formState.operatorName" />
      </a-form-item>
      <p>数据输入选择：</p>
      <a-tabs v-model:activeKey="activeKey">
        <a-tab-pane key="1" force-render>
          <template #tab>
            <span>
              <database-outlined />
              数据选择
            </span>
          </template>
          <a-form-item
            name="dataKind"
            label="数据类型:"
            :label-col="{ span: 7 }"
            :wrapper-col="{ span: 15 }"
            has-feedback
            :rules="[{ required: true, message: '请选择数据类型!' }]"
          >
            <a-select v-model:value="formState.dataKind" placeholder="Please select a country">
              <a-select-option value="exist">已有表</a-select-option>
              <a-select-option value="new">新建表</a-select-option>
            </a-select>
          </a-form-item>
          <!-- <a-form-item
            v-if="formState.dataKind !== 'new'"
            name="databaseName"
            label="数据库名称:"
            :label-col="{ span: 7 }"
            :wrapper-col="{ span: 10 }"
            has-feedback
            :rules="[{ required: true, message: '请选择数据库名称!' }]"
          >
            <a-select v-model:value="formState.databaseName" placeholder="Please select a country">
              <a-select-option value="china">China</a-select-option>
              <a-select-option value="usa">U.S.A</a-select-option>
            </a-select>
          </a-form-item> -->
          <a-form-item
            v-if="formState.dataKind !== 'new'"
            name="databaseTableName"
            label="数据表名称:"
            :label-col="{ span: 7 }"
            :wrapper-col="{ span: 15 }"
            has-feedback
            :rules="[{ required: true, message: 'Please select your country!' }]"
          >
            <a-select v-model:value="formState.databaseTableName" placeholder="请选择数据表">
              <template v-for="tableItem in tableList.data" :key="tableItem.id">
                <a-select-option :value="tableItem.name">{{ tableItem.name }}</a-select-option>
              </template>
            </a-select>
          </a-form-item>
          <!-- <a-form-item
            v-if="formState.dataKind == 'new'"
            label="数据库名称:"
            name="databaseName"
            :label-col="{ span: 7 }"
            :wrapper-col="{ span: 10 }"
            :rules="[{ required: true, message: '请输入数据库名称!' }]"
          >
            <a-input v-model:value="formState.databaseName" />
          </a-form-item> -->
          <a-form-item
            v-if="formState.dataKind == 'new'"
            label="数据表名称:"
            name="databaseTableName"
            :label-col="{ span: 7 }"
            :wrapper-col="{ span: 10 }"
            :rules="[{ required: true, message: '请输入数据表名称!' }]"
          >
            <a-input v-model:value="formState.databaseTableName" />
          </a-form-item>
        </a-tab-pane>
        <a-tab-pane key="2">
          <template #tab>
            <span>
              <upload-outlined />
              文件上传
            </span>
          </template>
          <a-upload-dragger
            v-model:fileList="fileList"
            name="file"
            :multiple="true"
            :headers="headers"
            :customRequest="customRequest"
            :showUploadList="false"
            @change="handleChange"
            :beforeUpload="beforeUpload"
          >
            <!-- action="http://127.0.0.1:5000/upload" -->
            <p class="ant-upload-drag-icon">
              <inbox-outlined />
            </p>
            <p class="ant-upload-text">单击或拖动文件到此区域进行上传</p>
            <p class="ant-upload-hint"> 支持单次或批量上传。 </p>
            <div v-for="item in fileListAll.data" :key="item.id" class="fileText">
              {{ item.name }}
            </div>
          </a-upload-dragger>
        </a-tab-pane>
      </a-tabs>
    </a-form>
  </Drawer>
</template>
<script setup>
  import { ref, reactive, onMounted } from 'vue';
  import { Drawer, Button, message } from 'ant-design-vue';
  // import { message } from 'ant-design-vue';
  import { UploadOutlined, DatabaseOutlined, InboxOutlined } from '@ant-design/icons-vue';
  import { getPersonTableList, uploadFile } from '/@/api/flow';
  import { deepCopy } from 'windicss/utils';
  const props = defineProps({
    configData: Object,
  });
  const nodeType = ref(props.configData.properties.type);

  const headers = { 'Content-Type': 'multipart/form-data' };
  const emit = defineEmits(['closeStart', 'saveStart']);
  const visible = ref(true);
  const size = ref('default');
  const value = ref('');
  const activeKey = ref('1');
  const tableList = reactive({
    data: [],
  });
  const formState = reactive({
    operatorName: props.configData.text.value,
    fload: '',
    databaseTableName: props.configData.properties
      ? props.configData.properties.databaseTableName
      : '',
    databaseName: '',
    dataKind: 'exist',
  });
  const onClose = () => {
    visible.value = false;
    let data = props.configData;
    data.properties = {
      value,
    };
    emit('closeStart', data);
  };
  const onSave = (configData) => {
    console.log(configData);
    // 算子名称 saveStart
    let data = {
      operatorName: formState.operatorName,
      databaseTableName: formState.databaseTableName,
      type: nodeType.value,
    };
    let node = deepCopy(configData);
    node.text.value = data.operatorName;
    node.properties = data;
    emit('saveStart', node);
  };
  // 上传
  const fileList = ref([]);
  const handleChange = (info) => {
    if (info.file.status !== 'uploading') {
      console.log(info.file, info.fileList);
    }
    if (info.file.status === 'done') {
      message.success(`${info.file.name} file uploaded successfully`);
    } else if (info.file.status === 'error') {
      message.error(`${info.file.name} file upload failed.`);
    }
  };
  const fileListAll = reactive({
    data: [],
  });
  const customRequest = async (file) => {
    const fd = new FormData();
    fd.append('file', file.file);
    console.log(file);
    const res = await uploadFile(fd);
    console.log('res', res);
    file.onSuccess(res, file.file);
  };
  const beforeUpload = (file, fileList) => {
    console.log(file, fileList);
    fileListAll.data = fileList;
    return true;
  };
  onMounted(async () => {
    let value = await getPersonTableList();
    tableList.data = value;
  });
</script>
<style lang="less" scoped>
  .fileText {
    height: 32px;
    width: 100%;
    color: rgb(91, 226, 100);
    font-size: 16px;
    text-align: left;
    padding-left: 20px;
  }
</style>
