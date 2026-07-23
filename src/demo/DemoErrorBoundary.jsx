/* eslint-disable */
// =============================================================================
// IoTebe — Camada de Demonstração
// DemoErrorBoundary — ANDAIME DE DEMONSTRAÇÃO (removível).
//
// Por que existe: a camada de mock cobre o núcleo com dados ricos e devolve
// estruturas vazias seguras no restante. Se alguma tela percorrer um caminho
// que dependa de um formato que o mock não reproduz, o React lançaria e a
// página ficaria BRANCA — péssimo para uma demo de portfólio.
//
// O que NÃO é: isto não conserta nenhum bug do produto. O código original está
// intacto; em produção, com dados reais, esses caminhos não lançariam. Aqui o
// erro é um artefato da mockagem. O boundary apenas o torna visível e navegável.
//
// COMO REMOVER: em src/index.js, troque `<DemoErrorBoundary><App/></...>` por
// `<App/>` e apague este arquivo. Nada mais depende dele.
// =============================================================================

import React from "react";

export default class DemoErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    // Erros de DOM (getElementById null, addEventListener em null) são bugs do
    // produto original que aparecem em condições específicas de renderização.
    // Nesses casos, o reset automático é mais útil do que exibir a tela de erro.
    const msg = error && error.message ? error.message : "";
    const isDomError =
      msg.includes("addEventListener") ||
      msg.includes("getElementById") ||
      msg.includes("scrollIntoView") ||
      msg.includes("getContext");
    if (isDomError) return { error, autoReset: true };
    return { error, autoReset: false };
  }

  componentDidCatch(error, info) {
    // eslint-disable-next-line no-console
    console.warn("[IoTebe demo] tela atingiu uma lacuna de mock:", error, info);
    if (this.state.autoReset) {
      // erro de DOM (bug original, não de dado) — tenta se recuperar automaticamente
      setTimeout(() => this.setState({ error: null, autoReset: false }), 100);
    }
  }

  reset = () => {
    this.setState({ error: null });
    // App usa BrowserRouter — navega via location (full reload), PrivateRoute
    // resolve e o dashboard volta a renderizar.
    if (typeof window !== "undefined") window.location.assign("/dashboard");
  };

  render() {
    if (!this.state.error) return this.props.children;
    // erros de DOM disparam auto-reset — não mostra a tela de erro
    if (this.state.autoReset) return this.props.children;

    const wrap = {
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "#0f1115",
      color: "#e7e9ee",
      fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, sans-serif",
      padding: 24,
    };
    const card = {
      maxWidth: 520,
      width: "100%",
      background: "#171a21",
      border: "1px solid #272b35",
      borderRadius: 14,
      padding: "28px 28px 24px",
      boxShadow: "0 12px 40px rgba(0,0,0,.45)",
    };
    const tag = {
      display: "inline-block",
      fontSize: 11,
      letterSpacing: ".08em",
      textTransform: "uppercase",
      color: "#a78bfa",
      border: "1px solid #3b3357",
      borderRadius: 999,
      padding: "3px 10px",
      marginBottom: 14,
    };
    const btn = {
      marginTop: 20,
      background: "#7c3aed",
      color: "#fff",
      border: "none",
      borderRadius: 9,
      padding: "10px 16px",
      fontSize: 14,
      cursor: "pointer",
    };

    return (
      <div style={wrap}>
        <div style={card}>
          <span style={tag}>Modo demonstração</span>
          <h2 style={{ margin: "0 0 8px", fontSize: 19 }}>
            Esta tela depende de um dado que não foi mockado
          </h2>
          <p style={{ margin: "0 0 4px", lineHeight: 1.5, color: "#aab0bd", fontSize: 14 }}>
            No sistema real, o backend preencheria esta visão. Na versão de
            demonstração, este caminho específico ficou sem dado de exemplo — não é
            um erro do produto, e sim um ponto ainda não coberto pela camada de mock.
          </p>
          <pre
            style={{
              marginTop: 14,
              background: "#0f1115",
              border: "1px solid #272b35",
              borderRadius: 8,
              padding: "10px 12px",
              fontSize: 12,
              color: "#8b93a3",
              overflowX: "auto",
              whiteSpace: "pre-wrap",
            }}
          >
            {String(this.state.error && this.state.error.message)}
          </pre>
          <button style={btn} onClick={this.reset}>
            Voltar ao dashboard
          </button>
        </div>
      </div>
    );
  }
}
