import 'virtual:windi-base.css';
import 'virtual:windi-components.css';
import '/@/design/index.less';
import 'virtual:windi-utilities.css';
// Register icon sprite
import 'virtual:svg-icons-register';
import App from './App.vue';
import { createApp } from 'vue';
import { initAppConfigStore } from '/@/logics/initAppConfig';
import { setupErrorHandle } from '/@/logics/error-handle';
import { router, setupRouter } from '/@/router';
import { setupRouterGuard } from '/@/router/guard';
import { setupStore } from '/@/store';
import { setupGlobDirectives } from '/@/directives';
import { setupI18n } from '/@/locales/setupI18n';
import { registerGlobComp } from '/@/components/registerGlobComp';
import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/antd.css';
// import VueSocketIO from 'vue-socket.io';
// import socketIO from 'socket.io-client';
// import { registerSockets, destroySockets } from './sockets';

// const socketio = new VueSocketIO({
//   debug: true,
//   connection: socketIO('http://127.0.0.1:5000', {
//     autoConnect: true,
//   }),
// });

async function bootstrap() {
  const app = createApp(App);
  // Configure store
  // 配置 store
  setupStore(app);

  // Initialize internal system configuration
  // 初始化内部系统配置
  initAppConfigStore();

  // Register global components
  // 注册全局组件
  registerGlobComp(app);

  // Multilingual configuration
  // 多语言配置
  // Asynchronous case: language files may be obtained from the server side
  // 异步案例：语言文件可能从服务器端获取
  await setupI18n(app);

  // Configure routing
  // 配置路由
  setupRouter(app);

  // router-guard
  // 路由守卫
  setupRouterGuard(router);

  // Register global directive
  // 注册全局指令
  setupGlobDirectives(app);

  // Configure global error handling
  // 配置全局错误处理
  setupErrorHandle(app);

  // https://next.router.vuejs.org/api/#isready
  // await router.isReady();
  // // 便于在任意位置获取到 socket 对象
  // app.config.globalProperties.$socket = socketio;

  // // 监听事件
  // app.config.globalProperties.$addSockets = registerSockets;
  // // 移除事件
  // app.config.globalProperties.$removeSockets = destroySockets;
  app.use(Antd).mount('#app');
}

bootstrap();
