import { Outlet } from 'react-router-dom'
import AppTopBar from "./AppTopBar";
export default function Layout() {
    return (
        <>
            <AppTopBar />
            <Outlet />
        </>
    )
}