import LoginButton from "../UI/LoginButton";
import { useAuth0 } from '@auth0/auth0-react';
import { Navigate } from 'react-router-dom';

function LoginPage() {

    //contexts
    const { isAuthenticated } = useAuth0();

    if (isAuthenticated) {
        return <Navigate to='/user-profile' />
    }

    return (
        <section>
            {isAuthenticated && <Navigate to='/user-profile' />}
            <div>
                <LoginButton />
            </div>
        </section>
    )
}

export default LoginPage;
