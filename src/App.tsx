import React from "react";
import {ReactFlowProvider} from "reactflow";
import Workflow from "./pages/workflow";


const App: React.FC = () => {
  return (
    <ReactFlowProvider>
        <div className="d-flex flex-row">
            <Workflow workflowId={'WF0'} />
        </div>
    </ReactFlowProvider>
  );
};

export default App;