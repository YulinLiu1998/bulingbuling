<template>
  <div style="height: 50%">
    <div class="global-header" style="width: 200px">
      <p>任务栏列表</p>
      <Button type="primary" size="small" @click="addFolder" shape="circle">
        <template #icon>
          <PlusOutlined />
        </template>
      </Button>
    </div>
    <div class="global-search-wrapper" style="width: 200px">
      <AutoComplete
        v-model:value="value"
        :dropdown-match-select-width="180"
        class="aluto-input-box"
        :options="dataSource"
        @select="onSelect"
        @search="handleSearch"
      >
        <template #option="item">
          <div style="display: flex; justify-content: space-between">
            <span>
              Found {{ item.query }} on
              <a
                :href="`https://s.taobao.com/search?q=${item.query}`"
                target="_blank"
                rel="noopener noreferrer"
              >
                {{ item.category }}
              </a>
            </span>
            <span>{{ item.count }} results</span>
          </div>
        </template>
        <InputSearch placeholder="查询任务" enter-button />
      </AutoComplete>
    </div>
    <Tree
      v-model:expandedKeys="expandedKeys"
      v-model:selectedKeys="selectedKeys"
      :tree-data="treeData.data"
      @right-click="righrClick"
      @select="treeSelect"
      class="topTree"
    >
      <template #meh>
        <FileOutlined />
      </template>
      <template #switcherIcon><FolderOpenOutlined /></template>
      <template #title="{ key: treeKey, title }">
        <a-dropdown :trigger="['contextmenu']">
          <span>{{ title }}</span>
          <template #overlay>
            <a-menu
              v-if="rightVisible"
              @click="({ key: menuKey }) => onContextMenuClick(0, menuKey, treeKey)"
            >
              <a-menu-item key="1">删除</a-menu-item>
              <a-menu-item key="2">运行</a-menu-item>
            </a-menu>
            <a-menu v-else @click="({ key: menuKey }) => onContextMenuClick(1, menuKey, treeKey)">
              <a-menu-item key="2">添加</a-menu-item>
              <a-menu-item key="1">删除</a-menu-item>
            </a-menu>
          </template>
        </a-dropdown>
      </template>
    </Tree>
    <a-modal
      v-model:visible="visibleModal"
      :title="TitleModal"
      @cancel="Modalhandlecancel"
      @ok="ModalhandleOk"
    >
      <div class="modal" v-if="ModeType">
        <a-form
          :model="formState"
          name="basic"
          :label-col="{ span: 6 }"
          :wrapper-col="{ span: 10 }"
          autocomplete="off"
        >
          <a-form-item
            label="任务名称"
            name="taskname"
            :rules="[{ required: true, message: '请输入任务名称!' }]"
          >
            <a-input v-model:value="formState.taskname" />
          </a-form-item>
        </a-form>
      </div>
      <div class="modal" v-if="ModeFload">
        <a-form
          :model="formState"
          name="basic"
          :label-col="{ span: 6 }"
          :wrapper-col="{ span: 10 }"
          autocomplete="off"
        >
          <a-form-item
            label="任务文件夹名称"
            name="fload"
            :rules="[{ required: true, message: '请输入任务文件夹名称!' }]"
          >
            <a-input v-model:value="formState.fload" />
          </a-form-item>
        </a-form>
      </div>
      <div class="modal" v-if="ModeRun">
        <a-form name="basic" :label-col="{ span: 6 }" :wrapper-col="{ span: 10 }">
          <a-form-item
            label="任务名称"
            name="fload"
            :rules="[{ required: true, message: '请输入任务文件夹名称!' }]"
          >
            <span style="font-size: 14px; font-weight: 400"> {{ flowChartDataState.name }}</span>
          </a-form-item>
        </a-form>
      </div>
    </a-modal>
  </div>
