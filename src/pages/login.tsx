import React, {useEffect} from "react";
import {useGoogleLogin} from "@react-oauth/google";
import axios from "axios";
import {useNavigate} from "react-router-dom";
import {
    Tabs,
    Tab,
    Input,
    Link,
    Button,
    Card,
    CardBody,
    CardHeader,
    Navbar,
    NavbarBrand,
    NavbarContent, Dropdown, DropdownTrigger, Avatar, DropdownMenu, DropdownItem, CardFooter
} from "@nextui-org/react";
import {MdAdd} from "react-icons/md";

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
                `${process.env.REACT_APP_BACKEND_BASE_URL}/google-auth`,
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
        <Button
                onClick={login}
                variant='bordered'
                className="w-full flex items-center justify-center"
            >
                <img src={`/assets/google.png`} alt={`Logo Icon`} className="mr-3"
                     style={{width: "24px", height: "24px", "marginRight": '8px'}}/>
                Sign in with Google
            </Button>
    );
}

const Login = () => {
  return (
    <div className="flex items-center justify-center" style={{height: window.innerHeight}}>
      <Card className="w-[350px]">
        <CardHeader>
          <h2 className="text-2xl font-bold text-center">Welcome to Fastflow</h2>
        </CardHeader>
        <CardBody>
          <p className="text-center text-gray-600 mb-6">
            Sign in to access your account
          </p>
            <GoogleLoginButton />
        </CardBody>
      </Card>
    </div>
  );
};

export default Login;