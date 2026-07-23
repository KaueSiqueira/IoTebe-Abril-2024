import { useCallback, useContext, useEffect, useState } from "react";
import {
  DashgroupContext,
  DiagnosticContext,
  WhichRenderContext,
} from "../../contexts";
import { findNode, getGroupChildren, mountFullPath } from "../../utilities";
import { getGroupAlarmHistory } from "../../apis";

export default function useInsightsAndAlerts() {
  const { load, setLoad, updateChildrenFunctionLoop } =
    useContext(DashgroupContext);

  const {
    treeData,
    selectedNode,
    selectedNodeChildren,
    setSelectedNode,
    setSelectedNodeFullPath,
    setSelectedNodeChildren,
    setSpotPage,
    setWhichClicked,
  } = useContext(WhichRenderContext);

  const { setSpecifcRedirect } = useContext(DiagnosticContext);

  const [cards, setCards] = useState([]);
  const [error, setError] = useState(false);
  const [cardType, setCardType] = useState("pending");

  const loadData = useCallback(
    async (spot_group_id, activeLoading, cardType) => {
      setError(false);
      activeLoading && setLoad({ type: "insight", payload: true });

      try {
        let res = await getGroupAlarmHistory(spot_group_id, cardType);
        res = res.data;
        if (cardType === "pending") {
          res = res.sort((a, b) =>
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
        } else {
          res = res.sort(
            (a, b) => b.end_diagnostic_time - a.end_diagnostic_time
          );
        }
        setCards(res);
      } catch (error) {
        console.error(error);
        setError(error);
      } finally {
        setLoad({ type: "insight", payload: false });
      }
    },
    [setLoad]
  );

  const handleClickSpot = (tree_id, diagnostic_type, diagnostic_card_id) => {
    const { node } = findNode(treeData, tree_id);
    sessionStorage.setItem(
      "whichClicked",
      JSON.stringify({
        tree_id: node.tree_id,
      })
    );
    setSelectedNode(node);
    setSelectedNodeFullPath(mountFullPath(treeData, tree_id, false));
    setSelectedNodeChildren(getGroupChildren(node));
    setWhichClicked({
      tree_id: node.tree_id,
    });
    setSpecifcRedirect({
      diagnostic_type: diagnostic_type,
      diagnostic_card_id: diagnostic_card_id,
    });
    setSpotPage("diagnostic");
  };

  const handleClickCardType = (type) => {
    setCardType(type);
    loadData(selectedNode.id, true, type);
  };

  useEffect(() => {
    setCardType("pending");
    loadData(selectedNode.id, true, "pending");
  }, [loadData, selectedNode.id]);

  useEffect(() => {
    updateChildrenFunctionLoop({
      id: "insight",
      childFunction: () => loadData(selectedNode.id, false, cardType),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cardType, loadData, selectedNode.id]);

  return {
    load,
    error,
    cards,
    noData: !selectedNodeChildren[0],
    handleClickSpot,
    cardType,
    handleClickCardType,
    setCards,
  };
}
