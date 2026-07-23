import React, { createContext, useReducer, useState } from "react";

const RightSideMenuContext = createContext();

const initialSidemenuState = {
  context: null,
  anomalies: null,
  setDateRange: null,
  turnOnTimestamp: null,
  waitingFeedbackAnomalies: null,
};

const initialChartState = {
  chartSubscribers: {},
  tabChangeSubscribers: {},
  tabOpen: "WAITING",
};

const sidemenuAction = {
  LOAD_SPOT: "LOAD_SPOT",
  UPDATE_ANOM: "UPDATE_ANOM",
  SET_CHART_STATES: "SET_CHART_STATES",
  TOGGLE_SIDEMENU: "TOGGLE_SIDEMENU",
  TOGGLE_ANOM: "TOGGLE_ANOM",
};

const chartAction = {
  ADD_SUBSCRIBER: "ADD_SUBSCRIBER",
  ADD_SUBSCRIBER_TAB_CHANGE: "ADD_SUBSCRIBER_TAB_CHANGE",
  CHANGE_TAB: "CHANGE_TAB",
};

const sidemenuReducer = (state, action) => {
  switch (action.type) {
    case sidemenuAction.LOAD_SPOT:
      return {
        context: state.context,
        anomalies: action.anomalies,
        setDateRange: state.setDateRange,
        turnOnTimestamp: action.turnOnTimestamp,
        waitingFeedbackAnomalies: action.anomalies.filter(
          (anom) => anom.anom_type === "WAITING_FEEDBACK"
        ).length,
      };
    case sidemenuAction.UPDATE_ANOM:
      return {
        context: state.context,
        anomalies: action.anomalies,
        setDateRange: state.setDateRange,
        turnOnTimestamp: state.turnOnTimestamp,
        waitingFeedbackAnomalies: action.anomalies.filter(
          (anom) => anom.anom_type === "WAITING_FEEDBACK"
        ).length,
      };
    case sidemenuAction.SET_CHART_STATES:
      return {
        context: state.context,
        anomalies: state.anomalies,
        setDateRange: action.newSetDateRange,
        turnOnTimestamp: state.turnOnTimestamp,
        waitingFeedbackAnomalies: state.waitingFeedbackAnomalies,
      };
    case sidemenuAction.TOGGLE_SIDEMENU:
      return {
        context: action.newContext,
        anomalies: state.anomalies,
        setDateRange: state.setDateRange,
        turnOnTimestamp: state.turnOnTimestamp,
        waitingFeedbackAnomalies: state.waitingFeedbackAnomalies,
      };
    case sidemenuAction.TOGGLE_ANOM:
      return {
        context: state.context,
        anomalies: state.anomalies,
        setDateRange: state.setDateRange,
        turnOnTimestamp: action.newTurnOnTimestamp,
        waitingFeedbackAnomalies: state.waitingFeedbackAnomalies,
      };
    default:
      return state;
  }
};

const chartReducer = (state, action) => {
  switch (action.type) {
    case chartAction.ADD_SUBSCRIBER:
      let subscribers = state.chartSubscribers;
      subscribers[action.name] = action.callbackFunc;
      return {
        chartSubscribers: subscribers,
        tabChangeSubscribers: state.tabChangeSubscribers,
        tabOpen: state.tabOpen,
      };
    case chartAction.ADD_SUBSCRIBER_TAB_CHANGE:
      let tabSubs = state.tabChangeSubscribers;
      tabSubs[action.name] = action.callbackFunc;
      return {
        chartSubscribers: state.chartSubscribers,
        tabChangeSubscribers: tabSubs,
        tabOpen: state.tabOpen,
      };
    case chartAction.CHANGE_TAB:
      return {
        chartSubscribers: state.chartSubscribers,
        tabChangeSubscribers: state.tabChangeSubscribers,
        tabOpen: action.tabSelected,
      };
    default:
      return state;
  }
};

