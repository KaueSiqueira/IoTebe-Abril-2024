import React, { useState } from "react";
import { useEffect } from "react";
import Plot from "react-plotly.js";
import { readSpectrumWaterfall } from "../../apis";
import { Button, Card } from "../../components";
import { CardData } from "../../components/NoDataLayer";
import { formatUnixTimestamp } from "../../utilities";

const config = {
  responsive: true,
  displaylogo: false,
  displayModeBar: true,
  modeBarButtonsToRemove: [
    "zoom3d",
    "orbitRotation",
    "handleDrag3d",
    "resetCameraLastSave3d",
    "hoverClosest3d",
  ],
};

function formatData(arrayData, type) {
  const traces = [];
  const dateVals = [];
  const dateTexts = [];

  const findMax = [];

  const tooltipLabel = (type === "velocity" && "mm/s") || (type === "acceleration" && "g") || "gE";

  arrayData.forEach((data, index) => {
    traces.push({
      type: "scatter3d",
      mode: "lines",
      x: [...Array(data.data.y.length)].map((x) => index),
      y: data.data.y,
      z: data.data.z,
      hovertemplate: `Data: %{x}<br>Frequência: %{y:.2f} (Hz)<br>Amplitude: %{z:.4f} (${tooltipLabel})`,
      name: "",
      line: {
        width: 2,
        // cmax: max,
        cmin: 0,
        color: data.data.z,
        colorscale: "Portland",
      },
    });

    findMax.push(Math.max(...data.data.z));

    dateVals.push(index);
    dateTexts.push(formatUnixTimestamp(data.date));
  });

  const max = Math.max(...findMax);

  traces.forEach((el) => {
    el.line["cmax"] = max;
  });

  const tickLabel = (type === "velocity" && "mm/s - rms") || (type === "acceleration" && "g - rms") || "gE - pico";

  const layout = {
    showlegend: false,
    // autosize: true,
    scene: {
      camera: {
        projection: { type: "orthographic" },
      },
      aspectratio: { x: 1.5, y: 2.5, z: 1 },
      xaxis: {
        title: "",
        ticktext: dateTexts,
        tickvals: dateVals,
      },
      yaxis: {
        title: "Frequência (Hz)",
      },
      zaxis: {
        title: tickLabel,
      },
    },
    margin: {
      b: 0,
      t: 0,
      l: 0,
      r: 0,
    },
  };

  return { traces, layout };
}

export function Cascate({ cascateAPI, setCascateAPI, setLoading, loading }) {
  const [chart, setChart] = useState({});
  // const [chart, setChart] = useState({ data: traces, layout, config });
  const [chartIsLoading, setChartLoading] = useState(true);
  const [isError, setError] = useState(false);

  const loadData = async (requestBody) => {
    !loading && setLoading(true);
    setChartLoading(true);

    try {
      const { data } = await readSpectrumWaterfall(requestBody);
      const { traces, layout } = formatData(data.data, cascateAPI.type);
      setChart({ data: traces, layout, config });
    } catch (error) {
      setError(true);
      console.log(error);
    } finally {
      setLoading(false);
      setChartLoading(false);
    }

    // readSpectrumWaterfall(requestBody)
    //   .then((res) => {
    //     const { traces, layout } = formatData(res.data.data, cascateAPI.type);
    //     setChart({ data: traces, layout, config });
    //   })
    //   .catch(() => {
    //     setError(true);
    //   })
    //   .finally(() => {
    //     setLoading(false);
    //     setChartLoading(false);
    //   });
  };

  const handleChangeAxis = ({ target: { name: newValue } }) => {
    setCascateAPI((prev) => ({ ...prev, axis: newValue }));
  };

  useEffect(() => {
    loadData(cascateAPI);
    return () => {
      setLoading(true);
    };
  }, [cascateAPI]);

  if (isError)
    return (
      <div className="row" style={{ height: "100%" }}>
        <Card className="col-12 transition_smooth relative" height={"100%"} minHeight="200px">
          <CardData title="Error" />
        </Card>
      </div>
    );

  return (
    <div className="row" style={{ height: "100%" }}>
      <Card className="col-12 transition_smooth relative" height={"100%"} minHeight="200px">
        {!chartIsLoading && (
          <Plot
            style={{ height: "100%", width: "100%" }}
            data={chart.data}
            layout={chart.layout}
            config={chart.config}
          />
        )}

        <div className="cascate-button">
          <Button
            name="vertical"
            onClick={handleChangeAxis}
            className={cascateAPI.axis === "vertical" ? "rounded-button-cascate-selected" : "rounded-button-cascate"}
            style={{ marginLeft: 4, marginRight: 4 }}
          >
            Vertical
          </Button>

          <Button
            name="horizontal"
            onClick={handleChangeAxis}
            className={cascateAPI.axis === "horizontal" ? "rounded-button-cascate-selected" : "rounded-button-cascate"}
            style={{ marginLeft: 4, marginRight: 4 }}
          >
            Horizontal
          </Button>

          <Button
            name="axial"
            onClick={handleChangeAxis}
            className={cascateAPI.axis === "axial" ? "rounded-button-cascate-selected" : "rounded-button-cascate"}
            style={{ marginLeft: 4, marginRight: 4 }}
          >
            Axial
          </Button>
        </div>
      </Card>
    </div>
  );
}
