import React, { FunctionComponent } from "react";
import ReactDOM from "react-dom";

import { createManaged } from "coral-framework/lib/bootstrap";

import App from "./App";
import { initLocalState } from "./local";
import localesData from "./locales";

// Import css variables.
import "coral-ui/theme/admin.css";

async function main() {
  const ManagedCoralContextProvider = await createManaged({
    localesData,
    initLocalState,
    bundle: "install",
  });

  const Index: FunctionComponent = () => (
    <ManagedCoralContextProvider>
      <App />
    </ManagedCoralContextProvider>
  );

  // eslint-disable-next-line no-restricted-globals
  ReactDOM.render(<Index />, window.document.getElementById("app"));
}

void main();
