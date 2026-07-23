#!/usr/bin/env node
/* eslint-disable */
const { spawnSync, spawn } = require("child_process");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const ROOT = __dirname;
const BUILD_DIR = path.join(ROOT, "build");
const SRC_DEMO_DIR = path.join(ROOT, "src", "demo");
const SENTINEL = path.join(BUILD_DIR, ".demo-version");

function hashDir(dir) {
  const h = crypto.createHash("md5");
  function walk(d) {
    const entries = fs.readdirSync(d, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name));
    for (const e of entries) {
      const full = path.join(d, e.name);
      if (e.isDirectory()) walk(full);
      else h.update(fs.readFileSync(full));
    }
  }
  walk(dir);
  return h.digest("hex");
}

function needsBuild() {
  if (!fs.existsSync(BUILD_DIR) || !fs.existsSync(path.join(BUILD_DIR, "index.html"))) return true;
  if (!fs.existsSync(SENTINEL)) return true;
  try {
    return fs.readFileSync(SENTINEL, "utf8").trim() !== hashDir(SRC_DEMO_DIR);
  } catch { return true; }
}

function writeSentinel() {
  try { fs.writeFileSync(SENTINEL, hashDir(SRC_DEMO_DIR), "utf8"); } catch {}
}

function buildWithEsbuild() {
  console.log("[IoTebe demo] gerando build com esbuild...\n");
  // substituir config/aws.js pelo no-op para o build
  const awsOrig = path.join(ROOT, "src", "config", "aws.js");
  const awsNoop = path.join(ROOT, "src", "demo", "aws-config-noop.js");
  const awsBackup = awsOrig + ".bak";
  let restored = false;
  try {
    if (fs.existsSync(awsOrig)) { fs.copyFileSync(awsOrig, awsBackup); fs.copyFileSync(awsNoop, awsOrig); }
    const npxCmd = process.platform === "win32" ? "npx.cmd" : "npx";
    const result = spawnSync(npxCmd, ["esbuild", "src/index.jsx",
      "--bundle", "--outfile=build/assets/index.js", "--format=iife",
      "--platform=browser",
      "--define:process.env.NODE_ENV='production'",
      "--define:process.env.REACT_APP_HOST_ENDPOINT='https://demo.iotebe.local/'",
      "--define:process.env.REACT_APP_HOST_PUBLIC_ENDPOINT='https://demo.iotebe.local/'",
      "--define:process.env.REACT_APP_COGNITO_REGION='us-east-2'",
      "--define:process.env.REACT_APP_COGNITO_USER_POOL_ID='demo-pool'",
      "--define:process.env.REACT_APP_COGNITO_APP_CLIENT_ID='demo-client'",
      "--define:process.env.REACT_APP_COGNITO_IDENTITY_POOL_ID='demo-identity'",
      "--alias:aws-amplify=./src/demo/mock-amplify.js",
      "--alias:@aws-amplify/pubsub/lib/Providers=./src/demo/aws-iot-provider.js",
      "--alias:bootstrap/dist/js/bootstrap=./node_modules/bootstrap/dist/js/bootstrap.bundle.min.js",
      "--alias:deep-email-validator=./src/demo/email-validator-stub.js",
      "--alias:jspdf=./node_modules/jspdf/dist/jspdf.es.min.js",
      "--alias:bootstrap/dist/js/bootstrap=./src/demo/bootstrap-stub.js",
      "--alias:bootstrap/dist/js/bootstrap.bundle.min=./src/demo/bootstrap-stub.js",
      "--alias:jspdf=./node_modules/jspdf/dist/jspdf.es.min.js",
      "--loader:.png=dataurl", "--loader:.jpg=dataurl",
      "--loader:.gif=empty", "--loader:.svg=empty", "--loader:.woff=dataurl", "--loader:.woff2=dataurl", "--loader:.ttf=dataurl", "--loader:.eot=dataurl", "--loader:.mp3=empty",
    ], { stdio: "inherit", cwd: ROOT, shell: process.platform === "win32" });
    if (result.status !== 0) { console.error("[IoTebe demo] build falhou"); process.exit(1); }
  } finally {
    if (fs.existsSync(awsBackup)) { fs.copyFileSync(awsBackup, awsOrig); fs.unlinkSync(awsBackup); }
  }
  // copiar assets necessários
  const assetsDir = path.join(BUILD_DIR, "assets");
  if (!fs.existsSync(assetsDir)) fs.mkdirSync(assetsDir, { recursive: true });
  // copiar imagens de src
  function copyImages(srcDir) {
    if (!fs.existsSync(srcDir)) return;
    fs.readdirSync(srcDir, { withFileTypes: true }).forEach(e => {
      if (e.isDirectory()) copyImages(path.join(srcDir, e.name));
      else if (/\.(png|jpg|gif|svg)$/i.test(e.name)) {
        try { fs.copyFileSync(path.join(srcDir, e.name), path.join(assetsDir, e.name)); } catch {}
      }
    });
  }
  copyImages(path.join(ROOT, "src", "assets"));
  copyImages(path.join(ROOT, "public"));
}

