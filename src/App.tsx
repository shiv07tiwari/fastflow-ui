import React from "react";
import './firebase';
import {ReactFlowProvider} from "reactflow";
import Workflow from "./pages/workflow";

import {
    createBrowserRouter,
    RouterProvider
} from "react-router-dom"

function App() {
    const router = createBrowserRouter([
        {
            path: "/",
            element: <div>Welcome to FastFlow</div>,
        },
        {
            path: "/workflow/:id",
            element: <Workflow/>,
        }
    ]);
    return (
        <div>
            <ReactFlowProvider>
                <RouterProvider router={router}/>
            </ReactFlowProvider>
        </div>
    );
}

export default App;