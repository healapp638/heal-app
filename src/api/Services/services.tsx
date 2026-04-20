import api from "../Manager/manager";
import { endpoints } from "./endpoints";

export const login = async (email:string, password:string) => {
  return api.post(endpoints.login, { email, password });
};
