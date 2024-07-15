import React from "react";
import './firebase';
import {ReactFlowProvider} from "reactflow";
import Workflow from "./pages/workflow";

import {
    createBrowserRouter,
    RouterProvider
} from "react-router-dom"

function App() {
    /*
     Define the routes for the application and render the appropriate component based on the route.
    */

    const router = createBrowserRouter([
        {
            path: "/",
            element: <div>Welcome to FastFlow</div>,
        },
        // Define the route for the workflow page with workflow id as a parameter
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