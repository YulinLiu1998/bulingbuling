import type { AppRouteModule } from '/@/router/types';

import { LAYOUT } from '/@/router/constant';

const about: AppRouteModule = {
  path: '/fllow',
  name: 'Fllow',
  component: LAYOUT,
  redirect: '/fllow/index',
  meta: {
    hideChildrenInMenu: true,
    icon: 'simple-icons:about-dot-me',
    title: '流程图页面',
    orderNo: 100000,
  },
  children: [
    {
      path: 'index',
      name: 'FllowPage',
      component: () => import('/@/views/sys/about/index.vue'),
      meta: {
        title: '流程图页面',
        icon: 'simple-icons:about-dot-me',
        hideMenu: true,
      },
    },
  ],
};

export default about;
