import { useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import LoginForm from "../components/LoginForm";
import AppTopBar from "./AppTopBar";

export default function Layout() {
    const navigate = useNavigate();
    const [userState, setUserState] = useState(false);

    useEffect(() => {
        const userConnected = JSON.parse(localStorage.getItem('userConnected'));
        setUserState(userConnected);
        if (!userConnected) {
            navigate('/login');
        }
    }, [navigate]);

    return (
        <>
            {userState ? <AppTopBar /> : <LoginForm />}
            <Outlet />
        </>
    );
}
