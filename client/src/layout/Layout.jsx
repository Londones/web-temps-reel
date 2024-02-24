import { useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import LoginForm from "../components/LoginForm";
import AppTopBar from "./AppTopBar";
import useAuth from "../hooks/useAuth";


export default function Layout() {
    const navigate = useNavigate();
    const { auth } = useAuth();

    useEffect(() => {
        if (!auth) {
            navigate('/login');
        }
    }, [navigate]);

    return (
        <>
            {auth ? <AppTopBar /> : <LoginForm />}
            <Outlet />
        </>
    );
}
