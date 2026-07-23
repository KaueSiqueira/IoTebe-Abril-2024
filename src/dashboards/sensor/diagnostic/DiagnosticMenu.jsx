import React from "react";
import useDiagnosticMenu from "../../../hooks/Diagnostic/useDiagnosticMenu";
import DiagnosticCard from "./DiagnosticCard";
import { ComponentLoader } from "../../../components";
import DiagnosticCardCompleted from "./DiagnosticCardCompleted";
import FilterFailure from "./FilterFailure";

export default function DiagnosticMenu() {
  const {
    diagnosticType,
    loadDiagnostic,
    diagnosticCards,
    machineInfo,
    loading,
    setDiagnosticCards,
    failureExpanded,
    setFailureExpanded,
    sendChartIds,
    diagnosticExpanded,
    setDiagnosticExpanded,
    spot_id,
  } = useDiagnosticMenu();

  return (
    <div
      className="diagnosticMenu"
      style={
        window.innerWidth > 700
          ? { height: "100%", overflow: loading && "hidden" }
          : {
              height: "auto",
              minHeight: !loading && "36%",
              overflow: loading && "hidden",
            }
      }
    >
      <div
        className={
          window.innerWidth > 700
            ? "diagnosticMenuHeader"
            : "diagnosticMenuHeaderMobile"
        }
      >
        {window.innerWidth > 700 && <h3>Diagnósticos</h3>}
        <div
          className="divider-screen"
          style={{ pointerEvents: loading && "none" }}
        >
          <button
            className={`divider-screen-button ${
              diagnosticType === "pending" && "divider-screen-selected"
            }`}
            onClick={() => {
              loadDiagnostic("pending", spot_id);
            }}
          >
            Pendentes
          </button>

          <button
            className={`divider-screen-button ${
              diagnosticType === "completed" && "divider-screen-selected"
            }`}
            onClick={() => {
              loadDiagnostic("completed", spot_id);
            }}
          >
            Concluídos
          </button>
        </div>
      </div>
      <div
        className="diagnosticMenuBody"
        style={{ display: loading && "none" }}
      >
        {diagnosticType !== "pending" && (
          <FilterFailure setCards={setDiagnosticCards} card={diagnosticCards} />
        )}
        {diagnosticType !== "pending" && window.innerWidth < 700 && (
          <div style={{ height: 37 }} />
        )}
        <div
          className="diagnosticMenuBodyStyle"
          style={
            diagnosticCards &&
            (diagnosticCards.length > 0
              ? {
                  height: diagnosticType !== "pending" ? "auto" : "100%",
                  width:
                    diagnosticType !== "pending" &&
                    diagnosticCards?.length > 1 &&
                    window.innerWidth < 700
                      ? "115%"
                      : "100%",
                  backgroundColor: diagnosticType !== "pending" && "#FAFAFA",
                  borderRadius: diagnosticType !== "pending" && "8px",
                  padding: diagnosticType !== "pending" && "15px",
                  overflowX:
                    diagnosticType !== "pending" &&
                    window.innerWidth < 700 &&
                    "auto",
                  display: loading
                    ? "none"
                    : diagnosticType !== "pending" &&
                      window.innerWidth < 700 &&
                      "flex",
                }
              : {
                  display: "none",
                })
          }
        >
          {diagnosticCards?.length > 0 ? (
            diagnosticCards.map((card, index) => {
              if (diagnosticType === "pending")
                return (
                  <DiagnosticCard
                    key={"DiagnosticCard-" + index.toString()}
                    card={card}
                    machineInfo={machineInfo}
                    failureExpanded={failureExpanded}
                    setFailureExpanded={setFailureExpanded}
                  />
                );
              else
                return (
                  <DiagnosticCardCompleted
                    key={"DiagnosticCardCompleted-" + index.toString()}
                    card={card}
                    machineInfo={machineInfo}
                    failureExpanded={failureExpanded}
                    setFailureExpanded={setFailureExpanded}
                    diagnosticExpanded={diagnosticExpanded}
                    setDiagnosticExpanded={setDiagnosticExpanded}
                    sendChartIds={sendChartIds}
                    scrollMobile={diagnosticCards?.length > 1}
                  />
                );
            })
          ) : (
            <div className="diagnosticNotFound"></div>
          )}
          {diagnosticType !== "pending" &&
            diagnosticCards?.length > 0 &&
            window.innerWidth < 700 && (
              <div style={{ minWidth: "13%", height: 100 }}></div>
            )}
        </div>
      </div>
      {loading && window.innerWidth > 700 && <ComponentLoader />}
    </div>
  );
}
