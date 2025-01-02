import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { Provider } from "./components/ui/provider";
import { Box } from "@chakra-ui/react";
import "./index.css"


ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <Provider >
      <Box className="container" bgColor={"blackAlpha.700"} backgroundPosition={"center"} backgroundBlendMode={"multiply"} backgroundRepeat={"no-repeat"} backgroundSize={"cover"} height={"100vh"} width={"100vw"}>
      <App  /></Box>
    </Provider>
  </React.StrictMode>,
);
