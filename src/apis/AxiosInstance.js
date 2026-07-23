import axios from "axios";
import { getCurrentAccessToken } from "../utilities";

export class AxiosInstance {
  constructor(url) {
    this.url = url;
  }

  async configAxios(optionalConfig) {
    return axios.create({
      baseURL: optionalConfig?.isPublicApi
        ? process.env.REACT_APP_HOST_PUBLIC_ENDPOINT
        : process.env.REACT_APP_HOST_ENDPOINT,
      headers: {
        Authorization:
          optionalConfig?.customToken || (await getCurrentAccessToken()),
      },
    });
  }

  async axiosPost(data = {}) {
    const server = await this.configAxios();
    return server({
      url: this.url,
      method: "post",
      data: { ...data },
    });
  }

  async axiosPublicPost(data = {}, customToken = "") {
    const server = await this.configAxios({
      isPublicApi: true,
      customToken: customToken,
    });
    return server({
      url: this.url,
      method: "post",
      data: { ...data },
    });
  }

  async axiosPut(data = {}) {
    const server = await this.configAxios();
    return server({
      url: this.url,
      method: "put",
      data: { ...data },
    });
  }

  async axiosPublicPut(data = {}, customToken = "") {
    const server = await this.configAxios({
      isPublicApi: true,
      customToken: customToken,
    });
    return server({
      url: this.url,
      method: "put",
      data: { ...data },
    });
  }

  async axiosGet(cancelToken, queryParams = {}) {
    const server = await this.configAxios();
    return server({
      url: this.url,
      method: "get",
      cancelToken: cancelToken?.token,
      params: queryParams,
    });
  }

  async axiosPublicGet(cancelToken, queryParams = {}, customToken = "") {
    const server = await this.configAxios({
      isPublicApi: true,
      customToken: customToken,
    });
    return server({
      url: this.url,
      method: "get",
      cancelToken: cancelToken?.token,
      params: queryParams,
    });
  }

  async axiosDelete() {
    const server = await this.configAxios();
    return server({
      url: this.url,
      method: "delete",
    });
  }
}
