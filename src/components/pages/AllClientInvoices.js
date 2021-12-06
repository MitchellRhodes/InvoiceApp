import { useAuth0 } from '@auth0/auth0-react';
import LoadedClientsContext from '../../contexts/LoadedClientContext';
import axios from "axios";

import { useContext, useEffect, useState } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import InvoiceList from '../invoices/InvoiceList';


function AllClientInvoicesPage() {

    //Contexts
    const { isAuthenticated } = useAuth0();
    const clientContext = useContext(LoadedClientsContext);

    //states
    const [chosenClient, setChosenClient] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [loadedInvoices, setLoadedInvoices] = useState([]);


    //URL Param
    const { clientId } = useParams();


    useEffect(() => {

        if (!isAuthenticated) {

            return <Navigate to='/' />

        } else {

            function getClient() {

                let chosen = clientContext.loadedClients.find(client => client.id === +clientId);

                return setChosenClient(chosen);
            }

            getClient();

            async function getInvoices() {

                setIsLoading(true);

                await axios.get(
                    `http://localhost:8080/invoices/${+clientId}`
                ).then(response => {

                    if (response.statusText !== 'OK') {

                        throw Error(response.statusText)
                    }

                    setIsLoading(false);
                    setError(null);
                    setLoadedInvoices(response.data)

                }).catch(err => {

                    setIsLoading(false);
                    setError(err.message);

                });


            }
            getInvoices();

        }



    }, [clientId, clientContext.loadedClients, chosenClient.id, isAuthenticated])




    return (
        <section>
            {!isAuthenticated && <Navigate to='/' />}
            {error && <div>{error}</div>}
            {isLoading && <div>Loading...</div>}

            <h1>All of {chosenClient.first_name}'s' invoices</h1>

            <InvoiceList clientInvoices={loadedInvoices} />

        </section>
    )
}

export default AllClientInvoicesPage;