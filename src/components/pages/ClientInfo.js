import axios from "axios";
import { useAuth0 } from '@auth0/auth0-react';
import { useContext, useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { UserContext } from '../../contexts/UserContext';
import Backdrop from '../UI/Backdrop';
import NewClient from "../clients/NewClient";
import ClientList from "../clients/ClientList";
import LoadedClientsContext from "../../contexts/LoadedClientContext";
import classes from "../UI/SearchBar.module.css";



function ClientInfoPage() {

    //contexts
    const { isAuthenticated } = useAuth0();
    const { loggedUser } = useContext(UserContext);
    const clientContext = useContext(LoadedClientsContext);

    //states
    const [isLoading, setIsLoading] = useState(true);
    const [clientPostIsOpen, setClientPostIsOpen] = useState(false);
    const [error, setError] = useState(null);
    const [loadedClients, setLoadedClients] = useState([])
    const [searchTerm, setSearchTerm] = useState("")




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
                    clientContext.loadedClients = clients
                    return setLoadedClients(clients);

                }).catch(err => {

                    setIsLoading(false);
                    setError(err.message);

                });
            }
            getClients();
        }

    }, [isAuthenticated, loggedUser, clientContext]);


    async function updateClientList(clientData) {

        await axios.post(`http://localhost:8080/clients/${loggedUser}`, clientData)

            .then(response => {

                if (response.statusText !== 'Created') {

                    throw Error(response.statusText)
                }

                clientContext.addClient(response.data);

            }).catch(err => {

                setError(err.message);
                console.log(error)
            })
    }

    function openClientPost() {
        return setClientPostIsOpen(true);
    }

    function closeClientPost() {
        return setClientPostIsOpen(false);
    }

    function search(clients) {
        return clients.filter(client =>
            client.first_name.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1 ||
            client.last_name.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1 ||
            client.company_name.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1);
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

            <form className={classes.position}>
                <label htmlFor="filter-clients">
                    <span className={classes.hide}>Find Client</span>
                </label>
                <input
                    type="text"
                    id="filter-clients"
                    placeholder="Find Client by Name or Company"
                    className={classes.searchBar}
                    value={searchTerm}
                    onChange={(event) => setSearchTerm(event.target.value)}
                />
            </form>

            <ClientList clientInfo={search(loadedClients)} />

        </section>

    )
}

export default ClientInfoPage;