function RightSideMenuProvider({ children }) {
  const [trainingPeriod, setTrainingPeriod] = useState({
    startDate: "",
    endDate: "",
  });
  const [pageDate, setPageDate] = useState({ startDate: "", endDate: "" });
  const [validLimit, setValidLimit] = useState(false);
  const [limit, setLimit] = useState(null);
  const [metric, setMetric] = useState(1);
  const [view, setView] = useState(false);
  const [periodOnList, setPeriodOnList] = useState([]);
  const [loadingAutomatic, setLoadingAutomatic] = useState(false);
  const [loadingAutomaticInfo, setLoadingAutomaticInfo] = useState(true);
  const [validSpec, setValidSpec] = useState(false);
  const [velocityAverage, setVelocityAverage] = useState(0);
  const [accelerationAverage, setAccelerationAverage] = useState(0);
  const [standardSettings, setStandardSettings] = useState({});
  const [showAllCharts, setShowAllCharts] = useState(false);
  const [keepAlarm, setKeepAlarm] = useState("false");
  const [isAutoEnabled, setIsAutoEnabled] = useState(false);
  const [savedData, setSavedData] = useState({});
  const [hasDataChanges, setHasDataChanges] = useState(false);
  const [sensorVersion, setSensorVersion] = useState(null);

  const [sidemenuState, sidemenuDispatch] = useReducer(
    sidemenuReducer,
    initialSidemenuState
  );
  const [chartState, chartDispatch] = useReducer(
    chartReducer,
    initialChartState
  );

  const value = {
    sidemenuAnomalies: sidemenuState.anomalies,
    setChartDateRange: sidemenuState.setDateRange,
    turnOnTimestamp: sidemenuState.turnOnTimestamp,
    sidemenuContext: sidemenuState.context,
    waitingFeedbackAnomalies: sidemenuState.waitingFeedbackAnomalies,
    loadSpot: (anomalies, turnOnTimestamp) => {
      sidemenuDispatch({
        type: sidemenuAction.LOAD_SPOT,
        anomalies,
        turnOnTimestamp,
      });
    },
    updateAnom: (anomalies) => {
      sidemenuDispatch({ type: sidemenuAction.UPDATE_ANOM, anomalies });
    },
    setChartStates: (newSetDateRange) => {
      sidemenuDispatch({
        type: sidemenuAction.SET_CHART_STATES,
        newSetDateRange,
      });
    },
    toggleSidemenu: (newContext) => {
      sidemenuDispatch({ type: sidemenuAction.TOGGLE_SIDEMENU, newContext });
    },
    toggleAnom: (newTurnOnTimestamp) => {
      sidemenuDispatch({
        type: sidemenuAction.TOGGLE_ANOM,
        newTurnOnTimestamp,
      });
    },
    chartSubscribers: chartState.chartSubscribers,
    tabOpen: chartState.tabOpen,
    notifyAnomChange: (anomId, anomType, hover) => {
      for (let key in chartState.chartSubscribers) {
        chartState.chartSubscribers[key]({
          anomId: anomId,
          anomType: anomType,
          hover: hover,
        });
      }
    },
    addAnomObserver: (name, callbackFunc) => {
      chartDispatch({ type: chartAction.ADD_SUBSCRIBER, name, callbackFunc });
    },
    notifyTabChange: (tab) => {
      let anoms = {};
      let show;
      let tabSelected;
      switch (tab) {
        case 0:
          show = true;
          tabSelected = "WAITING";
          break;
        case 1:
          show = false;
          tabSelected = "VERIFIED";
          break;
        default:
          break;
      }
      for (let anomaly of sidemenuState.anomalies) {
        anoms["anom_" + anomaly.detected_anom_user_id] =
          anomaly.anom_type === "WAITING_FEEDBACK" ? show : !show;
      }
      for (let key in chartState.tabChangeSubscribers) {
        chartState.tabChangeSubscribers[key](anoms);
      }
      chartDispatch({ type: chartAction.CHANGE_TAB, tabSelected });
    },
    addTabObserver: (name, callbackFunc) => {
      chartDispatch({
        type: chartAction.ADD_SUBSCRIBER_TAB_CHANGE,
        name,
        callbackFunc,
      });
    },
    trainingPeriod,
    setTrainingPeriod,
    pageDate,
    setPageDate,
    metric,
    setMetric,
    limit,
    setLimit,
    view,
    setView,
    validLimit,
    setValidLimit,
    periodOnList,
    setPeriodOnList,
    loadingAutomatic,
    setLoadingAutomatic,
    validSpec,
    setValidSpec,
    velocityAverage,
    setVelocityAverage,
    accelerationAverage,
    setAccelerationAverage,
    standardSettings,
    setStandardSettings,
    showAllCharts,
    setShowAllCharts,
    keepAlarm,
    setKeepAlarm,
    isAutoEnabled,
    setIsAutoEnabled,
    loadingAutomaticInfo,
    setLoadingAutomaticInfo,
    savedData,
    setSavedData,
    hasDataChanges,
    setHasDataChanges,
    sensorVersion,
    setSensorVersion,
  };

  return (
    <RightSideMenuContext.Provider value={value}>
      {children}
    </RightSideMenuContext.Provider>
  );
}

export { RightSideMenuContext, RightSideMenuProvider };
