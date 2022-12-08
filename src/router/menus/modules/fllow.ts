import type { MenuModule } from '/@/router/types';

const menuFllow: MenuModule = {
  orderNo: 10,
  menu: {
    name: '流程图',
    path: '/fllow',

    children: [
      {
        path: 'index',
        name: '流程图页面',
      },
    ],
  },
};
export default menuFllow;
