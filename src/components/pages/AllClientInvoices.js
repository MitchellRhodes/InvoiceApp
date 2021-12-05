import { useAuth0 } from '@auth0/auth0-react';
import LoadedClientsContext from '../../contexts/LoadedClientContext';

import { useContext, useEffect, useState } from 'react';
import { Navigate, useParams } from 'react-router-dom';


function AllClientInvoicesPage() {

    //Contexts
    const { isAuthenticated } = useAuth0();
    const clientContext = useContext(LoadedClientsContext);

    //states
    const [chosenClient, setChosenClient] = useState({});


    //URL Param
    const { clientId } = useParams();


    useEffect(() => {

        function getClient() {

            let chosen = clientContext.loadedClients.find(client => client.id === +clientId);

            return setChosenClient(chosen);
        }

        getClient();

    }, [clientId, clientContext.loadedClients])



    if (!isAuthenticated) {

        return <Navigate to='/' />

    }

    return (
        <h1>All {chosenClient.first_name}'s' invoices</h1>
    )
}

export default AllClientInvoicesPage;