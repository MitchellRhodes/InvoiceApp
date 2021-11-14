import { useAuth0 } from '@auth0/auth0-react';
import { Navigate } from 'react-router-dom';

function UserProfilePage() {

    const { isAuthenticated } = useAuth0();

    if (!isAuthenticated) {

        return <Navigate to='/' />

    }

    return (
        <h1>User Profile</h1>
    )
}

export default UserProfilePage;