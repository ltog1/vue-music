import axios from 'axios'
import { commonParams } from './config'

axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

axios.interceptors.request.use(config => {
  const { params = {}, data = {}, method } = config;
  config.params = Object.assign(params, data, commonParams);

  // if (method === 'post') {
  //   config.data = qs.stringify(Object.assign({}, data, params));
  // }

  return config;
});

axios.interceptors.response.use(res => {
  return res.data;
});

export default {
  install() {

  }
}