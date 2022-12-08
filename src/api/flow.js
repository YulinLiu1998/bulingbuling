import { defHttp } from '/@/utils/http/axios';
export const getList = (params) => {
  return defHttp.get(
    {
      url: '/hello',
      params,
    },
    {
      //配置这个就可代理 上面的路径了
      apiUrl: '/flow-api',
    },
  );
};
export const getPersonTableList = (params) => {
  return defHttp.get(
    {
      url: '/tables',
      params,
    },
    {
      //配置这个就可代理 上面的路径了
      apiUrl: '/flow-api',
    },
  );
};
export const executeFlow = (params) => {
  return defHttp.request(
    {
      url: '/flow',
      method: 'POST',
      params,
    },
    {
      //配置这个就可代理 上面的路径了
      apiUrl: '/flow-api',
    },
  );
};
export const uploadFile = (params) => {
  return defHttp.request(
    {
      url: '/upload',
      method: 'POST',
      params,
      headers: { 'Content-Type': 'multipart/form-data' },
    },
    {
      //配置这个就可代理 上面的路径了
      apiUrl: '/flow-api',
    },
  );
};
