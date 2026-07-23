import { AxiosInstance } from "./AxiosInstance";

export async function gatewayCommandSend(body) {
  const api = new AxiosInstance("gatewaycommandsend");
  const data = {
    ...body,
  };

  return api.axiosPut(data);
}
