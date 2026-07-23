/* eslint-disable */
import { FLAT_TREE } from "./db";
// =============================================================================
// IoTebe — Camada de Demonstração
// Mock do `aws-amplify`.
//
// Substitui Cognito (Auth) e PubSub (Amplify) por implementações locais que
// SEMPRE resolvem com um usuário de demonstração. Assim o PrivateRoute libera
// o acesso e a aplicação cai direto no /dashboard, sem login real.
//
// Ligado via ALIAS no vite.config.js (aws-amplify → este arquivo), portanto os
// 13 arquivos que importam Amplify/Auth permanecem INTACTOS.
// =============================================================================

import { DEMO_USER } from "./db";

// Objeto de usuário com a MESMA forma que o Cognito devolvia. O consumidor
// crítico é getCurrentAccessToken(): user.signInUserSession.accessToken.jwtToken
const DEMO_JWT =
  "demo." +
  btoa(JSON.stringify({ sub: "kaue-demo", name: DEMO_USER.name })).replace(/=/g, "") +
  ".sig";

const demoCognitoUser = {
  username: DEMO_USER.username,
  attributes: {
    sub: "kaue-demo-0001",
    name: DEMO_USER.name,
    email: DEMO_USER.email,
    email_verified: true,
    phone_number: DEMO_USER.phone_number,
    "custom:company": DEMO_USER.company_name,
  },
  signInUserSession: {
    accessToken: { jwtToken: DEMO_JWT, payload: { username: DEMO_USER.username } },
    idToken: { jwtToken: DEMO_JWT, payload: { name: DEMO_USER.name } },
    refreshToken: { token: "demo-refresh" },
  },
  // alguns componentes chamam user.getUsername() / user.getSignInUserSession()
  getUsername: () => DEMO_USER.username,
  getSignInUserSession: () => demoCognitoUser.signInUserSession,
};

const resolve = (v) => Promise.resolve(v);

// -----------------------------------------------------------------------------
// Auth (named export)
// -----------------------------------------------------------------------------
export const Auth = {
  currentAuthenticatedUser: () => resolve(demoCognitoUser),
  currentUserPoolUser: () => resolve(demoCognitoUser),
  currentCredentials: () =>
    resolve({
      // GatewayConfig acessa info.data.IdentityId
      data: { IdentityId: "demo-identity-pool-id" },
      // forma padrão do Cognito (outros consumidores)
      accessKeyId: "DEMOACCESSKEY",
      secretAccessKey: "demo-secret",
      sessionToken: "demo-session",
      identityId: "demo-identity",
      authenticated: true,
    }),
  currentSession: () => resolve(demoCognitoUser.signInUserSession),
  signIn: (username, password) =>
    resolve({ ...demoCognitoUser, username: username || DEMO_USER.username }),
  signOut: () => resolve(true),
  signUp: () => resolve({ user: demoCognitoUser, userConfirmed: true }),
  confirmSignUp: () => resolve("SUCCESS"),
  resendSignUp: () => resolve("SUCCESS"),
  changePassword: () => resolve("SUCCESS"),
  updateUserAttributes: () => resolve("SUCCESS"),
  forgotPassword: () => resolve({ CodeDeliveryDetails: { Destination: DEMO_USER.email } }),
  forgotPasswordSubmit: () => resolve("SUCCESS"),
  completeNewPassword: () => resolve(demoCognitoUser),
};

// -----------------------------------------------------------------------------
// PubSub — inerte para telemetria de sensor, mas emite dados para gatewayConfig
// para resolver o loading infinito do toggle "mostrar somente sensores visíveis"
// -----------------------------------------------------------------------------
const inertSubscription = { unsubscribe() {} };

function makeGatewayPayload(FLAT_TREE) {
  const spotsObj = {};
  const availableIds = [];
  const registeredIds = [];
  FLAT_TREE.filter((n) => n.type === "SPOT").forEach((n, i) => {
    const spotId = String(n.id);
    spotsObj[spotId] = { id: spotId, content: n.title, sensor_id: n.sensor_id || "None" };
    if (i < 3) registeredIds.push(spotId);
    else availableIds.push(spotId);
  });
  return {
    columns: { availableSpots: { spotIds: availableIds }, registeredSpots: { spotIds: registeredIds } },
    spots: spotsObj, gateway_version: "2.4.1", rmstempCollectPeriod: 10,
  };
}

function makeObservable(topic) {
  return {
    subscribe(observerOrNext) {
      const obs = typeof observerOrNext === "function"
        ? { next: observerOrNext, error: () => {}, close: () => {} }
        : observerOrNext || {};
      // gatewayConfig aguarda evento next para resolver isLoadingVisibleSpots
      if (topic && topic.includes("gatewayConfig")) {
        setTimeout(() => {
          try {
            obs.next && obs.next({ value: makeGatewayPayload(FLAT_TREE) });
          } catch (e) {}
        }, 400);
      }
      return inertSubscription;
    },
  };
}

const PubSub = {
  subscribe: (topic) => makeObservable(topic),
  publish: () => resolve(true),
};

// -----------------------------------------------------------------------------
// Amplify (default export) — configuração e plugins viram no-ops
// -----------------------------------------------------------------------------
const Amplify = {
  configure: (cfg) => cfg || {},
  addPluggable: () => {},
  removePluggable: () => {},
  register: () => {},
  PubSub,
  Auth,
};

// `import Amplify, { Auth } from "aws-amplify"` e
// `import { Auth } from "aws-amplify"` e
// `import Amplify from "aws-amplify"` — todos cobertos.
export { PubSub };
export default Amplify;
