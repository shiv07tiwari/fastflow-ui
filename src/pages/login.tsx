import React, { useEffect } from "react";
import { useGoogleLogin } from "@react-oauth/google";
import { Button } from "@nextui-org/react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function GoogleLoginButton() {
    const navigate = useNavigate();

    useEffect(() => {
        const email = localStorage.getItem('email');
        const name = localStorage.getItem('name');

        if (email && name) {
            // User data exists, redirect to home page
            navigate('/');
        }
    }, [navigate]);

    const onLoginSuccess = async (response: any) => {
        try {
            const apiResponse = await axios.post(
                'http://localhost:8000/google-auth',
                {
                    token: response.code,
                }
            );

            localStorage.setItem('email', apiResponse.data.email);
            localStorage.setItem('name', apiResponse.data.name);
            localStorage.setItem('photoUrl', apiResponse.data.photo_url);

            // Redirect to the home page
            navigate('/');
        } catch (error) {
            console.error("Login error:", error);
            // Handle error (e.g., show an error message to the user)
        }
    };

    const login = useGoogleLogin({
        onSuccess: tokenResponse => onLoginSuccess(tokenResponse),
        scope: 'https://www.googleapis.com/auth/spreadsheets https://www.googleapis.com/auth/gmail.compose https://www.googleapis.com/auth/drive https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile',
        flow: 'auth-code',
    });

    return (
        <Button onClick={() => login()}>Sign in with Google 🚀</Button>
    );
}

const Login: React.FC = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const email = localStorage.getItem('email');
        const name = localStorage.getItem('name');

        if (email && name) {
            // User data exists, redirect to home page
            navigate('/');
        }
    }, [navigate]);

    return (
        <GoogleLoginButton />
    );
};

export default Login;