import React from "react";
import {ReactFlowProvider} from "reactflow";
import Workflow from "./pages/workflow";


const App: React.FC = () => {
  return (
    <ReactFlowProvider>
      <Workflow workflowId={'1'} />
    </ReactFlowProvider>
  );
};

export default App;