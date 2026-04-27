import { create, ApiResponse } from 'apisauce';
import { config, Mode } from '../../../config';
import getEnvVars from '../../../env';
import AppUtils from '../../utils/appUtils';
import { store } from '../../redux/Store/store';

// Define the type for the API response
type ResponseType = ApiResponse<any, any>;

const api = create({
  baseURL: getEnvVars().apiUrl,
  timeout: 20000,
});
api.addRequestTransform((request: any) => {
  const token = store.getState().userData.token;
  if (token) {
    request.headers['Authorization'] = `Bearer ${token}`;
  }
});

// Define the type for the monitor function
type MonitorFunction = (response: ResponseType) => void;

const naviMonitor: MonitorFunction = response => {};

if (config.mode === Mode.DEV) {
  api.addMonitor(naviMonitor);
}

export default api;
