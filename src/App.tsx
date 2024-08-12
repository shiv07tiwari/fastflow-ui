import React from "react";
import './firebase';
import {ReactFlowProvider} from "reactflow";
import Workflow from "./pages/workflow";

import {
    createBrowserRouter,
    RouterProvider
} from "react-router-dom"
import LandingPage from "./pages/landing";
import {NextUIProvider} from "@nextui-org/react";
import { GoogleOAuthProvider} from "@react-oauth/google";
import Login from "./pages/login";
import Dashboard from "./pages/dashboard";

function App() {
    const router = createBrowserRouter([
        {
            path: "/",
            element: <Dashboard/>,
        },
        {
            path: "/workflow/:id",
            element: <Workflow/>,
        },
        {
            path: "/test",
            element: <></>,
        },
        {
            path:"/auth",
            element: <Login />
        }
    ]);
    return (
        <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID || ''}>
            <NextUIProvider>
                <div>
                    <ReactFlowProvider>
                        <RouterProvider router={router}/>
                    </ReactFlowProvider>
                </div>
            </NextUIProvider>
        </GoogleOAuthProvider>

    );
}

export default App;