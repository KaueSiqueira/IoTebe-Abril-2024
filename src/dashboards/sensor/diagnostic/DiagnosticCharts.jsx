import React from "react";

// Icons
import ContentPasteSearchRoundedIcon from "@mui/icons-material/ContentPasteSearchRounded";
import useDiagnosticCharts from "../../../hooks/Diagnostic/useDiagnosticCharts";
import { ComponentLoader } from "../../../components";
import DiagnosticGlobalCharts from "./DiagnosticGlobalCharts";
import DiagnosticSpectralCharts from "./DiagnosticSpectralCharts";

export default function DiagnosticCharts({
  setLoading,
  globalProps,
  spectralProps,
}) {
  const {
    diagnosticType,
    loading,
    chartsToPlot,
    diagnosticChartFilter,
    checkFilter,
    getAlarmedAnnotations,
    getDateRange,
    getDateType,
  } = useDiagnosticCharts(setLoading);

  return (
    <div
      className="row diagnosticCharts"
      style={{
        maxHeight: "100%",
        height:
          loading ||
          (!chartsToPlot?.GLOBAL.length > 0 &&
            !chartsToPlot?.PROCESSED_RAW.length > 0)
            ? "100%"
            : "auto",
        padding: "5px",
      }}
    >
      <div
        style={{
          display: loading ? "none" : "block",
          height: "auto",
          maxHeight: "100%",
          width: "100%",
        }}
      >
        {chartsToPlot &&
        (chartsToPlot["GLOBAL"].length > 0 ||
          chartsToPlot["PROCESSED_RAW"].length > 0) ? (
          <>
            <DiagnosticGlobalCharts
              chartsToPlot={chartsToPlot["GLOBAL"]}
              globalProps={globalProps}
              chartFilter={diagnosticChartFilter}
              checkFilter={checkFilter}
              getAlarmedAnnotations={getAlarmedAnnotations}
              getDateRange={getDateRange}
              getDateType={getDateType}
              onlyOne={
                chartsToPlot["GLOBAL"].length +
                  chartsToPlot["PROCESSED_RAW"].length ===
                1
              }
            />
            <DiagnosticSpectralCharts
              chartsToPlot={chartsToPlot["PROCESSED_RAW"]}
              spectralProps={spectralProps}
              chartFilter={diagnosticChartFilter}
              checkFilter={checkFilter}
              getAlarmedAnnotations={getAlarmedAnnotations}
              getDateRange={getDateRange}
              getDateType={getDateType}
              onlyOne={
                chartsToPlot["GLOBAL"].length +
                  chartsToPlot["PROCESSED_RAW"].length ===
                1
              }
            />
          </>
        ) : (
          <div className="diagnosticNotFound" style={{height: window.innerWidth < 700 && "62vh"}}>
            <ContentPasteSearchRoundedIcon />
            <h1 style={{fontSize: window.innerWidth < 700 && 38}}>
              Nenhum diagnóstico
              <br />
              {diagnosticType === "pending" ? "pendente" : "concluído"}
            </h1>
          </div>
        )}
      </div>
      {loading && (
        <ComponentLoader
          customStyle={{
            position: window.innerWidth > 700 ? "relative" : "absolute",
            height: window.innerWidth > 700 ? "auto" : "85%",
            maxHeight: "100%",
            paddingBottom: window.innerWidth < 700 && "20%"
          }}
        />
      )}
    </div>
  );
}