</template>
<script lang="ts" setup>
  import { ref, watch, reactive, onMounted } from 'vue';
  import { AutoComplete, InputSearch, Tree, Button } from 'ant-design-vue';
  import { FileOutlined, FolderOpenOutlined, PlusOutlined } from '@ant-design/icons-vue';
  import { useFlowChartDataStore } from '/@/store/module/flowChartData';
  import { storeToRefs } from 'pinia';

  interface Option {
    query: string;
    category: string;
    value: string;
    count: number;
  }
  const flowChartDataState = useFlowChartDataStore();
  const { flowChartData } = storeToRefs(flowChartDataState);
  const value = ref('');
  const dataSource = ref<Option[]>([]);
  const onSelect = (value: string) => {
    console.log('onSelect', value);
  };
  const visibleModal = ref<boolean>(false);
  const TitleModal = ref('Modal');
  const ModeType = ref(false);
  const ModeFload = ref(false);
  const ModeRun = ref(false);
  const formState = reactive({
    taskname: '',
    fload: '',
  });
  const getRandomInt = (max: number, min = 0) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  const searchResult = (query: string): Option[] => {
    return new Array(getRandomInt(5))
      .join('.')
      .split('.')
      .map((_item, idx) => ({
        query,
        category: `${query}${idx}`,
        value: `${query}${idx}`,
        count: getRandomInt(200, 100),
      }));
  };
  const handleSearch = (val: string) => {
    dataSource.value = val ? searchResult(val) : [];
  };
  //树结构
  const expandedKeys = ref<string[]>([]);
  const selectedKeys = ref<string[]>([]);
  const chooseFatherKey = ref('0');
  const chooseKey = ref('0');
  const rightVisible = ref(true);
  let treeData = reactive({
    data: [
      {
        title: '系统模板',
        key: '0',
        slots: { icon: 'switcherIcon' },
        children: [
          {
            title: '风险行程轨迹检测',
            key: '0-1',
            isLeaf: true,
            slots: { icon: 'meh' },
          },
          {
            title: '路网匹配',
            key: '0-2',
            isLeaf: true,
            slots: { icon: 'meh' },
          },
        ],
      },
    ],
  });
  const onContextMenuClick = (type: number, menuKey: string | number, treeKey: number) => {
    console.log(`treeKey: ${treeKey}, menuKey: ${menuKey}`);
    chooseKey.value = String(treeKey);
    chooseFatherKey.value = 'del';
    if (!ModeFload.value && !ModeType.value) {
      let key = String(treeKey).split('-');
      if (key.length === 2) {
        chooseFatherKey.value = key[0];
      }
    }
    ModeFload.value = false;
    if (type == 0) {
      // 子节点删除
      if (menuKey == 1) {
        TitleModal.value = '请确认是否删除当前任务！';
        ModeType.value = false;
      } else if (menuKey == 2) {
        TitleModal.value = '请确认是否删除当前任务！';
        ModeRun.value = true;
      }
    } else {
      // 父节点
      if (menuKey == 1) {
        TitleModal.value = '请确认是否删除当前文件夹！';
        ModeType.value = false;
      } else {
        TitleModal.value = '添加任务文件';
        ModeType.value = true;
      }
    }
    visibleModal.value = true;
  };
  watch(expandedKeys, () => {
    console.log('expandedKeys', expandedKeys);
  });
  const righrClick = (info) => {
    console.log(info);
    if (info.node.isLeaf) {
      rightVisible.value = true;
    } else {
      rightVisible.value = false;
    }
  };
  //modal

  const ModalhandleOk = () => {
    if (ModeFload.value) {
      //添加文件夹
      let key = parseInt(treeData.data[treeData.data.length - 1].key);
      key = key + 1;
      let info = {
        title: formState.fload,
        key: String(key),
        slots: { icon: 'meh' },
        children: [],
      };
      console.log(info);
      treeData.data.push(info);
    } else if (ModeType.value) {
      console.log('添加文件', chooseKey);
      let len = treeData.data[chooseKey.value].children.length + 1;
      let info = {
        title: formState.taskname,
        key: `${chooseKey.value}-${len}`,
        isLeaf: true,
        slots: { icon: 'meh' },
      };
      let index = 0;
      treeData.data.forEach((item, ind) => {
        if (item.key == `${chooseKey.value}`) {
          index = ind;
        }
      });
      treeData.data[index].children.push(info);
    } else if (ModeRun.value) {
      // 当前的flowChart
      console.log('flowChartData', flowChartData);
    } else {
      // 删除操作
      console.log(chooseFatherKey.value, chooseKey.value);
      if (chooseFatherKey.value != 'del') {
        let index = 0;
        treeData.data.forEach((item, ind) => {
          if (item.key == `${chooseFatherKey.value}`) {
            index = ind;
          }
        });
        treeData.data[index].children = treeData.data[index].children.filter((item) => {
          return chooseKey.value != item.key;
        });
      } else {
        let index = 0;
        treeData.data.forEach((item, ind) => {
          if (item.key == `${chooseKey.value}`) {
            index = ind;
          }
        });
        treeData.data.splice(index, 1);
      }
    }
    localStorage.setItem('taskList', JSON.stringify(treeData.data));
    visibleModal.value = false;
    formState.taskname = '';
    formState.fload = '';
    ModeType.value = false;
    ModeFload.value = false;
    ModeRun.value = false;
  };
  const Modalhandlecancel = () => {
    visibleModal.value = false;
    formState.taskname = '';
    formState.fload = '';
    ModeType.value = false;
    ModeFload.value = false;
  };
  const addFolder = () => {
    visibleModal.value = true;
    TitleModal.value = '您正在添加任务栏文件夹';
    ModeFload.value = true;
    formState.taskname = '';
  };
  const treeSelect = (key, e) => {
    console.log(key, e.node.title);
    flowChartDataState.changeKey(key);
    flowChartDataState.changeName(e.node.title);
  };
  onMounted(() => {
    const taskList = localStorage.getItem('taskList');
    if (taskList) {
      treeData.data = JSON.parse(taskList);
    }
  });
</script>

<style lang="less" scoped>
  .global-header {
    display: flex;
    padding: 5px 12px 0px 5px;
    justify-content: space-between;
    align-items: center;
    margin: 0;

    p {
      font-weight: bold;
      font-size: 16px;
      margin: 0;
    }
  }

  .global-search-wrapper {
    height: 50px;
    padding: 10px;

    .aluto-input-box {
      width: 100%;

      .ant-input-lg {
        padding: 0;
        font-size: 14px;
      }
    }
  }

  .modal {
    padding: 30px 10px 10px 10px;
  }
</style>
<style>
  .ant-tree-indent-unit {
    width: 0;
  }
</style>
