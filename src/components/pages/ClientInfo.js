import { useAuth0 } from '@auth0/auth0-react';
import { Navigate } from 'react-router-dom';

function ClientInfoPage() {

    const { isAuthenticated } = useAuth0();

    if (!isAuthenticated) {

        return <Navigate to='/' />

    }

    return (
        <h1>Client Info</h1>
    )
}

export default ClientInfoPage;