console.log("\n[IoTebe demo] preparando a demonstração...\n");

// Verificar node_modules de forma robusta — o nome do binário varia por SO e versão do npm
const NODE_MODULES = path.join(ROOT, "node_modules");
const ESBUILD_BIN_CMD  = path.join(NODE_MODULES, ".bin", "esbuild.cmd");
const ESBUILD_BIN_UNIX = path.join(NODE_MODULES, ".bin", "esbuild");
const ESBUILD_PKG      = path.join(NODE_MODULES, "esbuild", "package.json");
// vite é o comando que efetivamente sobe o servidor no final deste script —
// checar só o esbuild (usado apenas no passo intermediário de build) deixava
// passar despercebida uma instalação onde o esbuild existe mas o vite não.
const VITE_PKG   = path.join(NODE_MODULES, "vite", "package.json");
const VITE_DIST  = path.join(NODE_MODULES, "vite", "dist");

// Instalações truncadas por falta de espaço em disco (ENOSPC) costumam deixar
// o package.json de um pacote (arquivo pequeno, gravado cedo) mas falham nos
// arquivos maiores que vêm depois — por isso checar SÓ a existência do
// package.json não basta. Confirmamos que a pasta dist/ tem conteúdo real.
function packageLooksIntact(pkgJsonPath, distDirPath) {
  if (!fs.existsSync(pkgJsonPath)) return false;
  if (distDirPath) {
    if (!fs.existsSync(distDirPath)) return false;
    try {
      if (fs.readdirSync(distDirPath).length === 0) return false;
    } catch { return false; }
  }
  return true;
}

const nodeModulesMissing = !fs.existsSync(NODE_MODULES);
const esbuildBroken = !packageLooksIntact(ESBUILD_PKG, null);
const viteBroken    = !packageLooksIntact(VITE_PKG, VITE_DIST);

if (nodeModulesMissing || esbuildBroken || viteBroken) {
  console.error("[IoTebe demo] instalação incompleta ou corrompida em node_modules/.\n");
  if (!nodeModulesMissing && (esbuildBroken || viteBroken)) {
    console.error(
      "  Isso costuma acontecer quando o 'npm install' foi interrompido no meio\n" +
      "  (ex.: falta de espaço em disco — erro ENOSPC no log de instalação).\n" +
      "  O npm install não é interrompido de forma limpa nesse caso: alguns\n" +
      "  pacotes ficam parcialmente escritos, e o problema só aparece depois,\n" +
      "  numa etapa posterior e sem relação aparente com a causa real.\n\n" +
      "  Passos para corrigir:\n" +
      "  1. Libere espaço em disco (verifique o disco onde esta pasta está).\n" +
      "  2. Apague a pasta node_modules por completo (não reaproveite).\n" +
      "  3. Rode 'npm install' novamente.\n"
    );
  } else {
    console.error("  Rode 'npm install' antes de executar a demo.\n");
  }
  if (process.platform === "win32") {
    console.log("Pressione qualquer tecla para continuar. . .");
    try { require("child_process").execSync("pause", { stdio: "inherit" }); } catch {}
  }
  process.exit(1);
}

// Determinar o binário correto: pode ser .cmd, sem extensão, ou via npx
const ESBUILD_BIN = fs.existsSync(ESBUILD_BIN_CMD) ? ESBUILD_BIN_CMD
  : fs.existsSync(ESBUILD_BIN_UNIX) ? ESBUILD_BIN_UNIX
  : null; // fallback: usa npx esbuild

if (needsBuild()) {
  if (!fs.existsSync(BUILD_DIR)) fs.mkdirSync(BUILD_DIR, { recursive: true });
  if (!fs.existsSync(path.join(BUILD_DIR, "assets"))) fs.mkdirSync(path.join(BUILD_DIR, "assets"));
  buildWithEsbuild();
  writeSentinel();
} else {
  console.log("[IoTebe demo] build em cache válido. Subindo servidor...\n");
}

console.log("[IoTebe demo] abrindo no navegador...\n");
const npxCmd = process.platform === "win32" ? "npx.cmd" : "npx";
const child = spawn(npxCmd, ["vite", "preview", "--outDir", "build", "--open"], {
  stdio: "inherit", cwd: ROOT, shell: process.platform === "win32"
});
child.on("error", (err) => { console.error("[IoTebe demo] erro ao subir servidor:", err.message); process.exit(1); });
process.on("SIGINT", () => { child.kill("SIGINT"); process.exit(0); });
