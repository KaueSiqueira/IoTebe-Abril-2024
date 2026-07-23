import { useContext, useEffect, useState } from "react";
import { RightSideMenuContext, WhichRenderContext } from "../../contexts";

export default function useRightMenu() {
  const [spotId, setSpotId] = useState(false);

  const { sidemenuContext, sensorVersion } = useContext(RightSideMenuContext);

  const { selectedNodeChildren } = useContext(WhichRenderContext);

  useEffect(() => {
    setSpotId(selectedNodeChildren[0]);
  }, [selectedNodeChildren]);

  return {
    sidemenuContext,
    spotId,
    sensorVersion,
  };
}
