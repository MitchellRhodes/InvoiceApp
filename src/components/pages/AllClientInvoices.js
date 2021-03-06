import { useAuth0 } from '@auth0/auth0-react';
import LoadedClientsContext from '../../contexts/LoadedClientContext';
import axios from "axios";

import { useContext, useEffect, useState } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import InvoiceList from '../invoices/InvoiceList';
import LoadedInvoicesContext from '../../contexts/loadedInvoicesContext';


function AllClientInvoicesPage() {

    //Contexts
    const { isAuthenticated } = useAuth0();
    const clientContext = useContext(LoadedClientsContext);
    const invoiceContext = useContext(LoadedInvoicesContext);

    //states
    const [chosenClient, setChosenClient] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [loadedInvoices, setLoadedInvoices] = useState([]);
    const [showCompleted, setShowCompleted] = useState(false);


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

                    const invoices = response.data;

                    setIsLoading(false);
                    setError(null);
                    invoiceContext.loadedInvoices = invoices;
                    setLoadedInvoices(invoices)

                }).catch(err => {

                    setIsLoading(false);
                    setError(err.message);

                });


            }
            getInvoices();

        }



    }, [clientId, clientContext.loadedClients, chosenClient.id, isAuthenticated, invoiceContext])


    function showCompletedInvoices() {

        return setShowCompleted(true);
    }


    function showUnpaidInvoices() {

        return setShowCompleted(false);
    }


    return (
        <section>
            {!isAuthenticated && <Navigate to='/' />}
            {error && <div>{error}</div>}
            {isLoading && <div>Loading...</div>}



            {!showCompleted &&
                <div>
                    <h1>{chosenClient.first_name}'s Unpaid invoices</h1>
                    <button onClick={showCompletedInvoices}>Show Completed Invoices</button>
                </div>
            }

            {showCompleted &&
                <div>
                    <h1>{chosenClient.first_name}'s Paid invoices</h1>
                    <button onClick={showUnpaidInvoices}>Show Unpaid Invoices</button>
                </div>
            }

            <InvoiceList clientInvoices={loadedInvoices} showCompleted={showCompleted} />



        </section>
    )
}

export default AllClientInvoicesPage;