import { useEffect } from "react";

import { useAuth0 } from '@auth0/auth0-react';
import { Navigate } from 'react-router-dom';
import axios from "axios";


function UserProfilePage() {

    const { user, isAuthenticated, logout } = useAuth0();

    useEffect(() => {

        if (!isAuthenticated) {

            return <Navigate to='/' />
        } else {

        }

    }, []);


    return (
        <h1>User Profile</h1>
    )
}

export default UserProfilePage;