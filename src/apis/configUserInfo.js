import { AxiosInstance } from "./AxiosInstance";
import { Auth } from "aws-amplify";

export async function configUserInfo(body) {
  const api = new AxiosInstance("configuserinfo");
  const {
    pool: { userPoolId },
  } = await Auth.currentUserPoolUser();

  const data = { ...body, userpoolid: userPoolId };

  return api.axiosPut(data);
}
