import React from "react";
import './firebase';
import {ReactFlowProvider} from "reactflow";
import Workflow from "./pages/workflow";

import {
    createBrowserRouter,
    RouterProvider
} from "react-router-dom"
import LandingPage from "./pages/landing";
// Import css file from ./App.css
import './App.css';
import {NextUIProvider} from "@nextui-org/react";

function App() {
    const router = createBrowserRouter([
        {
            path: "/",
            element: <LandingPage/>,
        },
        {
            path: "/workflow/:id",
            element: <Workflow/>,
        },
        {
            path: "/test",
            element: <></>,
        }
    ]);
    return (
        <NextUIProvider>
            <div>
                <ReactFlowProvider>
                    <RouterProvider router={router}/>
                </ReactFlowProvider>
            </div>
        </NextUIProvider>

    );
}

export default App;