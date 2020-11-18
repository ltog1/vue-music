import axios from 'axios'
import { commonParams } from './config'

axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

axios.interceptors.request.use(config => {
  const { params = {} } = config;
  config.params = Object.assign(params, commonParams);

  return config;
});

axios.interceptors.response.use(res => {
  return res.data;
});

export default {
  install() {

  }
}