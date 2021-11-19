import axios from "axios";
import { useAuth0 } from '@auth0/auth0-react';
import { useContext, useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { UserContext } from '../../contexts/UserContext';
import Backdrop from '../UI/Backdrop';
import NewClient from "../clients/NewClient";
import ClientList from "../clients/ClientList";



function ClientInfoPage() {

    const { isAuthenticated } = useAuth0();
    const { loggedUser } = useContext(UserContext);

    const [isLoading, setIsLoading] = useState(true);
    const [clientPostIsOpen, setClientPostIsOpen] = useState(false);
    const [loadedClients, setLoadedClients] = useState({});
    const [error, setError] = useState(null);


    useEffect(() => {

        if (!isAuthenticated) {

            return <Navigate to='/' />
        } else {

            const getClients = async () => {

                setIsLoading(true);

                await axios.get(
                    `http://localhost:8080/clients/${loggedUser}`
                ).then(response => {

                    if (response.statusText !== 'OK') {

                        throw Error(response.statusText)
                    }

                    const clients = response.data

                    setIsLoading(false);
                    setError(null);
                    return setLoadedClients(clients);

                }).catch(err => {

                    setIsLoading(false);
                    setError(err.message);

                });
            }
            getClients();
        }

    }, [isAuthenticated, loggedUser]);

    async function updateClientList(clientData) {
        //post
    }

    function openClientPost() {
        return setClientPostIsOpen(true);
    }

    function closeClientPost() {
        return setClientPostIsOpen(false);
    }

    return (
        <section>
            {!isAuthenticated && <Navigate to='/' />}
            {error && <div>{error}</div>}
            {isLoading && <div>Loading...</div>}

            <h2>Client Information</h2>

            <div>
                <button onClick={openClientPost}>Add Client</button>
                {clientPostIsOpen ? <NewClient onConfirm={closeClientPost} onCancel={closeClientPost} updateClients={updateClientList} /> : null}
                {clientPostIsOpen ? <Backdrop onClick={closeClientPost} /> : null}
            </div>
            <ClientList clientInfo={loadedClients} />

        </section>

    )
}

export default ClientInfoPage;