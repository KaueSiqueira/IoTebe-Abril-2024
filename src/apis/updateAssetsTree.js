import { walk } from "react-sortable-tree";
import { AxiosInstance } from "./AxiosInstance";
import { hasPermission } from "../components/ProtectedFeature/ProtectedFeature";

export async function updateAssetsTree(Tree, removed) {
  const api = new AxiosInstance("updateassetstree");
  const formatedTree = [];

  walk({
    treeData: Tree,
    ignoreCollapsed: false,
    getNodeKey: ({ treeIndex }) => treeIndex,
    callback: (node) => {
      if (hasPermission(["CONFIG_ASSETS_TREE"], node.node.permission)) {
        formatedTree.push({
          index: node.treeIndex,
          parent: !node.parentNode ? null : Number(node.parentNode.id),
          id: node.node.id,
          type: node.node.type,
          name: node.node.title,
          sensor_id: node.node.sensor_id,
        });
      }
    },
  });

  const data = {
    spot_tree: formatedTree,
    groups_removed: removed.removed_groups,
    spots_removed: removed.removed_spots,
  };
  return api.axiosPut(data);
}
