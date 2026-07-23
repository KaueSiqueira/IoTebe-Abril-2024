import React, { useState, useEffect, useCallback } from "react";

import axios from "axios";
import { readSpectrumData } from "../../apis";

import { CardData } from "../../components/NoDataLayer";
import SpectrumChart from "./spectrum_cards/SpectrumChart";
import WaveFormCard from "./spectrum_cards/WaveFormCard";

const Spectrum = ({ spotId, dataId, spectrumType, setLoading, loading, whichButton }) => {
  const [cancelToken, setCancelToken] = useState();
  const [spectrumData, setSpectrumData] = useState(undefined);
  const [waveData, setWaveData] = useState(undefined);
  const [filter, setFilter] = useState({ min: 500, max: 6000 });
  const [showChart, setShowChart] = useState();
  const [amplitudeUnit, setAmplitudeUnit] = useState("RMS");
  const [amplitude, setAmplitude] = useState("rms");

  const loadData = useCallback(async (spotId, dataId, spectrumType, filter, source) => {
    if(spectrumType === "envelope"){
      setAmplitudeUnit("PK");
      setAmplitude("Pico");
    }
    else{
      setAmplitudeUnit("RMS");
      setAmplitude("rms")
    }
    try {
      const { data } = await readSpectrumData(spotId, dataId, spectrumType, filter, source);
      const MACHINE_TYPES_OPTIONS = [
        "Selecione",
        "Motor Elétrico",
        "Bomba Centrífuga",
        "Ventilador/Exaustor",
        "Turbina a Vapor",
        "Redutor",
        "Gerador",
        "Rotores em Geral",
        "Outros",
      ];
      setSpectrumData({
        dataAxial: data.spectrum_axial,
        dataHorizontal: data.spectrum_horizontal,
        dataVertical: data.spectrum_vertical,
        rotation: data.rotation_speed,
        machineType: MACHINE_TYPES_OPTIONS[data.machine_type],
        bpfi: data.bpfi,
        bpfo: data.bpfo,
        bsf: data.bsf,
        ftf: data.ftf,
        bearingList: data.bearings_freq,
        gmfList: data.gear_box_gmf_list,
        divisionCount: data.division_count
      });

      setWaveData({
        dataAxial: data.wave_axial,
        dataHorizontal: data.wave_horizontal,
        dataVertical: data.wave_vertical,
      });
      setShowChart(true);
    } catch (error) {
      // res.message !== "cancelado" && setLoading(false);
      setSpectrumData({});
      setWaveData({});
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    setLoading(true);
    setShowChart(false);
    if (!!cancelToken) {
      cancelToken.cancel("cancelado");
    }
    setCancelToken(axios.CancelToken.source());
    // switch (spectrumType) {
    //   case "velocity":
    //     whichButton("velocityButton");
    //     break;
    //   case "acceleration":
    //     whichButton("accelerationButton");
    //     break;
    //   case "envelope":
    //     whichButton("envelopeButton");
    //     break;

    //   default:
    //     break;
    // }
    return () => setLoading(true);
  }, [dataId, spectrumType, filter]);

  useEffect(() => {
    setShowChart(false);
    !!cancelToken && loadData(spotId, dataId, spectrumType, filter, cancelToken);
  }, [cancelToken]);

  return (
    <div className="row height-100p">
      {!showChart ? (
        <>
          <CardData title={loading ? "" : "NÃO HÁ DADOS!"} />
        </>
      ) : (
        <>
          <SpectrumChart
            id={"SpectrumChart"}
            title={"Espectro"}
            SpectrumData={spectrumData}
            SpectrumType={spectrumType}
            specType={spectrumType}
            spotId={spotId}
            dataId={dataId}
            setFilter={setFilter}
            tendency={false}
            ampUnit={amplitudeUnit}
            ampData={amplitude}
            freqData={{}}
          />
          <WaveFormCard
            id={"WaveFormChart"}
            title={"Forma de Onda"}
            WaveData={waveData}
            SpectrumType={spectrumType}
            spotId={spotId}
            dataId={dataId}
            tendency={false}
          />
        </>
      )}
    </div>
  );
};

export default Spectrum;
