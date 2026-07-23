import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "aws-amplify": path.resolve(__dirname, "src/demo/mock-amplify.js"),
      "@aws-amplify/pubsub/lib/Providers": path.resolve(__dirname, "src/demo/aws-iot-provider.js"),
      "./config/aws": path.resolve(__dirname, "src/demo/aws-config-noop.js"),
      "../config/aws": path.resolve(__dirname, "src/demo/aws-config-noop.js"),
      "bootstrap/dist/js/bootstrap": "bootstrap/dist/js/bootstrap.bundle.min",
    },
    dedupe: ["react", "react-dom"],
  },
  define: {
    "process.env.REACT_APP_HOST_ENDPOINT": JSON.stringify("https://demo.iotebe.local/"),
    "process.env.REACT_APP_HOST_PUBLIC_ENDPOINT": JSON.stringify("https://demo.iotebe.local/"),
    "process.env.REACT_APP_COGNITO_REGION": JSON.stringify("us-east-2"),
    "process.env.REACT_APP_COGNITO_USER_POOL_ID": JSON.stringify("demo-pool"),
    "process.env.REACT_APP_COGNITO_APP_CLIENT_ID": JSON.stringify("demo-client"),
    "process.env.REACT_APP_COGNITO_IDENTITY_POOL_ID": JSON.stringify("demo-identity"),
    "process.env.REACT_APP_COGNITO_DOMAIN": JSON.stringify("demo.auth.us-east-2.amazoncognito.com"),
    "process.env.REACT_APP_COGNITO_SCOPE": JSON.stringify("email openid"),
    "process.env.NODE_ENV": JSON.stringify("production"),
  },
  build: {
    outDir: "build",
    chunkSizeWarningLimit: 12000,
       // desabilita minificação — evita OOM no Rollup com 14k módulos
    
  },
});
// nota: arquivo já finalizado acima
