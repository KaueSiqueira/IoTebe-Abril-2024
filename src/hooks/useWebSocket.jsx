import { useEffect, useState } from "react";
import { getCurrentAccessToken } from "../utilities";

const useWebSocket = () => {
  const [webSocketConnection, setWebSocketConnection] = useState(null);

  const createtWebSocketConnection = async () => {
    const accessToken = await getCurrentAccessToken();
    const webSocketConnection = new WebSocket(
      `${process.env.REACT_APP_HOST_WEBSOCKET}?token=${accessToken}`
    );
    setWebSocketConnection(webSocketConnection);

    return { webSocketConnection, accessToken };
  };

  const closeWebSocketConnection = (webSocketConnection) => {
    webSocketConnection.close();
    setWebSocketConnection(null);
  };

  const onReceiveMessage = (webSocketConnection, onReceiveFunction) => {
    webSocketConnection.addEventListener("message", (event) => {
      onReceiveFunction(event);
    });
  };

  const sendWebSocketMessage = (webSocketConnection, messageToSend) => {
    if (webSocketConnection.readyState !== WebSocket.OPEN) {
      webSocketConnection.addEventListener("open", () => {
        webSocketConnection.send(JSON.stringify(messageToSend));
      });
    } else {
      webSocketConnection.send(JSON.stringify(messageToSend));
    }
  };

  useEffect(() => {
    return () => {
      if (webSocketConnection) {
        webSocketConnection.close();
      }
    };
  }, [webSocketConnection]);

  return {
    createtWebSocketConnection,
    closeWebSocketConnection,
    onReceiveMessage,
    sendWebSocketMessage,
  };
};

export default useWebSocket;
