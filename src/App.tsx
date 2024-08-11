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
import {Button, NextUIProvider} from "@nextui-org/react";
import { GoogleOAuthProvider, useGoogleLogin} from "@react-oauth/google";

function GoogleLoginButton() {

    const login = useGoogleLogin({
        onSuccess: tokenResponse => console.log(tokenResponse),
        scope: 'https://www.googleapis.com/auth/spreadsheets https://www.googleapis.com/auth/gmail.compose https://www.googleapis.com/auth/drive',
        flow: 'auth-code',
    });

    return (<Button onClick={() => login()}>Sign in with Google 🚀</Button>);
}


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
        },
        {
            path:"/auth",
            element: <GoogleLoginButton />
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