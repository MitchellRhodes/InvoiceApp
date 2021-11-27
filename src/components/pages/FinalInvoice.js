import { useAuth0 } from '@auth0/auth0-react';
import { Navigate } from 'react-router-dom';

function FinalInvoicePage() {

    //contexts
    const { isAuthenticated } = useAuth0();

    if (!isAuthenticated) {

        return <Navigate to='/' />

    }

    return (
        <section>
            <h1>Final Invoice</h1>
            <button>Send Invoice</button>
            <button>Cancel</button>
        </section>

    )
}

export default FinalInvoicePage;