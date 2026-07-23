/* eslint-disable */
// =============================================================================
// IoTebe — Camada de Demonstração
// Mock de `@aws-amplify/pubsub/lib/Providers` (AWSIoTProvider).
//
// O GatewayConfig instancia `new AWSIoTProvider({...})` e o registra via
// Amplify.addPluggable(...). No demo isso é totalmente inerte — não há conexão
// MQTT/WebSocket real. Ligado via ALIAS no vite.config.js.
// =============================================================================

export class AWSIoTProvider {
  constructor(options = {}) {
    this._options = options;
  }
  getCategory() {
    return "PubSub";
  }
  getProviderName() {
    return "AWSIoTProvider";
  }
  configure(config = {}) {
    return config;
  }
  // nunca emite — o demo não recebe telemetria em tempo real
  subscribe() {
    return { subscribe: () => ({ unsubscribe() {} }) };
  }
  publish() {
    return Promise.resolve(true);
  }
}

export default AWSIoTProvider;
