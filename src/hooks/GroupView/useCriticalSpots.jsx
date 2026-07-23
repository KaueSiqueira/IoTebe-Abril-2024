import { useContext, useEffect, useState } from "react";
import { DashgroupContext, WhichRenderContext } from "../../contexts";
import { getGroupAlarmHistory, getSpotSummaryByGroupId } from "../../apis";

export default function useCriticalSpots() {
  const { load, setLoad, updateChildrenFunctionLoop } =
    useContext(DashgroupContext);
  const { selectedNode } = useContext(WhichRenderContext);

  const [offlineSensors, setOfflineSensors] = useState(0);
  const [offlineGateways, setOfflineGateways] = useState(0);
  const [criticalBatterys, setCriticalBatterys] = useState(0);
  const [totalSensors, setTotalSensors] = useState(0);
  const [totalGateways, setTotalGateways] = useState(0);
  const [yellowCards, setYellowCards] = useState(0);
  const [redCards, setRedCards] = useState(0);
  const [totalSpots, setTotalSpots] = useState(0);

  const handleCountCards = (data) => {
    const countYellowCards = data.reduce((count, obj) => {
      if (obj.status_color === "YELLOW") {
        return count + 1;
      }
      return count;
    }, 0);

    const countRedCards = data.reduce((count, obj) => {
      if (obj.status_color === "RED") {
        return count + 1;
      }
      return count;
    }, 0);

    setYellowCards(countYellowCards);
    setRedCards(countRedCards);
  };

  const organizeSummary = async (spotsSummary) => {
    const uniqueSensorIds = new Set();
    const countTotalSensors = spotsSummary.reduce((count, obj) => {
      if (obj.sensor_id && !uniqueSensorIds.has(obj.sensor_id)) {
        uniqueSensorIds.add(obj.sensor_id);
        return count + 1;
      }
      return count;
    }, 0);

    const uniqueGatewayIds = new Set();
    const countTotalGateways = spotsSummary.reduce((count, obj) => {
      if (obj.gateway_id && !uniqueGatewayIds.has(obj.gateway_id)) {
        uniqueGatewayIds.add(obj.gateway_id);
        return count + 1;
      }
      return count;
    }, 0);

    const now = Math.floor(Date.now() / 1000);
    const uniqueOfflineSensor = new Set();
    const countOfflineSensor = spotsSummary.reduce((count, obj) => {
      const diffInSeconds = now - obj.global_last_collect;
      const diffInHours = Math.floor(diffInSeconds / 3600);
      if (
        obj.sensor_id &&
        diffInHours >= 3 &&
        !uniqueOfflineSensor.has(obj.spot_id)
      ) {
        uniqueOfflineSensor.add(obj.spot_id);
        return count + 1;
      }
      return count;
    }, 0);

    const uniqueOfflineGateway = new Set();
    const countOfflineGateway = spotsSummary.reduce((count, obj) => {
      const diffInSeconds = now - obj.gateway_last_connection_update;
      const diffInMinutes = Math.floor(diffInSeconds / 60);
      if (
        obj.gateway_internet_connection === 0 &&
        diffInMinutes >= 10 &&
        !uniqueOfflineGateway.has(obj.gateway_id)
      ) {
        uniqueOfflineGateway.add(obj.gateway_id);
        return count + 1;
      }
      return count;
    }, 0);

    const countCriticalBattery = spotsSummary.reduce((count, obj) => {
      if (obj.battery_level && obj.battery_level <= 15) {
        return count + 1;
      }
      return count;
    }, 0);

    setTotalSpots(spotsSummary.length);
    setTotalSensors(countTotalSensors);
    setTotalGateways(countTotalGateways);
    setOfflineSensors(countOfflineSensor);
    setOfflineGateways(countOfflineGateway);
    setCriticalBatterys(countCriticalBattery);
  };

  useEffect(() => {
    const loadData = async (spot_group_id, activeLoading) => {
      activeLoading && setLoad({ type: "critical", payload: true });

      try {
        let res = await getGroupAlarmHistory(spot_group_id);
        res = res.data.sort((a, b) =>
          a.status_color > b.status_color
            ? 1
            : b.status_color > a.status_color
            ? -1
            : a.last_alarmed_time > b.last_alarmed_time
            ? -1
            : b.last_alarmed_time > a.last_alarmed_time
            ? 1
            : 0
        );
        handleCountCards(res);
        res = await getSpotSummaryByGroupId(spot_group_id);
        if(res.data)
          organizeSummary(res.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoad({ type: "critical", payload: false });
      }
    };

    loadData(selectedNode.id, true);

    updateChildrenFunctionLoop({
      id: "critical",
      childFunction: () => loadData(selectedNode.id, false),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedNode.id, setLoad]);

  return {
    offlineSensors,
    offlineGateways,
    criticalBatterys,
    totalSensors,
    totalGateways,
    yellowCards,
    redCards,
    totalSpots,
    load,
  };
}
